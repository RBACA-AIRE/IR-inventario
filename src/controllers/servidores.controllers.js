import { getConnection } from "../database/connectionSQLServer.js";

// Obtener todos los servidores
export const getServidores = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM SERVIDOR');
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener servidores:', error);
        return res.status(500).json({ message: 'Error al obtener los servidores' });
    }
};

// Obtener un servidor por ID (deberías implementarlo con parámetro)
export const getServidor = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", id)
            .query("SELECT * FROM SERVIDOR WHERE id_servidor = @id"); // Cambié 'ID' por 'id_servidor'

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Servidor no encontrado' });
        }

        return res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener el servidor:', error);
        return res.status(500).json({ message: 'Error al obtener el servidor' });
    }
};

// Crear un nuevo servidor
export const createServidor = async (req, res) => {
    const { nombre, direccion_ip, sistema_operativo, ambiente, descripcion = "" } = req.body;

    if (!nombre || !direccion_ip || !sistema_operativo || !ambiente) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input("nombre", nombre)
            .input("direccion_ip", direccion_ip)
            .input("sistema_operativo", sistema_operativo)
            .input("ambiente", ambiente)
            .input("descripcion", descripcion)
            .query(`
                INSERT INTO SERVIDOR 
                (nombre, direccion_ip, sistema_operativo, ambiente, descripcion) 
                VALUES (@nombre, @direccion_ip, @sistema_operativo, @ambiente, @descripcion)
            `);

        return res.status(201).json({ message: 'Servidor creado correctamente' });
    } catch (error) {
        console.error('Error al crear el servidor:', error);
        return res.status(500).json({ message: 'Error al crear el servidor' });
    }
};

// Actualizar un servidor
export const updateServidor = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, direccion_ip, sistema_operativo, ambiente, descripcion = "" } = req.body;

    if (!id || !nombre || !direccion_ip || !sistema_operativo || !ambiente) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id_servidor", id) // Cambié 'id' por 'id_servidor'
            .input("nombre", nombre)
            .input("direccion_ip", direccion_ip)
            .input("sistema_operativo", sistema_operativo)
            .input("ambiente", ambiente)
            .input("descripcion", descripcion)
            .query(`
                UPDATE SERVIDOR 
                SET nombre = @nombre, 
                    direccion_ip = @direccion_ip, 
                    sistema_operativo = @sistema_operativo, 
                    ambiente = @ambiente, 
                    descripcion = @descripcion 
                WHERE id_servidor = @id_servidor  // Cambié 'ID' por 'id_servidor'
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Servidor no encontrado para actualizar' });
        }

        return res.json({ message: 'Servidor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el servidor:', error);
        return res.status(500).json({ message: 'Error al actualizar el servidor' });
    }
};

// Eliminar un servidor
export const deleteServidor = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", id) // Cambié 'ID' por 'id_servidor'
            .query("DELETE FROM SERVIDOR WHERE id_servidor = @id");  // Cambié 'ID' por 'id_servidor'

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Servidor no encontrado para eliminar' });
        }

        return res.json({ message: 'Servidor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el servidor:', error);
        return res.status(500).json({ message: 'Error al eliminar el servidor' });
    }
};

