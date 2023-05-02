import { IDepartment, IDepartmentMember, IInventoryItem, IRememberMeCookieConfig } from "components/interfaces";
import { deleteRequest, getJson, patch } from "service/baseService";
import { GridRowId } from "@mui/x-data-grid";


const basePath = `${process.env.HOSTNAME}/api/inventorymanagement`;


function getDepartmentMember(userId: number): Promise<IDepartmentMember> {
    return getJson<IDepartmentMember>(`${basePath}/department/member/${userId}`);
}

function getAllDroppingQueueInventoryItems(): Promise<IInventoryItem[]> {
    return getJson<IInventoryItem[]>(`${basePath}/inventory/droppingQueue`);
}

function getDroppingQueueInventoryItemsByDepartmentId(departmentId: number): Promise<IInventoryItem[]> {
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
    return deleteRequest(`${process.env.HOSTNAME}/api/inventorymanagement/department/member/` + department.id,row);
}

function getRememberMeCookieConfig(): Promise<IRememberMeCookieConfig> {
    return getJson<IRememberMeCookieConfig>(`${basePath}/remembermecookieconfig`);
}

export default {
    getDepartmentMember,
    getAllDroppingQueueInventoryItems,
    getDroppingQueueInventoryItemsByDepartmentId,
    getAllDepartments,
    deleteDepartmentMember,
    updateReviewer,
    getDepartmentOfUser,
    getRememberMeCookieConfig
};
