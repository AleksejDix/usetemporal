import { Temporal } from "@js-temporal/polyfill";
globalThis.Temporal = Temporal;

// Set timezone to UTC for consistent testing
process.env.TZ = "UTC";

// Suppress React error boundary warnings in tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Suppress specific React warnings that are expected in error tests
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("Consider adding an error boundary") ||
      message.includes("The above error occurred"))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.log("✅ Temporal polyfill loaded for testing");
