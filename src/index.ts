import { ApiService } from "./services/ApiService";
import type {
  AbilityDetail,
  AbilitySummary,
  PokemonDetail,
  PokemonSummary,
} from "./types/pokemon";

const pokemonService = new ApiService<PokemonSummary, PokemonDetail>(
  "https://pokeapi.co/api/v2/pokemon",
  10,
);

const abilityService = new ApiService<AbilitySummary, AbilityDetail>(
  "https://pokeapi.co/api/v2/ability",
  10,
);

async function main(): Promise<void> {
  // 1) Lista paginada de recursos (resumen).
  const pokemonList = await pokemonService.getAll();
  console.log("Lista de pokémon:", pokemonList);

  // 2) Recurso individual usando nombre como identificador.
  const pikachu = await pokemonService.getOne("pikachu");
  console.log("Detalle de pikachu:", pikachu);

  // 3) Segundo recurso para demostrar reutilización del servicio genérico.
  const abilityList = await abilityService.getAll();
  console.log("Lista de habilidades:", abilityList);

  // 4) Caso de error controlado para verificar manejo de 404.
  const invalidPokemon = await pokemonService.getOne("no-existe-12345");
  console.log("Pokémon inválido:", invalidPokemon);
}

void main();
