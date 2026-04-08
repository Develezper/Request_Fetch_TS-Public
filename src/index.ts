import { ApiService } from "./services/ApiService";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type {
  AbilityDetail,
  AbilitySummary,
  PokemonDetail,
  PokemonSummary,
} from "./types/pokemon";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const pokemonService = new ApiService<PokemonSummary, PokemonDetail>(
  "https://pokeapi.co/api/v2/pokemon",
  10,
);

const abilityService = new ApiService<AbilitySummary, AbilityDetail>(
  "https://pokeapi.co/api/v2/ability",
  10,
);

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(
  response: ServerResponse,
  payload: unknown,
  status = 200,
): void {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...CORS_HEADERS,
  });
  response.end(JSON.stringify(payload));
}

function sendNotFound(response: ServerResponse, pathname: string): void {
  sendJson(
    response,
    {
      error: "Ruta no encontrada",
      pathname,
      routes: [
        "GET /health",
        "GET /pokemon",
        "GET /pokemon/:id",
        "GET /ability",
        "GET /ability/:id",
      ],
    },
    404,
  );
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  if (request.method === "OPTIONS") {
    response.writeHead(204, CORS_HEADERS);
    response.end();
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, { error: "Método no permitido" }, 405);
    return;
  }

  const host = request.headers.host ?? `${HOST}:${PORT}`;
  const url = new URL(request.url ?? "/", `http://${host}`);
  const { pathname } = url;

  if (pathname === "/health") {
    sendJson(response, {
      ok: true,
      service: "request-fetch-ts",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (pathname === "/pokemon") {
    const result = await pokemonService.getAll();
    sendJson(response, result, result.status || 500);
    return;
  }

  if (pathname.startsWith("/pokemon/")) {
    const idOrName = decodeURIComponent(pathname.replace("/pokemon/", ""));
    if (!idOrName) {
      sendJson(response, { error: "Falta el id o nombre del pokemon" }, 400);
      return;
    }
    const result = await pokemonService.getOne(idOrName);
    sendJson(response, result, result.status || 500);
    return;
  }

  if (pathname === "/ability") {
    const result = await abilityService.getAll();
    sendJson(response, result, result.status || 500);
    return;
  }

  if (pathname.startsWith("/ability/")) {
    const idOrName = decodeURIComponent(pathname.replace("/ability/", ""));
    if (!idOrName) {
      sendJson(response, { error: "Falta el id o nombre de la habilidad" }, 400);
      return;
    }
    const result = await abilityService.getOne(idOrName);
    sendJson(response, result, result.status || 500);
    return;
  }

  sendNotFound(response, pathname);
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    sendJson(response, { error: message }, 500);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
