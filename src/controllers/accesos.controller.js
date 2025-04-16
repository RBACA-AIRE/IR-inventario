import { getConnection } from "../database/connectionSQLServer.js";
import sql from "mssql";

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

// Endpoint para obtener Ambientes desde la base de datos
export const cargarAmbientes = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);
    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query("SELECT id_ambiente, nombre FROM Ambientes");

    if (result.recordset.length ===0){
      return res
      .status(404)
      .json({success: false, message: "No se encontraron ambientes"});
    }

     // Enviar los ambientes como respuesta
     return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los Ambientes:", error);
    return res
    .status(500)
    .json({
      success:false,
      message: "Error al obtener los Ambientes",
      error:error.message
    });
  }  
};

// Endpoint para obtener Sistemas informaticos desde la base de datos
export const cargarSistemas = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    // Ajusta el nombre de la tabla y las columnas según lo necesario
    const result = await pool.request().query("SELECT id_sistema, nombre FROM Sistemas");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron Sistemas Informaticos" });
    }
    
// Enviar los sistemas como respuesta
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener Sistemas Informaticos:", error);
    return res
    .status(500)
    .json({
      success: false,
      message: "Error al obtener Sistemas Informaticos",
      error: error.message,
    });
  }
};
// Crear la función cargarTipoAccesos si la necesitas
export const cargarTipoConexion = async (req, res) => {
 try {
  const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

  // Ajusta el nombre de la tabla y las columnas según lo necesario
  const result = await pool.request().query("SELECT id_tipo_acceso, nombre FROM TipoAcceso");

  if (result.recordset.length === 0) {
    return res
    .status(404)
    .json({success: false, message: "No se encontraron tipos de accesos"});
  }

  // Enviar los sistemas como respuesta
  return res.status(200).json(result.recordset);
 } catch (error){
  console.error("Error al obtener Tipo de Conexión:", error);
  return res
  .status(500)
  .json({
    success: false,
    message: "Error al obtener Tipo de Conexión",
    error: error.message
  });
 }
};

// Crear la función cargar Unidad de negocio si la necesitas
export const cargarUnidadNegocio = async (req, res) => {
  try {
    const pool = await sql.connect(process.env.DB_CONNECTION_STRING);

    const result = await pool.request().query("SELECT id_uunn, nombre FROM UnidadNegocio");
    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron Unidades de Negocios" });
    }
    // Enviar los roles como respuesta
    return res.status(200).json(result.recordset); // Devuelve los uunn
  } catch (error) {
    console.error("Error al obtener Unidades de Negocio:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener Unidades de Negocio",
        error: error.message,
      });
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
