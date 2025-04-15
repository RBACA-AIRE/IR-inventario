import { getConnection } from "../database/connectionSQLServer.js";

// Crear acceso
export const createAcceso = async (req, res) => {
  try {
    const { id_servidor, id_tipo_acceso, id_uunn, acceso_contacto } = req.body;

    const connection = await getConnection();
    const result = await connection.request()
      .input("id_servidor", id_servidor)
      .input("id_tipo_acceso", id_tipo_acceso)
      .input("id_uunn", id_uunn)
      .input("acceso_contacto", acceso_contacto)
      .query(`
        INSERT INTO AccesoServidor (id_servidor, id_tipo_acceso, id_uunn, acceso_contacto)
        OUTPUT INSERTED.id_acceso
        VALUES (@id_servidor, @id_tipo_acceso, @id_uunn, @acceso_contacto)
      `);

    res.status(201).json({ 
      message: "AccesoServidor creado correctamente", 
      id: result.recordset[0].id_acceso 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear AccesoServidor", error: error.message });
  }
};

// Aquí se incluiría la función cargarAmbientes si la necesitas
export const cargarAmbientes = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query("SELECT * FROM Ambiente"); // Ejemplo de consulta
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar ambientes", error: error.message });
  }
};

// Crear la función cargarSistemas si la necesitas
export const cargarSistemas = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query("SELECT * FROM Sistema"); // Ejemplo de consulta
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar sistemas", error: error.message });
  }
};

// Crear la función cargarTipoAccesos si la necesitas
export const cargarTipoAccesos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query("SELECT * FROM TipoAcceso"); // Ejemplo de consulta
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar tipos de acceso", error: error.message });
  }
};





export const getAccesos = async (req, res) => {
    try {
      const connection = await getConnection();
      const result = await connection.request().query(`EXEC dbo.sp_ConsultarAccesosServidores`);
      
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener accesos", error });
    }
  };
  

// Leer un acceso específico
export const getAcceso = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id_acceso", id)
      .query(`
        SELECT 
          asv.id_acceso,
          s.nombre AS NombreServidor,
          s.direccion_ip AS DireccionIP,
          s.sistema_operativo AS SistemaOperativo,
          u.nombre AS UnidadNegocio,
          s.ambiente AS Ambiente,
          ta.nombre AS TipoAcceso,
          asv.acceso_contacto
        FROM AccesoServidor asv
        JOIN Servidor s ON asv.id_servidor = s.id_servidor
        JOIN TipoAcceso ta ON asv.id_tipo_acceso = ta.id_tipo_acceso
        JOIN UnidadNegocio u ON asv.id_uunn = u.id_uunn
        WHERE asv.id_acceso = @id_acceso
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "AccesoServidor no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el acceso", error: error.message });
  }
};


// Actualizar acceso
export const updateAcceso = async (req, res) => {
  const { id } = req.params;
  const { id_servidor, id_tipo_acceso, id_uunn, acceso_contacto } = req.body;
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id_acceso", id)
      .input("id_servidor", id_servidor)
      .input("id_tipo_acceso", id_tipo_acceso)
      .input("id_uunn", id_uunn)
      .input("acceso_contacto", acceso_contacto)
      .query(`
        UPDATE AccesoServidor
        SET id_servidor = @id_servidor, 
            id_tipo_acceso = @id_tipo_acceso, 
            id_uunn = @id_uunn,
            acceso_contacto = @acceso_contacto
        WHERE id_acceso = @id_acceso
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "AccesoServidor no encontrado" });
    }

    res.status(200).json({ message: "AccesoServidor actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar AccesoServidor", error: error.message });
  }
};

// Eliminar acceso
export const deleteAcceso = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const result = await connection.request()
      .input("id_acceso", id)
      .query("DELETE FROM AccesoServidor WHERE id_acceso = @id_acceso");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "AccesoServidor no encontrado" });
    }

    res.status(200).json({ message: "AccesoServidor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar AccesoServidor", error: error.message });
  }
};
