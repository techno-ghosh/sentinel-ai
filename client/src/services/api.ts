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