import { FC } from "react";
import { IHidden } from "components/interfaces";
import CustomAlert from "components/form-fields/CustomAlert";

const ErrorInformation:FC<IHidden> = (props) => {
    const {hidden} = props;
    if(hidden){
        return (<></>);
    }
    return (
        <CustomAlert
            state="warning"
            message="Serverfehler - bitte kontaktiere die IT!"
        />
    );
};

export default ErrorInformation;
