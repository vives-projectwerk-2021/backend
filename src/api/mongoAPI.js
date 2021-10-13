const {MongoClient} = require ('mongodb');
CryptoJS=require('crypto-js')

let client;

class MongoAPI{
    
    constructor(){
        this.url ="mongodb+srv://AaronVanV:M0ng0dAar0n@aaronvanv.ocujk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        this.dbName= "Project"
        this.collection="accounts"
        this.client= new MongoClient(this.url)
        this.mongo=this.client.db(this.dbName).collection(this.collection)
        
    }
    async connector(){
        console.log('connecting to database: '+ this.dbName );
        return this.client.connect()
        
           
    }

    async findAllUsers(){

        await this.connector()
        return this.mongo.find({}).toArray()
    }

    async findUserByName(username,password){

        await this.connector()
        return  this.mongo.findOne({$and:[{username:username},{password:password}]});
    }

    async createUser(username,password){
        await this.connector()
        const lol = await this.mongo.findOne({username:username});
        console.log(lol)
        if(lol){
            return Promise.resolve("Already exists")
        }else{
            return this.mongo.insertOne({username:username,password:password})  
        }
    }

    async changePassword(username,password,newPassword){
        
        await this.connector()
        return this.mongo.updateOne({$and:[{username:username},{password:password}]},{$set: {password:newPassword}})
            
    }

    async deleteUser(username,password){
        await this.connector()
        return this.mongo.deleteOne({$and:[{username:username},{password:password}]})
    }

  
    
        
       

    
}

module.exports = MongoAPI