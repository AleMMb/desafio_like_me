/*Maty use los primeros archivos que subieron a la plataforma*/

const express = require("express")
const app = express()
const cors = require("cors")
const { gregarPost, getPosts, eliminarPost, like } = require("./consultas") //importa funciones

app.listen(3000, console.log("¡Servidor encendido!")) //configura mi server
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

const verificarID = async (req, res, next) => {// func. que verifica id existente y es pasada como parámetro para otras funciones que requieran ID
  const { id } = req.params
  try {
      await getPosts(id)
      next()
  } catch (error) {
      res.status(404).send("ID no existe")
  }
}


const reportarConsulta = async (req, res, next) => { //reporta la consulta realizada al servidor.
  const parametros = req.params
  const url = req.url
  console.log(`Hoy ${new Date()} Se ha recibido una consulta en la ruta ${url} 
  con los parámetros:`, parametros)
  next()
}

app.get("/posts", async (req, res) => { //muestra contenido desde base de datos
  const post = await getPosts()
  res.json(post)
})

app.post("/posts", reportarConsulta, async (req, res) => { //Agrega contenido a base de datos e informa al front cual es el posible error
  try {
    const { titulo, url, descripcion, likes } = req.body
    await gregarPost(titulo, url, descripcion, likes)
    console.log("Post agregado exitosamente")
    res.status(200).send(`Post agregado con exito`)
  } catch (error) {
    const { code } = error
    if (code == "22001") {
      res.status(400).json({
        status: 400,
        mensaje:
          "el length de la URL es demasiado largo para el tipo character varying(1000)"
      })
    } else {
      res.status(500).send(error)
    }
  }
})

app.put("/posts/:likes/:id", reportarConsulta, verificarID, async (req, res) => { // Aumenta los likes de un post.
  try {
    const { id } = req.params
    if (id != "") {
      await like(id)
      res.status(200).send(`Like agregado con éxito`)
    } else {
      res.status(404).json({
        status: 404,
        estado: "error: ID no detectado",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.delete("/posts/:id", reportarConsulta, verificarID , async (req, res) => { //elimina el post
  const { id } = req.params
  await eliminarPost(id)
  res.status(200).send(`Post ${id} eliminado con éxito.`)
})
