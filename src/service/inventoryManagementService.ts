import {
    IDepartment,
    IDepartmentMember, IDetailInventoryItem,
    IInventoryItem
} from "components/interfaces";
import { deleteRequest, getJson, patch } from "service/baseService";
import { GridRowId } from "@mui/x-data-grid";


const basePath = `${process.env.HOSTNAME}/api/inventorymanagement`;


function getDepartmentMember(userId: number): Promise<IDepartmentMember> {
    return getJson<IDepartmentMember>(`${basePath}/department/member/${userId}`);
}

function getAllDroppingQueueInventoryItems(): Promise<IDetailInventoryItem[]> {
    return getJson<IInventoryItem[]>(`${basePath}/inventory/droppingQueue`);
}

function getDroppingQueueInventoryItemsByDepartmentId(departmentId: number): Promise<IDetailInventoryItem[]> {
    return getJson<IInventoryItem[]>(`${basePath}/inventory/department/${departmentId}/droppingQueue`);
}
function getDepartmentOfUser(userId: number): Promise<IDepartment> {
    return getJson<IDepartment>(`${basePath}/department/user/${userId}`);
}

function getAllDepartments() {
    return getJson<IDepartment[]>(`${basePath}/department/`);
}

function updateReviewer(userId: number, droppingReviewer: boolean) {
    return patch(`${basePath}/department/member/${userId}/reviewer`, droppingReviewer);
}

function deleteDepartmentMember(department:IDepartment,row : GridRowId){
    return deleteRequest(`${basePath}/department/member/` + department.id,row);
}

function deactivateInventoryItem(id:number,body: { userName:string }){
    return patch(`${basePath}/inventory/${id}/deactivate`,body);
}

function reactivateInventoryItem(id:number,body: { userName:string }){
    return patch(`${basePath}/inventory/${id}/activate`,body);
}

function updateInventoryItem(item:IDetailInventoryItem){
    return patch(`${basePath}/inventory/${item.id}`,item);
}

export default {
    getDepartmentMember,
    getAllDroppingQueueInventoryItems,
    getDroppingQueueInventoryItemsByDepartmentId,
    getAllDepartments,
    deleteDepartmentMember,
    updateReviewer,
    getDepartmentOfUser,
    deactivateInventoryItem,
    reactivateInventoryItem,
    updateInventoryItem
};
