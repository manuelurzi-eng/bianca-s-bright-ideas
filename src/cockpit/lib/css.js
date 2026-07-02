// Converte una stringa CSS ("display:flex;gap:8px") nell'oggetto style di React.
// Serve a tenere il markup dei componenti fedele 1:1 al prototipo Claude Design,
// che usa attributi style="" inline. Risultato memoizzato per stringa.
const cache = new Map();

export function css(str) {
  if (!str) return undefined;
  const hit = cache.get(str);
  if (hit) return hit;
  const obj = {};
  str.split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop) return;
    // kebab-case → camelCase (mantiene le --css-variables intatte)
    const key = prop.startsWith('--')
      ? prop
      : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[key] = value;
  });
  cache.set(str, obj);
  return obj;
}
