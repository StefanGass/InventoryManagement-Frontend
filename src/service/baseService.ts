export function getJson<T>(url: string): Promise<T> {
    return toJson(get(url));
}

export function get(url: string) {
    return checkIfOk(fetch(url));
}

export function getWithHeaders(url: string, headers: Headers) {
    return checkIfOk(fetch(url, {
        method: 'GET',
        headers: headers
    }));
}

function checkIfOk(promise: Promise<Response>) {
    return promise.then(res => {
        if (!res.ok) {
            return Promise.reject(promise);
        }
        return res;
    });
}
function toJson<T>(promise: Promise<Response>): Promise<T> {
    return promise.then(x => x.json())
}
