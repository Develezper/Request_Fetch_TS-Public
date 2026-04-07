export type NamedApiResource = {
  name: string;
  url: string;
};

export type PokemonSummary = NamedApiResource;

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    slot: number;
    type: NamedApiResource;
  }>;
  abilities: Array<{
    slot: number;
    is_hidden: boolean;
    ability: NamedApiResource;
  }>;
};

export type AbilitySummary = NamedApiResource;

export type AbilityDetail = {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    language: NamedApiResource;
  }>;
};
