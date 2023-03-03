import { FC, MouseEvent, useEffect, useState } from 'react';
import { Container, Grid, Tooltip } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Cancel, CheckCircle, DeleteForever, InfoRounded, RestartAlt, RotateRight } from '@mui/icons-material';
import { IDetailInventoryItem, IReturningOptions } from 'components/interfaces';
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';
import CustomAlert from 'components/form-fields/CustomAlert';
import { formatISO } from 'date-fns';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';

interface IIssueReturnDropFormProps {
    inventoryForm: IDetailInventoryItem;
    onFormSent: (...params) => void;
    isSinglePieceItem: boolean;
    disabled?: boolean;
}

const IssueReturnDropForm: FC<IIssueReturnDropFormProps> = (props) => {
    const { inventoryForm, onFormSent, isSinglePieceItem, disabled } = props;

    const [startIssuingProcess, setStartIssuingProcess] = useState(false);
    const [startReturningProcess, setStartReturningProcess] = useState(false);
    const [startDroppingProcess, setStartDroppingProcess] = useState(false);

    const [pieces, setPieces] = useState('');
    const [piecesError, setPiecesError] = useState(false);
    const [text, setText] = useState('');
    const [textError, setTextError] = useState(false);
    const [textCharError, setTextCharError] = useState(false);
    const [date, setDate] = useState(String(new Date()));
    const [dateError, setDateError] = useState(false);

    const [returningValue, setReturningValue] = useState<IReturningOptions | null>(null);
    const [returningValueError, setReturningValueError] = useState(false);
    const [returningOptions, setReturningOptions] = useState<IReturningOptions[]>([]);
    const [returningPiecesMax, setReturningPiecesMax] = useState(1);

    const resetFields = () => {
        setPieces('');
        setText('');
        setDate('');
        setReturningValue(null);
        setPiecesError(false);
        setTextError(false);
        setDateError(false);
        setTextCharError(false);
        setReturningValueError(false);
    };

    useEffect(() => {
        setStartIssuingProcess(false);
        setStartReturningProcess(false);
        setStartDroppingProcess(false);
        resetFields();
    }, [disabled]);

    useEffect(() => {
        pieces && setPiecesError(false);
        text && setTextError(false);
        date && setDateError(false);
        !text.includes('~') && setTextCharError(false);
    }, [pieces, text, date]);

    useEffect(() => {
        !returningValue && setPieces('');
        returningValue && setPieces(returningValue.returningPieces.toString());
        returningValue && setReturningPiecesMax(returningValue.returningPieces);
        setPiecesError(false);
        setReturningValueError(false);
    }, [returningValue]);

    const getReturningOptions = () => {
        const tempList = inventoryForm.issuedTo?.split('\n');
        const resultList: IReturningOptions[] = [];
        if (tempList) {
            tempList.length = tempList.length - 1;
            for (let i = 0; i < tempList.length; i++) {
                const tempPieces = Number(tempList[i].split(' ~ ')[1].split(' ')[0]);
                const tempIssuedTo = tempList[i].split(' ~ ')[2] + ' (' + tempList[i].split(' ~ ')[0] + ')';
                resultList.push({ id: i, issuedTo: tempIssuedTo, returningPieces: tempPieces });
            }
            setReturningOptions(resultList);
        }
    };

    const getNewIssuedToString = (id: number) => {
        const tempList = inventoryForm.issuedTo?.split('\n');
        let newIssuedToString = '';
        if (tempList) {
            tempList.length = tempList.length - 1;
            for (let i = 0; i < tempList.length; i++) {
                if (i === id) {
                    const tempDate = tempList[i].split(' ~ ')[0];
                    let tempPieces = Number(tempList[i].split(' ~ ')[1].split(' ')[0]);
                    const tempIssuedTo = tempList[i].split(' ~ ')[2];
                    if (returningValue && returningValue.returningPieces !== Number(pieces)) {
                        tempPieces = tempPieces - Number(pieces);
                        newIssuedToString = newIssuedToString + tempDate + ' ~ ' + tempPieces + ' Stk. ~ ' + tempIssuedTo + '\n';
                    }
                } else {
                    newIssuedToString = newIssuedToString + tempList[i] + '\n';
                }
            }
        }
        return newIssuedToString;
    };

    const onStartIssuingProcessButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (startIssuingProcess) {
            setStartIssuingProcess(false);
            resetFields();
        } else {
            setPieces(String(inventoryForm.piecesStored));
            setDate(String(new Date()));
            setStartIssuingProcess(true);
        }
    };

    const onStartReturningProcessButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (startReturningProcess) {
            setStartReturningProcess(false);
            resetFields();
        } else {
            if (!isSinglePieceItem) {
                getReturningOptions();
            }
            setStartReturningProcess(true);
        }
    };

    const onStartDroppingProcessButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (startDroppingProcess) {
            setStartDroppingProcess(false);
            resetFields();
        } else {
            setPieces(String(inventoryForm.piecesStored));
            setDate(String(new Date()));
            setStartDroppingProcess(true);
        }
    };

    const onSendButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (startReturningProcess) {
            if (isSinglePieceItem) {
                onFormSent({
                    ...inventoryForm,
                    piecesIssued: 0,
                    piecesStored: 1,
                    issuedTo: '',
                    issueDate: null
                } as IDetailInventoryItem);
            } else {
                if (!returningValue || !pieces || pieces === '') {
                    if (!returningValue) {
                        setReturningValueError(true);
                    } else if (!pieces || pieces === '') {
                        setPiecesError(true);
                    }
                } else {
                    const newIssuedToString = getNewIssuedToString(returningValue.id);
                    onFormSent({
                        ...inventoryForm,
                        piecesIssued: inventoryForm.piecesIssued - Number(pieces),
                        piecesStored: inventoryForm.piecesStored + Number(pieces),
                        issuedTo: newIssuedToString,
                        issueDate: inventoryForm.piecesIssued - Number(pieces) !== 0 ? inventoryForm.issueDate : null
                    } as IDetailInventoryItem);
                }
            }
        } else {
            let formattedText = text.trim();
            if (!pieces || pieces === '' || !text || text === '' || formattedText.length === 0 || text.includes('~') || !date || date === '') {
                if (!pieces || pieces === '') {
                    setPiecesError(true);
                }
                if (!text || text === '') {
                    setTextError(true);
                }
                if (formattedText.length === 0) {
                    setTextError(true);
                    setText('');
                }
                if (text !== '' && text.includes('~')) {
                    setTextError(true);
                    setTextCharError(true);
                }
                if (!startReturningProcess && (!date || date === '')) {
                    setDateError(true);
                }
            } else {
                const isoFormatDate = formatISO(new Date(date), { representation: 'date' });
                const isoFormatDateTime = isoFormatDate + 'T00:00:00Z';
                if (startIssuingProcess) {
                    if (!isSinglePieceItem) {
                        formattedText = isoFormatDate + ' ~ ' + pieces + ' Stk. ~ ' + formattedText + '\n' + inventoryForm.issuedTo;
                    }
                    onFormSent({
                        ...inventoryForm,
                        piecesIssued: Number(pieces) + inventoryForm.piecesIssued,
                        piecesStored: inventoryForm.piecesStored - Number(pieces),
                        issuedTo: formattedText,
                        issueDate: isoFormatDateTime
                    } as IDetailInventoryItem);
                } else if (startDroppingProcess) {
                    if (!isSinglePieceItem) {
                        formattedText = isoFormatDate + ' ~ ' + pieces + ' Stk. ~ ' + formattedText + '\n' + inventoryForm.droppingReason;
                    }
                    onFormSent({
                        ...inventoryForm,
                        piecesDropped: Number(pieces) + inventoryForm.piecesDropped,
                        piecesStored: inventoryForm.piecesStored - Number(pieces),
                        droppingReason: formattedText,
                        droppingDate: isoFormatDateTime
                    } as IDetailInventoryItem);
                }
            }
        }
    };

    return (
        <Container>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CustomButton
                    onClick={onStartIssuingProcessButtonClick}
                    label={startIssuingProcess ? 'Ausgabe abbrechen' : 'Ausgabe starten'}
                    symbol={startIssuingProcess ? <Cancel /> : <RotateRight />}
                    disabled={!disabled || inventoryForm.piecesStored <= 0 || startReturningProcess || startDroppingProcess}
                />
                {(!disabled || inventoryForm.piecesStored <= 0) && (
                    <Tooltip
                        title={
                            'Eine Ausgabe ist nur dann möglich, wenn die "Stückzahl lagernd" mindestens 1 beträgt und der Gegenstand gerade nicht in Bearbeitung ist.'
                        }
                        sx={{ marginTop: '-1em', marginLeft: '-1.5em', marginRight: '0.5em' }}
                    >
                        <InfoRounded color="primary" />
                    </Tooltip>
                )}
                <CustomButton
                    onClick={onStartReturningProcessButtonClick}
                    label={startReturningProcess ? 'Rücknahme abbrechen' : 'Rücknahme starten'}
                    symbol={startReturningProcess ? <Cancel /> : <RestartAlt />}
                    disabled={!disabled || inventoryForm.piecesIssued <= 0 || startIssuingProcess || startDroppingProcess}
                />
                {(!disabled || inventoryForm.piecesIssued <= 0) && (
                    <Tooltip
                        title={
                            'Eine Rücknahme ist nur dann möglich, wenn die "Stückzahl ausgegeben" mindestens 1 beträgt und der Gegenstand gerade nicht in Bearbeitung ist.'
                        }
                        sx={{ marginTop: '-1em', marginLeft: '-1.5em', marginRight: '0.5em' }}
                    >
                        <InfoRounded color="primary" />
                    </Tooltip>
                )}
                <CustomButton
                    onClick={onStartDroppingProcessButtonClick}
                    label={startDroppingProcess ? 'Ausscheid. abbrechen' : 'Ausscheid. starten'}
                    symbol={startDroppingProcess ? <Cancel /> : <DeleteForever />}
                    disabled={!disabled || inventoryForm.piecesStored <= 0 || startIssuingProcess || startReturningProcess}
                />
                {(!disabled || inventoryForm.piecesStored <= 0) && (
                    <Tooltip
                        title={
                            'Ein Ausscheiden ist nur dann möglich, wenn die "Stückzahl lagernd" mindestens 1 beträgt und der Gegenstand gerade nicht in Bearbeitung ist.'
                        }
                        sx={{ marginTop: '-1em', marginLeft: '-1.5em', marginRight: '0.5em' }}
                    >
                        <InfoRounded color="primary" />
                    </Tooltip>
                )}
            </Grid>
            {startIssuingProcess && (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CustomTextField
                        label="Stückzahl ausgegeben"
                        value={pieces}
                        setValue={(val) => {
                            if (val === '') {
                                setPieces('');
                            } else if (Number(val) < 1) {
                                setPieces('1');
                            } else if (Number(val) > inventoryForm.piecesStored) {
                                setPieces(String(inventoryForm.piecesStored));
                            } else {
                                setPieces(val);
                            }
                        }}
                        error={piecesError}
                        type="number"
                        required={true}
                        disabled={isSinglePieceItem}
                    />
                    <CustomTextField
                        label="Ausgegeben an"
                        value={text}
                        setValue={setText}
                        error={textError}
                        required={true}
                    />
                    <CustomDatePicker
                        label="Ausgabedatum"
                        value={date}
                        setValue={setDate}
                        error={dateError}
                        required={true}
                    />
                </Grid>
            )}
            {startReturningProcess && (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    {isSinglePieceItem ? (
                        <CustomTextField
                            label="Rücknahme von"
                            value={inventoryForm.issuedTo}
                            setValue={() => {}}
                            required={true}
                            disabled={true}
                        />
                    ) : (
                        <CustomAutocomplete
                            options={returningOptions}
                            optionKey="issuedTo"
                            label="Rücknahme von"
                            value={returningValue?.issuedTo ?? ''}
                            setValue={(val) => {
                                setReturningValue(val as IReturningOptions);
                            }}
                            error={returningValueError}
                            required={true}
                        />
                    )}
                    <CustomTextField
                        label="Stückzahl zurückgenommen"
                        value={isSinglePieceItem ? '1' : pieces}
                        setValue={(val) => {
                            if (val === '') {
                                setPieces('');
                            } else if (Number(val) < 1) {
                                setPieces('1');
                            } else if (Number(val) > returningPiecesMax) {
                                setPieces(String(returningPiecesMax));
                            } else {
                                setPieces(val);
                            }
                        }}
                        error={piecesError}
                        type="number"
                        required={true}
                        disabled={isSinglePieceItem || !returningValue}
                    />
                </Grid>
            )}
            {startDroppingProcess && (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CustomTextField
                        label="Stückzahl ausgeschieden"
                        value={pieces}
                        setValue={(val) => {
                            if (val === '') {
                                setPieces('');
                            } else if (Number(val) < 1) {
                                setPieces('1');
                            } else if (Number(val) > inventoryForm.piecesStored) {
                                setPieces(String(inventoryForm.piecesStored));
                            } else {
                                setPieces(val);
                            }
                        }}
                        error={piecesError}
                        type="number"
                        required={true}
                        disabled={isSinglePieceItem}
                    />
                    <CustomTextField
                        label="Ausscheidegrund"
                        value={text}
                        setValue={setText}
                        error={textError}
                        required={true}
                    />
                    <CustomDatePicker
                        label="Ausscheidedatum"
                        value={date}
                        setValue={setDate}
                        error={dateError}
                        required={true}
                    />
                </Grid>
            )}
            {(piecesError || (textError && !text) || dateError || (startReturningProcess && returningValueError)) && (
                <CustomAlert
                    state="error"
                    message="Pflichtfelder beachten!"
                />
            )}
            {textCharError && (
                <CustomAlert
                    state="error"
                    message="Das Zeichen ~ ist im Textfeld nicht erlaubt!"
                />
            )}
            {(startIssuingProcess || startReturningProcess || startDroppingProcess) && (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <CustomButton
                        label="Absenden"
                        onClick={onSendButtonClick}
                        symbol={<CheckCircle />}
                    />
                </Grid>
            )}
        </Container>
    );
};

export default IssueReturnDropForm;
