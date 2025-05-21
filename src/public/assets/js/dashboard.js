document.addEventListener('DOMContentLoaded', () => {
  // URLs y elementos donde mostrar datos
  const urlEstadisticas = '/api/dashboard';  // ruta API en backend
  const usuariosEl = document.getElementById('usuarios-registrados');
  const accesosEl = document.getElementById('accesos-remotos');
  const inventarioEl = document.getElementById('inventario-general');
  const baseConocimientoEl = document.getElementById('base-conocimiento');

  // Mostrar mensaje de carga inicialmente
  usuariosEl.textContent = 'Cargando...';
  accesosEl.textContent = 'Cargando...';
  inventarioEl.textContent = 'Cargando...';
  baseConocimientoEl.textContent = 'Cargando...';

  // Petición a la API para obtener datos
  fetch(urlEstadisticas)
    .then(res => {
      if (!res.ok) throw new Error('Error al obtener datos');
      return res.json();
    })
    .then(data => {
      usuariosEl.textContent = data.totalUsuarios ?? '0';
      accesosEl.textContent = data.totalAccesos ?? '0';
      inventarioEl.textContent = data.totalInventario ?? '0';
      baseConocimientoEl.textContent = data.totalBaseConocimiento ?? '0';
    })
    .catch(err => {
      console.error(err);
      usuariosEl.textContent = 'Error';
      accesosEl.textContent = 'Error';
      inventarioEl.textContent = 'Error';
      baseConocimientoEl.textContent = 'Error';
    });
});
