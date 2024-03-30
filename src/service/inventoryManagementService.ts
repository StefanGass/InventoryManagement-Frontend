import { IDepartment, IDepartmentMember, IDetailInventoryItem, IInventoryItem, IPicture } from 'components/interfaces';
import { deleteRequest, getJson, patch } from 'service/baseService';
import { GridRowId } from '@mui/x-data-grid';

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

function revokeDroppingInventoryItem(id: number, body: { userName: string }) {
    return patch(`${basePath}/inventory/${id}/droppingQueue/revoke`, body);
}

function getDepartmentOfUser(userId: number): Promise<IDepartment> {
    return getJson<IDepartment>(`${basePath}/department/user/${userId}`);
}

function getAllDepartments() {
    return getJson<IDepartment[]>(`${basePath}/department`);
}

function getPicture(id: number) {
    return getJson<IPicture>(`${basePath}/picture/${id}`);
}

function updateReviewer(userId: number, droppingReviewer: boolean) {
    return patch(`${basePath}/department/member/${userId}/reviewer`, droppingReviewer);
}

// the department must not be null here, but due to reusing components this will produce a type error if not typed as IDepartment | null
function deleteDepartmentMember(department: IDepartment | null, row: GridRowId) {
    return deleteRequest(`${basePath}/department/member/` + department?.id, row);
}

function deactivateInventoryItem(id: number, body: { userName: string }) {
    return patch(`${basePath}/inventory/${id}/deactivate`, body);
}

function reactivateInventoryItem(id: number, body: { userName: string }) {
    return patch(`${basePath}/inventory/${id}/activate`, body);
}

function updateInventoryItem(item: IDetailInventoryItem) {
    return patch(`${basePath}/inventory/${item.id}`, item);
}

export default {
    getDepartmentMember,
    getAllDroppingQueueInventoryItems,
    getDroppingQueueInventoryItemsByDepartmentId,
    revokeDroppingInventoryItem,
    getAllDepartments,
    deleteDepartmentMember,
    updateReviewer,
    getDepartmentOfUser,
    deactivateInventoryItem,
    reactivateInventoryItem,
    updateInventoryItem,
    getPicture
};
