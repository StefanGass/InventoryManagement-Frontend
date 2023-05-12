import { FC, useContext, useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { UserContext } from "pages/_app";
import AdminModeInformation from "components/layout/AdminModeInformation";
import PageHeader from "components/layout/PageHeader";
import DataTableInventory from "components/tables/DataTableInventory";
import { IDetailInventoryItem, IInventoryItem } from "components/interfaces";
import LoadingSpinner from "components/layout/LoadingSpinner";
import ErrorInformation from "components/layout/ErrorInformation";
import inventoryManagementService from "service/inventoryManagementService";
import { GridRowId } from "@mui/x-data-grid";
import CustomButton from "components/form-fields/CustomButton";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { DroppingActivationUtil } from "utils/droppingActivationUtil";
import { formatISO } from "date-fns";
import CustomAlert from "components/form-fields/CustomAlert";
const Warteschlange: FC = () => {
    const {
        admin,
        superAdmin,
        adminMode,
        departmentId,
        droppingReviewer,
        firstName,
        lastName,
        userId,
        setShowDroppingQueue
    } = useContext(UserContext);
    const [items, setItems] = useState<IDetailInventoryItem[]>([]);
    const [serverError, setServerError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
    const [selectionError,setSelectionError] = useState(false);

    const loadItems = () => {
        setLoading(true);
        setSelectionModel([])
        let request: Promise<IDetailInventoryItem[]>;
        if ((superAdmin || admin) && adminMode) {
            request = inventoryManagementService.getAllDroppingQueueInventoryItems();
        } else {
            if (!droppingReviewer) return;
            request = inventoryManagementService.getDroppingQueueInventoryItemsByDepartmentId(departmentId);
        }
        request.then(x => {
            setLoading(false);
            setItems(x);
            setShowDroppingQueue(!!x);
        }).catch(error => {
            console.log(error);
            setLoading(false);
            setServerError(true);
        });
    };

    useEffect(() => {
        loadItems();
    }, []);

    const send = (bestaetigen: boolean) => {
        let requests:Promise<any>[] = [];
        for (let item of items) {
            if (!selectionModel.find(x => (x as number) === item.id)) {
                continue;
            }
            if (bestaetigen) {
                if (DroppingActivationUtil.isAusscheiden(item)) {
                    const isoFormatDate = item.droppingQueueDate ? formatISO(new Date(item.droppingQueueDate), { representation: "date" }) : "";
                    const isoFormatDateTime = isoFormatDate + "T00:00:00Z";
                    if (item.droppingQueueReason) {
                        item.droppingQueueReason.trim();
                    }
                    let form: IDetailInventoryItem = {
                        ...item,
                        piecesDropped: Number(item.droppingQueuePieces) + item.piecesDropped,
                        piecesStored: item.piecesStored - Number(item.droppingQueuePieces),
                        droppingReason: item.droppingQueueReason,
                        droppingDate: isoFormatDateTime,
                        userName: `${firstName} ${lastName}`
                    };
                    DroppingActivationUtil.unsetDroppingProperties(form);
                   requests.push(inventoryManagementService.updateInventoryItem(form));
                } else if (DroppingActivationUtil.isDeaktivieren(item) && item.id) {
                    requests.push(inventoryManagementService.deactivateInventoryItem(item.id,{
                        ...item,
                        userName: `${firstName} ${lastName}`
                    }));
                }
            } else {
                let form: IInventoryItem = {
                    ...item,
                    userName: `${firstName} ${lastName}`
                };
                DroppingActivationUtil.unsetDroppingProperties(form);
                requests.push(inventoryManagementService.updateInventoryItem(form));
            }
            if(requests){
            Promise.all(requests).then(() => {
                    loadItems();
                }).catch(() => {
                loadItems();
                });
            }
        }
    };

    const getContent = () => {
        if (loading || serverError) {
            return (<></>);
        }
        return (<>
            <AdminModeInformation />
            <DataTableInventory items={items} setSearch={() => {
            }} includeDroppingInformation selectionModel={selectionModel} setSelectionModel={val => {
                setSelectionModel(val);
                if(items.filter(item => val.find(x => (x as number) === item.id) && item.droppingQueueRequester == userId).length > 0){
                    setSelectionError(true);
                }else{
                    setSelectionError(false)
                }
            }}
            />
            {selectionError &&
                <CustomAlert
                    state="error"
                    message="Auswahl darf keine Elemente enthalten, bei denen das Ausscheiden/Deaktivieren selbst angefordert wurde!"
                />
            }
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CustomButton
                    label={"Bestätigen"}
                    onClick={() => send(true)}
                    id="absendenButton"
                    symbol={<CheckCircle />}
                    disabled={selectionError}
                />
                <CustomButton
                    onClick={() => send(false)}
                    label={"Ablehnen"}
                    id="ablehnenButton"
                    symbol={<Cancel />}
                    disabled={selectionError}
                />
            </Grid>
        </>);
    };

    return (
        <Container maxWidth={false}>
            <Box sx={{ my: 12 }}>
                <>
                    <PageHeader title="Warteschlange" id="warteschlangeHeader"></PageHeader>
                    <LoadingSpinner hidden={!loading}></LoadingSpinner>
                    <ErrorInformation hidden={!serverError}></ErrorInformation>
                    {getContent()}
                </>
            </Box>
        </Container>
    );
};

export default Warteschlange;
