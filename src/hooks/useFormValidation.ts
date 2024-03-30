import { GenericObject, IFormValidation } from 'components/interfaces';

const useFormValidation = (
    form: GenericObject | null,
    fieldList: IFormValidation[],
    setFieldList: (list: IFormValidation[]) => void,
    isEveryFieldFilledOut?: boolean
) => {
    let copiedFieldList = [...fieldList];
    if (form) {
        copiedFieldList = copiedFieldList.map((field) => {
            field.error = form[field.name] === null || form[field.name] === '' || form[field.name] === undefined || form[field.name] === 0;
            return field;
        });
        setFieldList(copiedFieldList);
    }
    if (isEveryFieldFilledOut) {
        return fieldList.some((field) => field.error) && fieldList.some((field) => !field.error);
    }
    return fieldList.some((field) => field.error);
};
export default useFormValidation;
