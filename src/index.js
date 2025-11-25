import app from "./app.js";
import { getConnection } from "./database/connectionSQLServer.js";

const startServer = async () => {
  try {
    await getConnection();                     // ← espera que la BD conecte
    app.listen(3000, () => {
      console.log("Servidor iniciado en http://localhost:3000");
    });
  } catch (err) {
    console.error("No se pudo iniciar el servidor:", err);
    process.exit(1);
  }
};

startServer();
