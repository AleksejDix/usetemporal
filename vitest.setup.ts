import { Temporal } from "@js-temporal/polyfill";
globalThis.Temporal = Temporal;

// Set timezone to UTC for consistent testing
process.env.TZ = "UTC";

console.log("✅ Temporal polyfill loaded for testing");
