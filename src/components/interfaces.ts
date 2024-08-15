import React from 'react';
import { GridRowId } from '@mui/x-data-grid';

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    admin: boolean;
    superAdmin: boolean;
    authInventoryManagement: boolean;
}

export interface IUserContextWithoutSetters {
    authHeaders: Headers;
    isAuthenticated: boolean;
    userId: number;
    firstName: string;
    lastName: string;
    isDroppingReviewer: boolean;
    isNewTasksAvailable: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isAdminModeActivated: boolean;
    departmentId: number;
    departmentName: string;
    availableRoutesList: IRoute[];
    themeMode: 'light' | 'dark';
}

export interface IUserContext extends IUserContextWithoutSetters {
    setAuthHeaders: (val: Headers) => void;
    setIsAuthenticated: (val: boolean) => void;
    setUserId: (val: number) => void;
    setFirstName: (val: string) => void;
    setLastName: (val: string) => void;
    setIsDroppingReviewer: (val: boolean) => void;
    setIsNewTasksAvailable: (val: boolean) => void;
    setIsAdmin: (val: boolean) => void;
    setIsSuperAdmin: (val: boolean) => void;
    setIsAdminModeActivated: (val: boolean) => void;
    setDepartmentId: (val: number) => void;
    setDepartmentName: (val: string) => void;
    setAvailableRoutesList: (val: IRoute[]) => void;
    setThemeMode: (val: 'light' | 'dark') => void;
}

export interface IRoute {
    name: string;
    symbol: React.JSX.Element;
    isUseSymbolInHeader: boolean;
    link: string;
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
    warrantyEndDate?: string | null;
    location?: ILocation;
    room: string;
    pieces?: number;
    piecesStored: number;
    piecesIssued: number;
    piecesDropped: number;
    deliveryDate?: string | null;
    supplier?: ISupplier;
    issueDate?: string | null;
    issuedTo?: string;
    droppingDate?: string | null;
    droppingQueue?: string;
    status: string;
    department?: IDepartment;
    creationDate?: string | null;
    lastChangedDate?: string | null;
    active: boolean;
    userName?: string;
}

export interface IDetailInventoryItem extends IInventoryItem {
    droppingReason?: string;
    comments?: string;
    pictures?: IPicture[];
    change?: IChange[];
    droppingQueuePieces?: number;
    droppingQueueRequester?: number;
    droppingQueueReason?: string;
    droppingQueueDate?: string;
}

export interface IDataTableInventoryBase {
    isShowSwitchAndLegend?: boolean;
}

export interface IDataTableInventory extends IDataTableInventoryBase {
    search?: string;
    setSearch: (search: string) => void;
    isShowSearchBar?: boolean;
    isSearching?: boolean;
    items: IInventoryItem[];
    isIncludeDroppingInformation?: boolean;
    selectionModel?: GridRowId[];
    setSelectionModel?: (val: GridRowId[]) => void;
}

export interface IDataTableInventorySearchable extends IDataTableInventoryBase {
    getSearchUrl: (search: string) => string;
}

export interface ISearchForm {
    setSearch: (search: string) => void;
    items: IInventoryItem[];
}

export interface IPageHeader {
    title: string;
    id: string;
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
    departmentMembers?: IDepartmentMember[];
}

export interface IObjectToSend {
    [key: string]: string | GenericObject | undefined | null;
}

export type GenericObject = { [key: string]: any };

export interface IPicture {
    id?: number;
    pictureUrl: string | ArrayBuffer;
    thumbnailUrl?: string | ArrayBuffer;
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
