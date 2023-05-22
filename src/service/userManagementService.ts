import { IUser, IDepartmentMemberConverted, IConfiguration } from "components/interfaces";
import { getJson, post } from "service/baseService";

const basePath = `${process.env.HOSTNAME}/api/usermanagement`;

function getUser(encodedUsername:string, rememberMe: boolean):Promise<IUser> {
    return getJson<IUser>(`${basePath}/user/${encodedUsername}?rememberMe=${rememberMe}`);
}

function getUserByToken(userToken:string):Promise<IUser> {
    return post<IUser>(`${basePath}/user-token`, userToken);
}

function getAllUsers(currentUserId:number){
    return getJson<IUser[]>(`${basePath}/admin/${currentUserId}`);
}

function getConfiguration(): Promise<IConfiguration> {
    return getJson<IConfiguration>(`${basePath}/configuration`);
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
    getUser,
    getConfiguration,
    getUserByToken
};
