export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    admin: boolean;
    superAdmin: boolean;
}

export interface IDepartmentMember {
    id: number;
    userId: number;
    department: IDepartment;
    droppingReviewer: boolean;
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
    oldItemNumber?: string;
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

export interface IDataTableInventoryBase{
    showSwitchAndLegend?:boolean;
}
export interface IDataTableInventory extends  IDataTableInventoryBase{
    setSearch:(search:string) => void
    showSearchBar?:boolean;
    searching?: boolean;
    items: IInventoryItem[];
}

export interface IDatatabeInventorySearchable extends  IDataTableInventoryBase{
    getSearchUrl:(search:string) => string;
}

export interface ISearchForm {
    setSearch:(search:string) => void;
    items: IInventoryItem[];
}

export interface IPageHeader {
    title: string;
    id:string;
}

export interface IType {
    id: number;
    typeName: string;
    category: ICategory;
}

export interface ICategory {
    id: number;
    categoryName: string;
    prefix: string;
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
    changeHistory: string;
}

export interface IPrinter {
    id: number;
    printerName: string;
    printerModel: string;
    printerIp: string;
    labelFormat: string;
}

export interface IPictureUpload {
    name: string;
    base64: string | ArrayBuffer;
}

export interface IReturningOptions {
    id: number;
    returningPieces: number;
    issuedTo: string;
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
    admin: boolean;
    setAdmin: (val: boolean) => void;
    superAdmin: boolean;
    setSuperAdmin: (val: boolean) => void;
    adminMode: boolean;
    setAdminMode: (val: boolean) => void;
    departmentId: number;
    setDepartmentId: (val: number) => void;
    departmentName: string;
    setDepartmentName: (val: string) => void;
    themeMode: 'light' | 'dark';
    setThemeMode: (val: 'light' | 'dark') => void;
    droppingReviewer: boolean;
    setDroppingReviewer: (val: boolean) => void;
    showDroppingQueue: boolean;
    setShowDroppingQueue: (val: boolean) => void;
}

export interface IChartItem {
    id: number;
    type: IType;
    department: IDepartment;
    pieces: number;
    piecesStored: number;
    piecesIssued: number;
    piecesDropped: number;
    locations: string;
    departments: string;
    processingDate: string;
    piecesCreated: number;
    piecesManipulated: number;
    piecesActivated: number;
    piecesDeactivated: number;
}

export interface IHidden {
    hidden?:boolean;
}

export interface IRememberMeCookieConfig {
    id: number;
    daysUntilExpiration: number;
}
