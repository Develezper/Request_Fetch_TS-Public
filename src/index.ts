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
  const pokemonList = await pokemonService.getAll();
  console.log("Lista de pokémon:", pokemonList);

  const pikachu = await pokemonService.getOne("pikachu");
  console.log("Detalle de pikachu:", pikachu);

  const abilityList = await abilityService.getAll();
  console.log("Lista de habilidades:", abilityList);

  const invalidPokemon = await pokemonService.getOne("no-existe-12345");
  console.log("Pokémon inválido:", invalidPokemon);
}

void main();
