"use client";

const BENIGN_WARNINGS = [
  "Clock: This module has been deprecated",
  "THREE.WebGLProgram: Program Info Log",
];

function installFilter() {
  const marker = window as unknown as { __devConsoleFiltered?: boolean };
  if (marker.__devConsoleFiltered) return;
  marker.__devConsoleFiltered = true;

  const originalWarn = console.warn.bind(console);
  const originalLog = console.log.bind(console);

  const isBenign = (...args: unknown[]) =>
    args.some(
      (arg) =>
        typeof arg === "string" &&
        BENIGN_WARNINGS.some((pattern) => arg.includes(pattern))
    );

  console.warn = (...args: unknown[]) => {
    if (!isBenign(...args)) originalWarn(...args);
  };
  console.log = (...args: unknown[]) => {
    if (!isBenign(...args)) originalLog(...args);
  };
}

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  installFilter();
}

export default function DevConsoleFilter() {
  return null;
}
