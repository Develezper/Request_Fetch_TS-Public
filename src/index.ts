//fetch

interface ApiResponse<T> {
    data:T | null;  //esto es el cuerpo del body en caso tal de que salga bien
    error:string | null; //error en caso tal de que salga mal
    status:number;  //codigo http [200, 400, 401, 500]
}

async function apiRequest<T>(url:string): Promise<ApiResponse<T>>{
    try {
        const res = await fetch(url);

        if (!res.ok) {
            return {
                data:null,
                error: `Error a la hora de hacer la peticion: ${res.statusText}`,
                status: res.status
            }
        }

        const body: unknown = await res.json();

        if (body === null || body === undefined) {
            return{
                data:null,
                error: "Error en la petición",
                status: res.status
            };
        }

        return {
            data:body as T,
            error:null,
            status:res.status
        }
    } catch (error) {
        //se nos cayo el internet
        return{
            data:null,
            error:"fallo la conexion total, compre internet",
            status: 500
        };
    }
}