import type { ApiResponse } from "../types/api";

export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        data: null,
        error: `HTTP ${response.status}: ${response.statusText || "Error en la petición"}`,
        status: response.status,
      };
    }

    // Evita romper cuando el servidor responde sin cuerpo (ej: 204 No Content)
    const rawBody = await response.text();

    if (!rawBody.trim()) {
      return {
        data: null,
        error: "La respuesta llegó vacía.",
        status: response.status,
      };
    }

    const parsedBody: unknown = JSON.parse(rawBody);

    return {
      data: parsedBody as T,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? `Error de red: ${error.message}` : "Error de red desconocido.",
      status: 0,
    };
  }
}
