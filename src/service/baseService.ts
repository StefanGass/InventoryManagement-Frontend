export function getJson<T>(url: string): Promise<T> {
    return toJson(get(url));
}

export function post<T>(url: string, body: any): Promise<T> {
    return toJson(
        checkIfOk(
            fetch(url, {
                method: 'POST',
                body
            })
        )
    );
}

export function getJsonWithAuthHeaders<T>(url: string, authHeaders: Headers): Promise<T> {
    return toJson(getWithHeaders(url, authHeaders));
}


export function patch(url: string, body?: any) {
    return checkIfOk(
        fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
    );
}

export function deleteRequest(url: string, body: any) {
    return checkIfOk(
        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
    );
}

export function get(url: string) {
    return checkIfOk(fetch(url));
}

export function getWithHeaders(url: string, headers: Headers) {
    return checkIfOk(
        fetch(url, {
            method: 'GET',
            headers: headers
        })
    );
}

function checkIfOk(promise: Promise<Response>) {
    return promise.then((res) => {
        if (!res.ok) {
            return Promise.reject(promise);
        }
        return res;
    });
}

function toJson<T>(promise: Promise<Response>): Promise<T> {
    return promise.then((x) => x.json());
}
