import CustomAlert from 'components/form-fields/CustomAlert';

export default function ErrorInformation() {
    return (
        <CustomAlert
            state="warning"
            message="Serverfehler - bitte kontaktiere die IT!"
        />
    );
}
