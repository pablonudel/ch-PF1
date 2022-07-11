import * as fs from 'fs'

class Contenedor{
    constructor (file){
        this.file = file
    }

    async getAll(){
        try{
           const file = await fs.promises.readFile(this.file, 'utf-8')
           const fileConverted = JSON.parse(file)
           return fileConverted
        }catch (error){
            const array = []
            await fs.promises.writeFile(this.file, JSON.stringify(array))
            return array
        }
    }

    async save(obj){
        try{
            const array = await this.getAll()
            const newId = array.length === 0 ? 1 : array[array.length - 1].id + 1
            obj.id = newId
            array.push(obj)
            await fs.promises.writeFile(this.file, JSON.stringify(array, null, 3))
            return array
        }catch(error){
            console.log(error);
        }
    }
    
    async getById(id){
        try{
            const array = await this.getAll()
            const obj = array.find(o => o.id === id)
            return obj
        }catch (error){
            console.log(error);
        }
    }

    async updateById(id, obj){
        try {
            const array = await this.getAll()
            let objIndex = array.indexOf(array.find(o => o.id === id))
            array[objIndex] = obj
            obj.timestamp = array[objIndex].timestamp
            obj.id = id
            await fs.promises.writeFile(this.file, JSON.stringify(array, null, 3))
            return array
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            const array = await this.getAll()
            const newArray = array.filter(p => p.id != id)
            await fs.promises.writeFile(this.file, JSON.stringify(newArray, null, 3))
            return newArray
        } catch (error) {
            console.log(error)
        }
    }
}

export default Contenedor