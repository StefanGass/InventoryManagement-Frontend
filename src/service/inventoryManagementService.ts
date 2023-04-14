import { IDepartmentMember, IInventoryItem } from "components/interfaces";
import { getJson } from "service/baseService";


const basePath= `${process.env.HOSTNAME}/api/inventorymanagement/`;

function getDepartmentMember(userId:number):Promise<IDepartmentMember> {
    return getJson<IDepartmentMember>(`${basePath}/department/member/${userId}`);
}
function getAllDroppingQueueInventoryItems():Promise<IInventoryItem[]> {
    return getJson<IInventoryItem[]>(`${basePath}/inventory/droppingQueue`);
}function getDroppingQueueInventoryItemsByDepartmentId(departmentId:number):Promise<IInventoryItem[]> {
    return getJson<IInventoryItem[]>(`${basePath}/inventory/department/${departmentId}/droppingQueue`);
}

export default {
    getDepartmentMember,
    getAllDroppingQueueInventoryItems,
    getDroppingQueueInventoryItemsByDepartmentId
}
