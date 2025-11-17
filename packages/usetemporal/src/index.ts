// Core function
export { createTemporal } from "./createTemporal";
export type { CreateTemporalOptions } from "./createTemporal";

// Builder (Level 2 API)
export { createTemporalBuilder } from "./builder";
export type { TemporalBuilder } from "./builder";

// Period composables - module exports (Level 3 API)
export { usePeriod } from "./composables/usePeriods";

// Operations - functional API
export {
  divide,
  next,
  previous,
  go,
  contains,
  period,
  split,
  merge,
  isSame,
} from "./operations";
export type { SplitOptions } from "./types";

// Utility functions
export { isWeekend, isWeekday, isToday } from "./operations/utils";

// Types
export type {
  Period,
  Unit,
  UnitRegistry,
  AdapterUnit,
  Temporal,
  TemporalContext,
  Adapter,
  UnitHandler,
  AdapterOptions,
  Duration,
  DateOrRef,
  UnitsObject,
} from "./types";

// Unit constants
export {
  UNITS,
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  CUSTOM,
} from "./types";
