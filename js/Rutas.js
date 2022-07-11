import express from 'express'
import Contenedor from './Contenedor.js'
import {Producto, Carrito, adminAccess} from './api.js'

export const routerProductos = express.Router()
export const routerCarrito = express.Router()

const dataProductos = new Contenedor('./filesystem/productos.txt')
const dataCarritos = new Contenedor('./filesystem/carritos.txt')

routerProductos.get('/', async (req, res)=>{
    try {
        const array = await dataProductos.getAll()
        array.length > 0 ? res.json(array) : res.json({msg:'No hay productos'})
    } catch (error) {
        console.log(error);
    }
})

routerProductos.get('/:id', async (req, res)=>{
    let id = parseInt(req.params.id)
    try {
        const obj = await dataProductos.getById(id)
        obj ? res.json(obj) : res.json({msg:'No existe un producto con ese ID'})
    } catch (error) {
        console.log(error);
    }
})


routerProductos.post('/', adminAccess, async (req,res) =>{
    const product = new Producto(req.body.nombre, req.body.descripcion, req.body.codigo, req.body.foto, req.body.precio, req.body.stock)
    try {
        req.admin ? res.json(await dataProductos.save(product)) : res.json(req.msg)
    } catch (error) {
        console.log(error);
    }
})

routerProductos.put('/:id', adminAccess, async (req,res)=>{
    let id = parseInt(req.params.id)
    const prodUpdated = new Producto(req.body.nombre, req.body.descripcion, req.body.codigo, req.body.foto, req.body.precio, req.body.stock)
    req.admin ?
    await dataProductos.getById(id) ? res.json(await dataProductos.updateById(id, prodUpdated)) : res.json({error:'El producto que quiere actualizar no se existe'}) :
    res.json(req.msg)
})

routerProductos.delete('/:id', adminAccess, async (req,res) =>{
    const id = parseInt(req.params.id)
    req.admin ?
    await dataProductos.getById(id) ? res.json(await dataProductos.deleteById(id)) : res.json({error:'El producto que quiere eliminar no se existe'}) :
    res.json(req.msg)
})

/*-----*/

routerCarrito.post('/', async (req,res) =>{
    const carrito = new Carrito([])
    try {
        const carritoAdded = await dataCarritos.save(carrito)
        res.json(carritoAdded)
    } catch (error) {
        console.log(error);
    }
})

routerCarrito.get('/:id/productos', async (req,res) =>{
    let id = parseInt(req.params.id)
    try {
        const carrito = await dataCarritos.getById(id)
        carrito ? res.json(carrito.productos) : res.json({error:'El carrito que quiere listar no se existe'})
    } catch (error) {
        console.log(error);
    }
}) 

routerCarrito.post('/:id/productos', async (req,res) =>{
    let id = parseInt(req.params.id)
    try {
        const carrito = await dataCarritos.getById(id)
        const productos = await dataProductos.getAll()
        let newArray = []
        
        req.body.forEach(element => {
            newArray.push(productos.find(p => p.id === element))
            carrito.productos = carrito.productos.filter(p => p.id !== element)
        })
    
        carrito.productos.push(...newArray)
        await dataCarritos.updateById(id, carrito)
        res.json(carrito.productos)
        
    } catch (error) {
        console.log(error);
    }
}) 

routerCarrito.delete('/:id/productos/:id_prod', async (req,res) =>{
    let id = parseInt(req.params.id)
    let idProd = parseInt(req.params.id_prod)
    const carrito = await dataCarritos.getById(id)
    const producto = carrito.productos.find(p => p.id === idProd)
    carrito.productos = carrito.productos.filter(p => p.id !== idProd)
    await dataCarritos.updateById(id, carrito)
    carrito ? (producto ? res.json(carrito.productos) : res.json({error:'El producto que quiere eliminar no se existe'})) : res.json({error:'El carrito que quiere eliminar no se existe'})
})

routerCarrito.delete('/:id', async (req,res) =>{
    let id = parseInt(req.params.id)
    await dataCarritos.getById(id) ? res.json(await dataCarritos.deleteById(id)) : res.json({error:'El carrito que quiere eliminar no se existe'})
})