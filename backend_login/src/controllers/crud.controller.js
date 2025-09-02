const db = require("../config/db");

class CrudController {
  async obtenerTodos(tabla) {
    try {
      const [resultados] = await db.query(`SELECT * FROM \`${tabla}\``);
      return resultados;
    } catch (error) {
      throw error;
    }
  }
  
  async obtenerUno(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [
        tabla,
        idCampo,
        id,
      ]);
      return resultado[0];
    } catch (error) {
      throw error;
    }
  }

  async crear(tabla, data) {
    try {
      const dataToInsert = { ...data };
      delete dataToInsert.id;
      delete dataToInsert.stock;
      if (dataToInsert.categorias) {
        dataToInsert.categoria = dataToInsert.categorias;
        delete dataToInsert.categorias;
      }
      const [resultado] = await db.query(`INSERT INTO ?? SET ?`, [
        tabla,
        dataToInsert,
      ]);
      return { ...data, id_producto: resultado.insertId };
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async actualizar(params) {
    try {
      delete params.id;
      delete params.stock;

      const [resultado] = await db.query(`UPDATE productos SET ? WHERE nombre = ?`, [
        params,
        params.nombre,
      ]);

      return resultado;
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      throw error;
    }
  }

  async eliminar(tabla, idCampo, id) {
    try {
      const [resultado] = await db.query(`DELETE FROM ?? WHERE ?? = ?`, [
        tabla,
        idCampo,
        id,
      ]);
      if (resultado.affectedRows === 0) {
        throw new Error("Registro no encontrado");
      }
      return { mensaje: "Registro eliminado correctamente" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CrudController;
