import sql from "mssql";

/* ===== Parámetros de conexión (SQL Authentication) ===== */

const dbSettings = {
  server: "IRPRDV0496",     // o la IP del servidor
  port: 1433,
  database: "DB_CMDServer",
  user: "snoopy",           // login SQL
  password: "Sn00py!2025",  // contraseña de ese login
  options: {
    encrypt: false,             // no uses SSL si no lo configuraste
    trustServerCertificate: true
  }
};

export const getConnection = async () => {
  try {
    console.log("Intentando conectar a la BD...");
    const pool = await sql.connect(dbSettings);
    console.log("Conexión exitosa.");
    return pool;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    throw error;
  }
};
