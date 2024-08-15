import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Box, Checkbox, Container, FormControlLabel, Grid, Tooltip } from '@mui/material';
import CustomButton from 'components/form-fields/CustomButton';
import { Cancel, CheckCircle, DeleteForever, RestartAlt, RotateRight } from '@mui/icons-material';
import { IDetailInventoryItem, IReturningOptions } from 'components/interfaces';
import CustomTextField from 'components/form-fields/CustomTextField';
import CustomDatePicker from 'components/form-fields/CustomDatePicker';
import CustomAlert from 'components/form-fields/CustomAlert';
import { formatISO } from 'date-fns';
import CustomAutocomplete from 'components/form-fields/CustomAutocomplete';
import { AUSSCHEIDEN } from 'utils/droppingActivationUtil';
import { UserContext } from '../../../../pages/_app';
import CustomNumberInput from 'components/form-fields/CustomNumberInput';

interface IIssueReturnDropFormProps {
    inventoryForm: IDetailInventoryItem;
    onFormSent: (...params) => void;
    isSinglePieceItem: boolean;
    isDisabled?: boolean;
}

export default function IssueReturnDropForm(props: IIssueReturnDropFormProps) {
    const { userId } = useContext(UserContext);
    const { inventoryForm, onFormSent, isSinglePieceItem, isDisabled } = props;

    const [isStartIssuingProcess, setIsStartIssuingProcess] = useState(false);
    const [isStartReturningProcess, setIsStartReturningProcess] = useState(false);
    const [isStartDroppingProcess, setIsStartDroppingProcess] = useState(false);

    const [pieces, setPieces] = useState(1);
    const [isPiecesError, setIsPiecesError] = useState(false);
    const [text, setText] = useState('');
    const [isTextError, setIsTextError] = useState(false);
    const [isTextCharError, setIsTextCharError] = useState(false);
    const [date, setDate] = useState(String(new Date()));
    const [isDateError, setIsDateError] = useState(false);
    const [isMergeIssuedToSame, setIsMergeIssuedToSame] = useState(true);

    const [returningValue, setReturningValue] = useState<IReturningOptions | null>(null);
    const [isReturningValueError, setIsReturningValueError] = useState(false);
    const [returningOptions, setReturningOptions] = useState<IReturningOptions[]>([]);
    const [returningPiecesMax, setReturningPiecesMax] = useState(1);

    const resetFields = () => {
        setPieces(1);
        setText('');
        setDate('');
        setReturningValue(null);
        setIsPiecesError(false);
        setIsTextError(false);
        setIsDateError(false);
        setIsTextCharError(false);
        setIsReturningValueError(false);
    };

    useEffect(() => {
        if (!inventoryForm.droppingQueue) {
            setIsStartIssuingProcess(false);
            setIsStartReturningProcess(false);
            setIsStartDroppingProcess(false);
            resetFields();
        }
    }, [isDisabled]);

    useEffect(() => {
        pieces && setIsPiecesError(false);
        text && setIsTextError(false);
        date && setIsDateError(false);
        !text.includes('~') && setIsTextCharError(false);
    }, [pieces, text, date]);

    useEffect(() => {
        !returningValue && setPieces(1);
        returningValue && setPieces(returningValue.returningPieces);
        returningValue && setReturningPiecesMax(returningValue.returningPieces);
        setIsPiecesError(false);
        setIsReturningValueError(false);
    }, [returningValue]);

    // get options to choose from, when returning multi-piece items
    function getReturningOptions() {
        const tmpList = inventoryForm.issuedTo?.split('\n').slice(0, -1) || []; // remove the last entry, as it is empty
        const resultList: IReturningOptions[] = [];
        tmpList.forEach((entry, index) => {
            const tmpPieces = Number(entry.split(' ~ ')[1].split(' ')[0]);
            const tmpIssuedTo = entry.split(' ~ ')[2] + ' (' + entry.split(' ~ ')[0] + ')';
            resultList.push({ id: index, issuedTo: tmpIssuedTo, returningPieces: tmpPieces });
        });
        setReturningOptions(resultList);
    }

    // merge and remove issued items entries inside the existing multi-piece item string, when items are issued
    function getNewIssuedToStringWhenIssuingAndMergingSameEntries() {
        const tmpList = inventoryForm.issuedTo?.split('\n').slice(0, -1) || []; // remove the last entry, as it is empty
        let alreadyIssuedPieces = 0;
        const filteredList = tmpList.filter((entry) => {
            const tmpIssuedTo = entry.split(' ~ ')[2];
            if (tmpIssuedTo?.trim().toLowerCase() === text.trim().toLowerCase()) {
                alreadyIssuedPieces += Number(entry.split(' ~ ')[1].split(' ')[0]);
                return false; // exclude this entry from the updated list
            }
            return true;
        });
        let updatedIssuedToString = '';
        filteredList.map((entry) => {
            if (entry) {
                updatedIssuedToString += entry + '\n';
            }
        });
        return `${formatISO(new Date(date), { representation: 'date' })} ~ ${pieces + alreadyIssuedPieces} Stk. ~ ${text}\n` + updatedIssuedToString;
    }

    // reduce or remove the number of issued items inside the existing multi-piece item string, when items are returned
    function getNewIssuedToStringWhenReturningItems(id: number) {
        const tmpList = inventoryForm.issuedTo?.split('\n').slice(0, -1) || []; // remove the last entry, as it is empty
        let updatedIssuedToString = '';
        tmpList?.forEach((entry, index) => {
            if (index === id) {
                // manipulate only the chosen line, append every other
                const [tmpDate, tmpPiecesStr, tmpIssuedTo] = entry.split(' ~ ');
                let tmpPieces = Number(tmpPiecesStr.split(' ')[0]);
                if (returningValue && returningValue.returningPieces !== pieces) {
                    tmpPieces -= pieces;
                    updatedIssuedToString += `${tmpDate} ~ ${tmpPieces} Stk. ~ ${tmpIssuedTo}\n`;
                }
            } else {
                updatedIssuedToString += entry + '\n';
            }
        });
        return updatedIssuedToString;
    }

    function onStartIssuingProcessButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (isStartIssuingProcess) {
            setIsStartIssuingProcess(false);
            resetFields();
        } else {
            setPieces(inventoryForm.piecesStored);
            setDate(String(new Date()));
            setIsStartIssuingProcess(true);
        }
    }

    function onStartReturningProcessButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (isStartReturningProcess) {
            setIsStartReturningProcess(false);
            resetFields();
        } else {
            if (!isSinglePieceItem) {
                getReturningOptions();
            }
            setIsStartReturningProcess(true);
        }
    }

    function onStartDroppingProcessButtonClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (isStartDroppingProcess) {
            setIsStartDroppingProcess(false);
            resetFields();
        } else {
            setPieces(inventoryForm.piecesStored);
            setDate(String(new Date()));
            setIsStartDroppingProcess(true);
        }
    }

    function onSendButtonClick() {
        if (isStartReturningProcess) {
            if (isSinglePieceItem) {
                onFormSent({
                    ...inventoryForm,
                    piecesIssued: 0,
                    piecesStored: 1,
                    issuedTo: '',
                    issueDate: null
                } as IDetailInventoryItem);
            } else {
                if (!returningValue || !pieces) {
                    if (!returningValue) {
                        setIsReturningValueError(true);
                    } else if (!pieces) {
                        setIsPiecesError(true);
                    }
                } else {
                    const newIssuedToString = getNewIssuedToStringWhenReturningItems(returningValue.id);
                    onFormSent({
                        ...inventoryForm,
                        piecesIssued: inventoryForm.piecesIssued - pieces,
                        piecesStored: inventoryForm.piecesStored + pieces,
                        issuedTo: newIssuedToString,
                        issueDate: inventoryForm.piecesIssued - pieces !== 0 ? inventoryForm.issueDate : null
                    } as IDetailInventoryItem);
                }
            }
        } else {
            let formattedText = text.trim();
            if (!pieces || !text || text === '' || formattedText.length === 0 || text.includes('~') || !date || date === '') {
                if (!pieces) {
                    setIsPiecesError(true);
                }
                if (!text || text === '') {
                    setIsTextError(true);
                }
                if (formattedText.length === 0) {
                    setIsTextError(true);
                    setText('');
                }
                if (text !== '' && text.includes('~')) {
                    setIsTextError(true);
                    setIsTextCharError(true);
                }
                if (!isStartReturningProcess && (!date || date === '')) {
                    setIsDateError(true);
                }
            } else {
                const isoFormatDate = formatISO(new Date(date), { representation: 'date' });
                const isoFormatDateTime = isoFormatDate + 'T00:00:00Z';
                if (isStartIssuingProcess) {
                    if (!isSinglePieceItem) {
                        if (isMergeIssuedToSame) {
                            formattedText = getNewIssuedToStringWhenIssuingAndMergingSameEntries();
                        } else {
                            formattedText = isoFormatDate + ' ~ ' + pieces + ' Stk. ~ ' + formattedText + '\n' + inventoryForm.issuedTo;
                        }
                    }
                    onFormSent({
                        ...inventoryForm,
                        piecesIssued: pieces + inventoryForm.piecesIssued,
                        piecesStored: inventoryForm.piecesStored - pieces,
                        issuedTo: formattedText,
                        issueDate: isoFormatDateTime
                    } as IDetailInventoryItem);
                } else if (isStartDroppingProcess) {
                    onFormSent({
                        ...inventoryForm,
                        droppingQueue: AUSSCHEIDEN,
                        droppingQueuePieces: pieces,
                        droppingQueueReason: formattedText,
                        droppingQueueDate: isoFormatDateTime,
                        droppingQueueRequester: userId
                    } as IDetailInventoryItem);
                }
            }
        }
    }

    return (
        <Container>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Tooltip
                    title={
                        !isDisabled
                            ? 'Eine Ausgabe ist nur dann möglich, wenn der Gegenstand gerade nicht in Bearbeitung ist.'
                            : inventoryForm.piecesStored <= 0
                              ? "Eine Ausgabe ist nur dann möglich, wenn die 'Stückzahl lagernd' mindestens 1 beträgt."
                              : undefined
                    }
                    followCursor={true}
                    enterDelay={500}
                >
                    <Box /* necessary for showing tooltip */>
                        <CustomButton
                            onClick={onStartIssuingProcessButtonClick}
                            label={isStartIssuingProcess ? 'Ausgabe abbrechen' : 'Ausgabe starten'}
                            symbol={isStartIssuingProcess ? <Cancel /> : <RotateRight />}
                            isDisabled={!isDisabled || inventoryForm.piecesStored <= 0 || isStartReturningProcess || isStartDroppingProcess}
                        />
                    </Box>
                </Tooltip>
                <Tooltip
                    title={
                        !isDisabled
                            ? 'Eine Rücknahme ist nur dann möglich, wenn der Gegenstand gerade nicht in Bearbeitung ist.'
                            : inventoryForm.piecesIssued <= 0
                              ? "Eine Rücknahme ist nur dann möglich, wenn die 'Stückzahl ausgegeben' mindestens 1 beträgt."
                              : undefined
                    }
                    followCursor={true}
                    enterDelay={500}
                >
                    <Box /* necessary for showing tooltip */>
                        <CustomButton
                            onClick={onStartReturningProcessButtonClick}
                            label={isStartReturningProcess ? 'Rücknahme abbrechen' : 'Rücknahme starten'}
                            symbol={isStartReturningProcess ? <Cancel /> : <RestartAlt />}
                            isDisabled={!isDisabled || inventoryForm.piecesIssued <= 0 || isStartIssuingProcess || isStartDroppingProcess}
                        />
                    </Box>
                </Tooltip>
                <Tooltip
                    title={
                        !isDisabled
                            ? 'Ein Ausscheiden ist nur dann möglich, wenn der Gegenstand gerade nicht in Bearbeitung ist.'
                            : inventoryForm.piecesStored <= 0
                              ? "Ein Ausscheiden ist nur dann möglich, wenn die 'Stückzahl lagernd' mindestens 1 beträgt."
                              : undefined
                    }
                    followCursor={true}
                    enterDelay={500}
                >
                    <Box /* necessary for showing tooltip */>
                        <CustomButton
                            onClick={onStartDroppingProcessButtonClick}
                            label={isStartDroppingProcess ? 'Ausscheidung abbrechen' : 'Ausscheidung anfordern'}
                            symbol={isStartDroppingProcess ? <Cancel /> : <DeleteForever />}
                            isDisabled={!isDisabled || inventoryForm.piecesStored <= 0 || isStartIssuingProcess || isStartReturningProcess}
                        />
                    </Box>
                </Tooltip>
            </Grid>
            <Box my={1} />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                {isStartIssuingProcess && (
                    <>
                        <CustomNumberInput
                            label="Stückzahl ausgegeben"
                            value={pieces}
                            onChange={(val) => setPieces(val)}
                            min={1}
                            max={inventoryForm.piecesStored}
                            textAlign="start"
                            error={isPiecesError}
                            required={true}
                            disabled={isSinglePieceItem}
                        />
                        <CustomTextField
                            label="Ausgegeben an"
                            value={text}
                            setValue={setText}
                            isError={isTextError}
                            isRequired={true}
                        />
                        <CustomDatePicker
                            label="Ausgabedatum"
                            value={date}
                            setValue={setDate}
                            isError={isDateError}
                            isRequired={true}
                        />
                        {!isSinglePieceItem && (
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isMergeIssuedToSame}
                                            onChange={(e, checked) => setIsMergeIssuedToSame(checked)}
                                        />
                                    }
                                    label="Zusammenführen, wenn mehrfach 'Ausgegeben an' dieselbe Person/Abteilung"
                                />
                            </Grid>
                        )}
                    </>
                )}
                {isStartReturningProcess && (
                    <>
                        {isSinglePieceItem ? (
                            <CustomTextField
                                label="Rücknahme von"
                                value={inventoryForm.issuedTo}
                                setValue={() => {}}
                                isRequired={true}
                                isDisabled={true}
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
                                isError={isReturningValueError}
                                isRequired={true}
                            />
                        )}
                        <CustomNumberInput
                            label="Stückzahl zurückgenommen"
                            value={isSinglePieceItem ? 1 : pieces}
                            onChange={(val) => setPieces(val)}
                            min={1}
                            max={returningPiecesMax}
                            textAlign="start"
                            error={isPiecesError}
                            required={true}
                            disabled={isSinglePieceItem || !returningValue}
                        />
                    </>
                )}
                {isStartDroppingProcess && (
                    <>
                        <CustomNumberInput
                            label="Stückzahl ausgeschieden"
                            value={pieces}
                            onChange={(val) => setPieces(val)}
                            min={1}
                            max={inventoryForm.piecesStored}
                            textAlign="start"
                            error={isPiecesError}
                            required={true}
                            disabled={isSinglePieceItem || !!inventoryForm.droppingQueue}
                        />
                        <CustomTextField
                            label="Ausscheidegrund"
                            value={text}
                            setValue={setText}
                            isError={isTextError}
                            isRequired={true}
                            isDisabled={!!inventoryForm.droppingQueue}
                        />
                        <CustomDatePicker
                            label="Ausscheidedatum"
                            value={date}
                            setValue={setDate}
                            isError={isDateError}
                            isRequired={true}
                            isDisabled={!!inventoryForm.droppingQueue}
                        />
                    </>
                )}
            </Grid>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                {(isPiecesError || (isTextError && !text) || isDateError || (isStartReturningProcess && isReturningValueError)) && (
                    <CustomAlert
                        state="error"
                        message="Pflichtfelder beachten!"
                    />
                )}
                {isTextCharError && (
                    <CustomAlert
                        state="error"
                        message="Das Zeichen ~ ist im Textfeld nicht erlaubt!"
                    />
                )}
                {(isStartIssuingProcess || isStartReturningProcess || isStartDroppingProcess) && (
                    <CustomButton
                        label="Absenden"
                        onClick={onSendButtonClick}
                        symbol={<CheckCircle />}
                    />
                )}
            </Grid>
        </Container>
    );
}
