import { IInventoryItem, IUserContext } from "components/interfaces";


export function getTestUserContext():IUserContext{
    return  {
        login: true,
        setLogin: ()=> {},
        userId: 1,
        setUserId: ()=> {},
        firstName: "Max",
        setFirstName: ()=> {},
        lastName: "Mustermann",
        setLastName: ()=> {},
        admin: false,
        setAdmin: ()=> {},
        superAdmin: false,
        setSuperAdmin: ()=> {},
        adminMode: false,
        setAdminMode: ()=> {},
        departmentId: 1,
        setDepartmentId: ()=> {},
        departmentName: "Test",
        setDepartmentName:()=> {},
        themeMode: 'light',
        setThemeMode: ()=> {},
        droppingReviewer: false,
        setDroppingReviewer: ()=> {},
        showDroppingQueue: false,
        setShowDroppingQueue: ()=> {}
    }
}

export function getTestInventoryItemComputer():IInventoryItem{
    return {
        id: 1,
        itemInternalNumber:"TEST-2023-0001",
        itemName: "Computer",
        serialNumber: "1",
        piecesStored: 1,
        piecesIssued: 0,
        piecesDropped: 0,
        status: "LAGERND",
        active: true,
    }
}
