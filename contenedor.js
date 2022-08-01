const fs = require("fs");


class Contenedor {
  constructor(ruta) {
    this.ruta = ruta;
    
  }
  
  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.ruta, "utf-8");
      let productos = JSON.parse(contenido);
      return productos;
    } catch (error) {
      console.log(error);
    }
  }
  async getById(id) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let productos = JSON.parse(data);     
      let item = productos.find(item =>item.id==id)
      if(item){
        return item
      }else{
        console.log('El producto no existe')
      }
      
    } catch (error) {
      console.log(`Error al leer el archivo: ${error}`);
    }
  }

  async addItem(item){
    const objs = await this.getAll()
    const date= Date.now()
    let newId
    if(objs.length==0){
      newId=1
    }else{
      newId= objs[objs.length-1].id+1
    }
    const newObj= {...item, id:newId, timestamp:date}
    objs.push(newObj)
    try {     
      await fs.promises.writeFile(
        this.ruta, JSON.stringify(objs,null, 2)        
      );
      return newObj

    } catch (error) {
      console.log(`Error al leer el archivo: ${error}`);
    }
  }


  async putItem(newItem, id){
    
            
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      const productos = JSON.parse(data);                 
      let index = productos.findIndex(item =>item.id==id)           
      newItem.id=id
      productos[index]=newItem
      await fs.promises.writeFile(
        this.ruta, JSON.stringify(productos, null,2 )       
      );
      
      return productos
      
    } catch (error) {
      console.log(`Error al leer el archivo: ${error}`);
    }
  }

  async deleteById(id) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let productos = JSON.parse(data);
        const newProducto = productos.filter(producto => producto.id !== id);        
        await fs.promises.writeFile(this.ruta, JSON.stringify(newProducto,null, 2)); 
           
    } catch (error) {
      console.log(`Error al leer el archivo: ${error}`);
    }
  }

  async deleteItem(newItem, id){
    console.log(newItem)
    console.log(id)
            
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      const productos = JSON.parse(data);                 
      let index = productos.findIndex(item =>item.id==id)           
      newItem.id=id
      productos[index]=newItem
      await fs.promises.writeFile(
        this.ruta, JSON.stringify(productos, null,2 )       
      );
      
      return productos
      
    } catch (error) {
      console.log(`Error al leer el archivo: ${error}`);
    }
  }
  
}
module.exports = { Contenedor };
