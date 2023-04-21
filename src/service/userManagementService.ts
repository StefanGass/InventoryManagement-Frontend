import { IUser, IDepartmentMemberConverted } from "components/interfaces";
import { getJson } from "service/baseService";

const basePath = `${process.env.HOSTNAME}/api/usermanagement`;

function getUser(encodedUsername:string):Promise<IUser> {
    return getJson<IUser>(`${basePath}/user/${encodedUsername}`);
}

function getAllUsers(currentUserId:number){
    return getJson<IUser[]>(`${basePath}/admin/${currentUserId}`);
}

function convertUserToDepartmentMemberConverted(users:IUser[]) {
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
    convertUserToDepartmentMemberConverted,
    getUser
};
