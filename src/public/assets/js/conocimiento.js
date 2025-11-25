document.addEventListener("DOMContentLoaded", async () => {
  const modulosContainer = document.getElementById("modulosList");
  const manualesList = document.getElementById("manualesList");

  // Mostrar estado de carga
  modulosContainer.innerHTML = '<li class="px-2 py-1 text-gray-500">Cargando módulos...</li>';
  //manualesList.innerHTML = '<div class="text-center py-4"><div class="flex flex-col items-center justify-center"><div class="text-[20px] text-[#111] mb-2 font-semibold">CARGANDO...</div></div></div>';

  try {
    const res = await fetch("api/conocimientos");
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!Array.isArray(data)) {
      throw newError("La respuesta de la API no es un array");
    }

    if (data.length === 0) {
      modulosContainer.innerHTML = '<li class="px-2 py-1 text-gray-500">No hay módulos disponibles</li>';
      manualesList.innerHTML = '<div class="text-center py-4"><div class="flex flex-col items-center justify-center"><div class="text-[20px] text-[#111] mb-2 font-semibold">NO HAY DATOS DISPONIBLES</div></div></div>';
      return;
    }

    const modulosMap = new Map();

    // Usar las propiedades que tu API devuelve (Modulo, Descripcion, RutaArchivo, etc.)
    data.forEach(item => {
      // Asumimos que cada item tiene Modulo y Descripcion
      const moduloKey = item.Modulo; // Usamos el nombre del módulo como clave
      const moduloNombre = item.Modulo;
      
      if (!modulosMap.has(moduloKey)) {
        modulosMap.set(moduloKey, {
          nombre: moduloNombre,
          submodulos: []
        });
      }
      
      // Agregar el submódulo (cada item es un submódulo)
      modulosMap.get(moduloKey).submodulos.push({
        id: item.Submodulo || item.id, // Si no hay Submodulo, quizás hay un id
        descripcion: item.Descripcion,
        url: item.RutaArchivo || item.RutaVista // Usar RutaArchivo o RutaVista
      });
    });

    // Renderizar módulos
    modulosContainer.innerHTML = '';
    modulosMap.forEach((moduloData, moduloKey) => {
      const li = document.createElement("li");
      li.className = "px-2 py-1 hover:bg-gray-100 cursor-pointer flex justify-between items-center";
      li.innerHTML = `
        <span>${moduloData.nombre}</span>
        <span class="text-xs text-gray-500">${moduloData.submodulos.length}</span>
      `;
      
      li.addEventListener("click", () => {
        // Remover selección anterior
        document.querySelectorAll('#modulosList li').forEach(item => {
          item.classList.remove('bg-blue-100', 'text-blue-800');
        });
        
        // Resaltar módulo seleccionado
        li.classList.add('bg-blue-100', 'text-blue-800');
        
        // Renderizar submódulos
        renderSubmodulos(moduloData.submodulos);
      });
      
      modulosContainer.appendChild(li);
    });

  } catch (err) {
    console.error("Error al cargar módulos:", err);
    modulosContainer.innerHTML = '<li class="px-2 py-1 text-red-500">Error al cargar módulos</li>';
    manualesList.innerHTML = '<div class="text-center py-4"><div class="flex flex-col items-center justify-center"><div class="text-[20px] text-red-600 mb-2 font-semibold">ERROR AL CARGAR LOS DATOS</div><div class="text-sm text-gray-500">Por favor, intente más tarde</div></div></div>';
  }

  function renderSubmodulos(submodulos) {
    manualesList.innerHTML = "";
    
    if (submodulos.length === 0) {
      manualesList.innerHTML = '<div class="text-center py-8"><div class="text-lg text-gray-600 mb-2">No hay manuales disponibles</div><div class="text-sm text-gray-500">Seleccione otro módulo</div></div>';
      return;
    }

    submodulos.forEach(sm => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-200";
      
      const desc = document.createElement("div");
      desc.className = "flex-1 truncate text-[13px] text-[#111]";
      desc.textContent = sm.descripcion || "Sin descripción";

      const action = document.createElement("div");
      action.className = "flex items-center gap-2";

      // Botón Ver
      if (sm.url) {
        const btnVer = document.createElement("a");
        btnVer.href = sm.url;
        btnVer.target = "_blank";
        btnVer.title = "Ver documento";
        btnVer.className = "text-blue-600 hover:text-blue-800 font-medium";
        btnVer.innerHTML = `<i class="fas fa-eye mr-1"></i> Ver`;
        action.appendChild(btnVer);
      }

      div.appendChild(desc);
      div.appendChild(action);
      manualesList.appendChild(div);
    });
  }
});