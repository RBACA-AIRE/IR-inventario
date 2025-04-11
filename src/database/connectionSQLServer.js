import sql from "mssql";

/* ===== Parámetros de conexión ======== */

const dbSettings = {
    server: "localhost",
    database: "DB_CMDServer",
    port: 56840,
    driver:"msnodesqlv8",
    options: {
        trustedconnection: true,
        encrypt: false, // Deshabilitar el cifrado
        trustServerCertificate: true // Ignora certificados no confiables
    },
    authentication: {
        type: "default", // Usar NTLM si es Windows
        options: {
            domain: "INMAN-DESKTOP-009",  // Asegúrate de que sea el dominio correcto
            userName: "snoopy",  // Asegúrate de que el usuario tenga permisos adecuados
            password: "rbacaaire1"  // Si no tienes contraseña, deja vacío
        }
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
    }
};

getConnection();
