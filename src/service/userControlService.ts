import { getWithHeaders } from "service/baseService";

const basePath = `${process.env.HOSTNAME}/api/usercontrol`;

function checkUser(headers: Headers): Promise<any> {
    return getWithHeaders(`${basePath}`, headers);
}

export default {
    checkUser
};