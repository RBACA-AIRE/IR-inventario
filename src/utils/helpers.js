// Elimina acentos, símbolos y convierte a minúsculas
export function normalizarTexto(texto) {
  return texto
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // eliminar acentos
    .replace(/[^\w\s\.]/gi, '') // quitar signos
    .toLowerCase();
}

// Extrae IP con formato básico
export function extraerIP(texto) {
  const match = texto.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
  return match ? match[0] : null;
}
