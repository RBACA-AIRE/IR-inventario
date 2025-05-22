import sql from "mssql";
import { getConnection } from "../database/connectionSQLServer.js";
import classifier from "../utils/classifier.js";
import { normalizarTexto, extraerIP } from "../utils/helpers.js";

const respuestasEstaticas = {
  saludo: "¡Hola! ¿En qué puedo ayudarte?",
  capacidad: "Puedo responder preguntas simples y hacer consultas en la base de datos.",
  agradecimiento: "¡De nada!",
  despedida: "¡Hasta luego!",
};

export const procesarMensaje = async (req, res) => {
  // ✅ Validación segura del cuerpo
  const mensaje = req.body?.mensaje;
  if (!mensaje || typeof mensaje !== 'string') {
    return res.status(400).json({ error: 'Se requiere el campo "mensaje" de tipo texto.' });
  }

  const mensajeNormalizado = normalizarTexto(mensaje);
  const categoria = classifier.classify(mensajeNormalizado);

  let respuesta = "Lo siento, no entendí tu pregunta.";

  try {
    const pool = await getConnection();

    switch (categoria) {
      case "saludo":
      case "capacidad":
      case "agradecimiento":
      case "despedida":
        respuesta = respuestasEstaticas[categoria];
        break;

      case "usuariosRegistrados": {
        const result = await pool.request().query("SELECT COUNT(*) AS total FROM Usuario");
        respuesta = `Actualmente hay ${result.recordset[0].total} usuarios registrados.`;
        break;
      }

      case "accesosRegistrados": {
        const result = await pool.request().query("EXEC sp_ConsultarAccesosServidores");
        respuesta = `Hay ${result.recordset.length} accesos remotos registrados.`;
        break;
      }

      case "buscarPorIP": {
        const ip = extraerIP(mensaje);
        if (ip) {
          const result = await pool.request().query("EXEC sp_ConsultarAccesosServidores");
          const servidor = result.recordset.find(s => s.DireccionIP === ip);
          respuesta = servidor
            ? `La IP ${ip} pertenece al servidor: ${servidor.NombreServidor}.`
            : `No se encontró ningún servidor con la IP ${ip}.`;
        } else {
          respuesta = "Por favor, proporciona una IP válida.";
        }
        break;
      }

      case "buscarAplicacion": {
        const result = await pool.request().query("EXEC sp_ConsultarAccesosServidores");
        const servidorApp = result.recordset.find(s =>
          mensajeNormalizado.includes(s.NombreServidor.toLowerCase())
        );
        respuesta = servidorApp
          ? `El servidor ${servidorApp.NombreServidor} está asociado al sistema ${servidorApp.SistemaNombre}.`
          : "No pude identificar el servidor al que te refieres.";
        break;
      }

      case "buscarCredenciales": {
        const result = await pool.request().query("EXEC sp_ConsultarAccesosServidores");
        const servidor = result.recordset.find(s =>
          mensajeNormalizado.includes(s.NombreServidor.toLowerCase())
        );
        respuesta = servidor?.UsuarioCredencial
          ? `Credenciales admin del servidor ${servidor.NombreServidor}:\nUsuario: ${servidor.UsuarioCredencial}\nContraseña: ${servidor.ContrasenaEncriptada}`
          : "No encontré las credenciales del servidor mencionado.";
        break;
      }

      case "buscarCapacidades": {
        const result = await pool.request().query("EXEC sp_ConsultarAccesosServidores");
        const servidor = result.recordset.find(s =>
          mensajeNormalizado.includes(s.NombreServidor.toLowerCase())
        );
        respuesta = servidor
          ? `Servidor ${servidor.NombreServidor} corre ${servidor.SistemaOperativo} en el ambiente ${servidor.Ambiente}.`
          : "No se encontraron capacidades específicas para ese servidor.";
        break;
      }
    }

    // Guardar en historial
    await pool.request()
      .input("mensajeUsuario", sql.NVarChar, mensaje)
      .input("respuestaBot", sql.NVarChar, respuesta)
      .query("INSERT INTO HistorialChat (MensajeUsuario, RespuestaBot) VALUES (@mensajeUsuario, @respuestaBot)");

    res.json({ respuesta });

  } catch (err) {
    console.error("Error al procesar mensaje:", err);
    res.status(500).json({ error: "Ocurrió un error al procesar tu mensaje." });
  }
};
