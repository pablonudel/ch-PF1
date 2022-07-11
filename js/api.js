export class Producto{
    constructor (nombre, descripcion, codigo, foto, precio, stock){
        this.nombre = nombre
        this.descripcion = descripcion
        this.codigo = codigo
        this.foto = foto
        this.precio = precio
        this.stock = stock
        this.timestamp = Date.now()
    }
}

export class Carrito{
    constructor(productos){
        this.timestamp = Date.now()
        this.productos = productos
    }
}

const admin = false
export const adminAccess = (req,res,next)=>{
    const fullUrl = req.get('host') + req.originalUrl
    req.admin = admin
    req.msg = {error:-1, descripcion:`La ruta ${fullUrl} con metodo ${req.method} no esta autorizada`}
    next()
}

export const unimplementedPath = (req, res) => {
    const fullUrl = req.get('host') + req.originalUrl;
    res.json({error:-2, descripcion:`La ruta ${fullUrl} con metodo ${req.method} no esta implementada`})
}