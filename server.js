const express = require("express");
const { Router } = require("express");
const app = express();
const {Contenedor}=require("./contenedor")



const productosApi= new Contenedor('./productos.json');
const carritoApi = new Contenedor("./carrito.json");

const routerApi = Router();
const routerProductos = Router();
const routerCarrito = Router();
const administrador= false;

app.use("/", routerApi);
app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)

routerApi.use(express.json());
routerApi.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ------------- middlewares------------------------------ */
function validarAdmin(req,res,next){
  if(administrador){
    next()
  }else{
    res.send('No tienes permiso para realizar esta accion')
  }
}
/* -------------------------Productos---------------------------- */

routerProductos.get("/:id?", async (req,res) =>{
  let id = Number(req.params.id)
  if(id){
    let item = await productosApi.getById(id);
    console.log(item)
    res.json(item)
  } else{
    let listar = await productosApi.getAll();
    res.json(listar)
  }
})

routerProductos.post("/",validarAdmin, async (req, res) => {
    let item = req.body
     await productosApi.addItem(item)
    res.send(item);
  });

  routerProductos.put("/:id", validarAdmin, async (req, res)=>{
    let id = Number(req.params.id)
    let newItem = req.body    
    let replace = await productosApi.putItem(id,newItem)
    res.send(replace)
})

routerProductos.delete('/:id', validarAdmin, async (req,res) =>{
    let id = Number(req.params.id)
     await productosApi.deleteById(id);
    console.log(`Producto con id ${id} ELIMINADO`)
    res.send(`Producto con id ${id} fue ELIMINADO EXITOSAMENTE`)
})

/* ---------------- Carrito--------------------- */

routerCarrito.get("/", async (req,res) =>{
    res.json((await carritoApi.getAll()).map(item=>item.id))
})

routerCarrito.post("/", async (req, res) => {
  res.json({id: await carritoApi.addItem({productos:[]})})
})

routerCarrito.delete('/:id', async (req,res)=>{
  let id = Number(req.params.id)
  res.json(await carritoApi.deleteById(id))
})

routerCarrito.get('/:id/productos', async (req,res)=>{
  let id = Number(req.params.id)
  const carrito = await carritoApi.getAll(id)
  res.json(carrito.productos)
})

routerCarrito.post('/:id/productos', async (req,res)=>{  
  const carrito = await carritoApi.getAll(req.params.id)
  const producto = await productosApi.getAll(req.body.id)
  carrito.productos.push(producto)
  await carritoApi.putItem(carrito, req.params.id)
  res.end()
})

routerCarrito.delete('/:id/productos/:idProd', async (req,res)=>{  
  const carrito = await carritoApi.getAll(req.params.id)
  const index = carrito.productos.findIndex(p=> p.id ==req.params.id)
  if(index != -1){
    carrito.productos.splice(index,1)
    await carritoApi.putItem(carrito, req.params.id)
  }  
  res.end()
})



const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listen in PORT ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error server ${error}`));
