import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { IPageHeader } from "components/interfaces";

const PageHeader: FC<IPageHeader> = (props) => {
    const { title,id } = props;
    return (
        <Grid item>
            <Typography
                variant="h1"
                align="center"
                gutterBottom
                id={id}
            >
                {title}
            </Typography>
        </Grid>
    );
};

export default PageHeader;
