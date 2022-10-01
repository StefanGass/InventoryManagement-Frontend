import { IDetailInventoryItem, IFormValidation } from 'components/interfaces';

export const inventoryFormRequiredSchema: IFormValidation[] = [
    {
        name: 'type',
        error: false
    },
    {
        name: 'itemInternalNumber',
        error: false
    },
    {
        name: 'supplier',
        error: false
    },
    {
        name: 'location',
        error: false
    },
    {
        name: 'pieces',
        error: false
    },
    {
        name: 'department',
        error: false
    }
];

export const droppedSchema: IFormValidation[] = [
    {
        name: 'droppingReason',
        error: false
    },
    {
        name: 'droppingDate',
        error: false
    },
    {
        name: 'piecesDropped',
        error: false
    }
];

export const issuedSchema: IFormValidation[] = [
    {
        name: 'issuedTo',
        error: false
    },
    {
        name: 'issueDate',
        error: false
    },
    {
        name: 'piecesIssued',
        error: false
    }
];

export const defaultInventory: IDetailInventoryItem = {
    active: true,
    change: undefined,
    comments: '',
    deliveryDate: '',
    droppingDate: '',
    droppingReason: '',
    id: undefined,
    issueDate: '',
    issuedTo: '',
    itemInternalNumber: '',
    itemName: '',
    lastChangedDate: undefined,
    location: undefined,
    pictures: [],
    pieces: 0,
    piecesDropped: 0,
    piecesIssued: 0,
    piecesStored: 0,
    serialNumber: '',
    department: undefined,
    status: '',
    supplier: undefined,
    type: undefined
};
