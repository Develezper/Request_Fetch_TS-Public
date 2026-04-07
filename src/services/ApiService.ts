import { fetchData } from "../lib/fetchData";
import type { ApiResponse } from "../types/api";

export class ApiService<TList, TDetail = TList> {
  constructor(
    private readonly endpoint: string,
    private readonly listLimit = 20,
  ) {}

  private buildListUrl(): string {
    const separator = this.endpoint.includes("?") ? "&" : "?";
    return `${this.endpoint}${separator}limit=${this.listLimit}`;
  }

  async getAll(): Promise<ApiResponse<TList[]>> {
    const result = await fetchData<unknown>(this.buildListUrl());

    // Si fetchData ya detectó error, lo propagamos tal cual.
    if (result.error) {
      return { data: null, error: result.error, status: result.status };
    }

    // Caso 1: API que devuelve directamente un arreglo.
    if (Array.isArray(result.data)) {
      return {
        data: result.data as TList[],
        error: null,
        status: result.status,
      };
    }

    // Caso 2: API paginada tipo PokeAPI/Rick&Morty: { results: [...] }.
    if (
      result.data !== null &&
      typeof result.data === "object" &&
      "results" in result.data &&
      Array.isArray((result.data as { results: unknown }).results)
    ) {
      return {
        data: (result.data as { results: unknown[] }).results as TList[],
        error: null,
        status: result.status,
      };
    }

    return {
      data: null,
      error: "Se esperaba un arreglo o un objeto con `results` en getAll().",
      status: result.status,
    };
  }

  async getOne(id: number | string): Promise<ApiResponse<TDetail>> {
    // Acepta id numérico o string (ej: "pikachu").
    return fetchData<TDetail>(`${this.endpoint}/${id}`);
  }
}
