import { IDepartmentMemberConverted, IUser } from 'components/interfaces';
import { getJsonWithAuthHeaders } from 'service/baseService';

const basePath = `${process.env.HOSTNAME}/api/usermanagement`;

function getAllUsers(currentUserId: number, authHeaders: Headers) {
    return getJsonWithAuthHeaders<IUser[]>(`${basePath}/admin/${currentUserId}`, authHeaders);
}

function convertUserToDepartmentMemberConverted(users: IUser[]) {
    const userList: IDepartmentMemberConverted[] = [];
    users.map((user) => {
        userList.push({
            id: user.id,
            name: user.lastName + ' ' + user.firstName
        });
    });
    return userList;
}

export default {
    getAllUsers,
    convertUserToDepartmentMemberConverted
};
