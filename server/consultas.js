const { Pool } = require("pg")

const pool = new Pool({
  //conexion
  host: "localhost",
  user: "postgres",
  password: "woman2020",
  database: "likeme",
  allowExitOnIdle: true,
})

const gregarPost = async (titulo, url, descripcion) => { //funcion parametrizada, el 0  es para los likes, para no tener un valor nulo.
  const consulta = "INSERT INTO post VALUES (DEFAULT, $1, $2, $3, 0)"
  const values = [titulo, url, descripcion]
  const result = await pool.query(consulta, values)
  console.log("Post agregado exitosamente")
}

const getPosts = async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM post ORDER BY id DESC")  // la query ordenanda para que muestre los post agregados al inicio
    return rows
  } catch (error) {
    console.log(error)
  }
}

const eliminarPost = async (id) => {
  try {
    const consulta = "DELETE FROM post WHERE id = $1"
    const values = [id];
    const result = await pool.query(consulta, values)
    console.log(`registro ${id} eliminado exitosamente`)
  } catch (error) {
    console.log(err)
  }
}

const like = async (id) => {
  try {
    const command = "UPDATE post SET likes = likes +  1  WHERE id = $1 "
    const value = [id]
    await pool.query(command, value)
    console.log(`Like agregado a registro ${id}`)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { gregarPost, getPosts, eliminarPost, like }
