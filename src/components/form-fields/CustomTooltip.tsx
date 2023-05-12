import { FC } from "react";
import { Tooltip } from "@mui/material";
import { InfoRounded } from "@mui/icons-material";

interface ICustomTooltip {
    title: string;
}

export const CustomTooltip: FC<ICustomTooltip> = (props) => {
    const { title } = props;

    return <Tooltip
        title={title}
        sx={{ marginTop: "-1em", marginLeft: "-1.5em", marginRight: "0.5em" }}
    >
        <InfoRounded color="primary" />
    </Tooltip>;
};
