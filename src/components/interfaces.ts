export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    superAdmin: boolean;
}

export interface IDepartmentMember {
    id: number;
    userId: number;
    department: IDepartment;
}

export interface IDepartmentMemberConverted {
    id: number;
    name: string;
    department?: IDepartment;
}

export interface IInventoryItem {
    id?: number;
    type?: IType;
    itemInternalNumber?: string;
    itemName: string;
    serialNumber: string;
    location?: ILocation;
    pieces?: number;
    piecesStored: number;
    piecesIssued: number;
    piecesDropped: number;
    deliveryDate?: string | null;
    supplier?: ISupplier;
    issueDate?: string | null;
    issuedTo?: string;
    droppingDate?: string | null;
    status: string;
    department?: IDepartment;
    lastChangedDate?: string | null;
    active: boolean;
    userName?: string;
}

export interface IDetailInventoryItem extends IInventoryItem {
    droppingReason?: string;
    comments?: string;
    pictures?: IPicture[];
    change?: IChange[];
}

export interface IDataTableInventory {
    items: IInventoryItem[];
    setItems: (items: IInventoryItem[]) => void;
    activeAndNotDroppedItems: IInventoryItem[];
    activeAndNotActiveAndNotDroppedItems: IInventoryItem[];
    activeAndDroppedAndNotDroppedItems: IInventoryItem[];
    allItems: IInventoryItem[];
}

export interface IType {
    id: number;
    typeName: string;
    category: ICategory;
}

export interface ICategory {
    id: number;
    categoryName: string;
}

export interface ILocation {
    id: number;
    locationName: string;
}

export interface ISupplier {
    id: number;
    supplierName: string;
    link: string;
}

export interface IDepartment {
    id: number;
    departmentName: string;
}

export interface IObjectToSend {
    [key: string]: string | GenericObject | undefined | null;
}

export type GenericObject = { [key: string]: any };

export interface IPicture {
    id?: number;
    pictureUrl: string | ArrayBuffer;
}

export interface IChange {
    id: number;
    user: string;
    changeDate: Date;
    changeStatus: string;
}

export interface IPictureUpload {
    name: string;
    base64: string | ArrayBuffer;
}

export interface IFormValidation {
    error: boolean;
    name: string;
}

export interface IUserContext {
    login: boolean;
    setLogin: (val: boolean) => void;
    userId: number;
    setUserId: (val: number) => void;
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    departmentId: number;
    setDepartmentId: (val: number) => void;
    departmentName: string;
    setDepartmentName: (val: string) => void;
    superAdmin: boolean;
    setSuperAdmin: (val: boolean) => void;
}
