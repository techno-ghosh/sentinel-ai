export async function apiGet<T>(endpoint: string):Promise<T> {
    const response = await fetch(endpoint, {
        headers : {
            "x-api-key" : "sentinel123"
        }
    });
    if(!response.ok) throw new Error ("API request failed")
    
    const data = await response.json();
    return data;
}

export async function apiPost<T>(endpoint: string, body: FormData | object):Promise<T> {

    const isFormData = body instanceof FormData;
    const requestBody = isFormData ? body : JSON.stringify(body);
    const headers = new Headers({
        "x-api-key" : "sentinel123"
    })
    if(!isFormData) {
        headers.set("Content-Type", "application/json")
    }

    const response = await fetch(endpoint, {
        method : "POST",
        headers : headers,
        body : requestBody
    })

    if(!response.ok) throw new Error ("API request failed");
    const data = await response.json();
    return data;

} 