import { IUser } from "components/interfaces";
import { getJson } from "service/baseService";

const basePath = `${process.env.HOSTNAME}/api/usermanagement`;

function getUser(encodedUsername:string):Promise<IUser> {
    return getJson<IUser>(`${basePath}/user/${encodedUsername}`);
}

export default {
    getUser
};