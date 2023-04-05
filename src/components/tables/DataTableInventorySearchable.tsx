import { FC, useEffect, useState } from "react";
import { IDatatabeInventorySearchable, IInventoryItem } from "components/interfaces";
import { usePrevious } from "utils/usePrevious";
import CustomAlert from "components/form-fields/CustomAlert";
import DataTableInventory from "components/tables/DataTableInventory";
import { Typography } from "@mui/material";


const DataTableInventorySearchable: FC<IDatatabeInventorySearchable> = (props) => {
    const {
        getSearchUrl,
        showSwitchAndLegend
    } = props;

    const [items, setItems] = useState<IInventoryItem[]>([]);
    const [searching, setSearching] = useState(false);
    const [search, setSearch] = useState("");
    const [firstSearch, setFirstSearch] = useState(true);
    const [noData, setNoData] = useState(false);
    const [serverError, setServerError] = useState(false);
    const prevSearch = usePrevious(search);

    useEffect(() => {
        if (search != prevSearch) {
            setSearching(true);
            searchItems();
        }
    });

    const handleError = (error: any) => {
        console.log(error);
        setServerError(true);
        setSearching(false);
    };

    const searchItems = () => {
        fetch(
            getSearchUrl(search),
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        )
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setSearching(false);
                            setItems(result);
                            if(firstSearch){
                                setFirstSearch(false);
                                setNoData(result.length == 0);
                            }
                        })
                        .catch((error) => {
                            handleError(error);
                        });
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
    };

    return (<>
            {serverError ? (
                <CustomAlert
                    state="warning"
                    message="Serverfehler - bitte kontaktiere die IT!"
                />
            ) : noData ? (
                <Typography
                    align="center"
                    marginBottom="3em"
                >
                    Es wurden noch keine Gegenstände erfasst.
                </Typography>
            ) : (
                <DataTableInventory
                    items={items}
                    setSearch={setSearch}
                    searching={searching}
                    showSearchBar={true}
                    showSwitchAndLegend={showSwitchAndLegend}
                />)
            }
        </>
    );
};

export default DataTableInventorySearchable;
