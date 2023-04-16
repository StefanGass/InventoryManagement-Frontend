import { FC, useContext } from "react";
import { Grid, Tooltip } from "@mui/material";
import { UserContext } from "pages/_app";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const AdminModeInformation: FC = () => {
    const { admin, superAdmin, adminMode } = useContext(UserContext);

    if (admin || superAdmin) {
        return (<Grid
            container
            width="95%"
            margin="auto"
            alignItems="center"
        >
            <Tooltip
                title={"Bitte auf dem Dashboard aktivieren/deaktivieren!"}
                placement="top"
            >
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={adminMode}
                                value={adminMode}
                                disabled={true}
                                id="adminModeSwitchInformation"
                            />
                        }
                        label={`${adminMode ? "Admin-Ansicht deaktivieren" : "Admin-Ansicht aktivieren"}`}
                    />
                </FormGroup>
            </Tooltip>
        </Grid>);
    }
    return (
        <></>
    );
};

export default AdminModeInformation;
