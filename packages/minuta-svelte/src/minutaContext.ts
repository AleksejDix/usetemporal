import { getContext, setContext } from "svelte";
import type { MinutaBuilder } from "./types";

const MINUTA_CONTEXT_KEY = Symbol("MinutaContext");

export function provideMinuta(builder: MinutaBuilder) {
  setContext(MINUTA_CONTEXT_KEY, builder);
}

export function injectMinuta(): MinutaBuilder {
  const temporal = getContext<MinutaBuilder>(MINUTA_CONTEXT_KEY);
  if (!temporal) {
    throw new Error(
      "No minuta instance provided. Call createMinuta() inside a component before using useMinuta()."
    );
  }
  return temporal;
}
