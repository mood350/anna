/**
 * `next/image` et `next/link` ajoutent le basePath tout seuls, mais pas les
 * attributs HTML bruts comme `<video src>` ou `<video poster>`.
 * Ces fichiers-là doivent passer par `asset()`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
