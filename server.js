import express from 'express'
import {routerProductos, routerCarrito} from './js/Rutas.js'
import { unimplementedPath } from './js/api.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended:true}))
app.use('/api/productos', routerProductos)

routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({extended:true}))
app.use('/api/carrito', routerCarrito)

app.use('*', unimplementedPath)

const PORT = 8080 || process.env.PORT 
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', error => console.log(`Error en el servidor ${error}`))