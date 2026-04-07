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
  console.log("Lista de pokémon:", {
    status: pokemonList.status,
    error: pokemonList.error,
    total: pokemonList.data?.length ?? 0,
    names: pokemonList.data?.map((pokemon) => pokemon.name) ?? [],
  });

  // 2) Recurso individual usando nombre como identificador.
  const pikachu = await pokemonService.getOne("pikachu");
  console.log("Detalle de pikachu:", {
    status: pikachu.status,
    error: pikachu.error,
    data: pikachu.data
      ? {
          id: pikachu.data.id,
          name: pikachu.data.name,
          height: pikachu.data.height,
          weight: pikachu.data.weight,
          types: pikachu.data.types.map((typeInfo) => typeInfo.type.name),
          abilities: pikachu.data.abilities.map((abilityInfo) => abilityInfo.ability.name),
        }
      : null,
  });

  // 3) Segundo recurso para demostrar reutilización del servicio genérico.
  const abilityList = await abilityService.getAll();
  console.log("Lista de habilidades:", {
    status: abilityList.status,
    error: abilityList.error,
    total: abilityList.data?.length ?? 0,
    names: abilityList.data?.map((ability) => ability.name) ?? [],
  });

  // 4) Caso de error controlado para verificar manejo de 404.
  const invalidPokemon = await pokemonService.getOne("no-existe-12345");
  console.log("Pokémon inválido:", {
    status: invalidPokemon.status,
    error: invalidPokemon.error,
    data: invalidPokemon.data,
  });
}

void main();
