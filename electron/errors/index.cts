export const isNotFound = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes("no such file or directory");
};
