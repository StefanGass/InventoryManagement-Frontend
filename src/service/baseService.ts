export function getJson<T>(url: string): Promise<T> {
    return toJson(get(url));
}

export function patch(url: string, body: any) {
    return checkIfOk(fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }));
}
export function deleteRequest(url: string, body: any) {
    return checkIfOk(fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }));
}

export function get(url: string) {
    return checkIfOk(fetch(url));
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
    return promise.then(x => x.json());
}
