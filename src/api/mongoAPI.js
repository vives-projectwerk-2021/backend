const {MongoClient} = require ('mongodb');
CryptoJS=require('crypto-js')

require('dotenv').config()
let client;

class MongoAPI{
    
    constructor(){
        this.url =`${process.env.MONGO_API_CONNECTION_TOKEN}`;
        this.dbName= `${process.env.MONGO_DATABASE}`;
        this.users=`${process.env.MONGO_USERSCOLLECTION}`;
        this.devices=`${process.env.MONGO_DEVICESCOLLECTION}`;
        this.client= "";
        this.mongoUsers="";
        this.mongoDevices="";
        
        
    }
    async connector(){
        try{
            this.client= new MongoClient(this.url);
            this.mongoUsers=this.client.db(this.dbName).collection(this.users);
            this.mongoDevices=this.client.db(this.dbName).collection(this.devices);
            console.log('connecting to database: '+ this.dbName );
            return this.client.connect();
        }catch(error){
            console.log(error)
        }
       
        
           
    }

    //ACCOUNTS

    async findAllUsers(){
       
        await this.connector()
        return this.mongoUsers.find({}).toArray()
       
        
    }

    async findUserByName(username,password){
        
        await this.connector()
        return  this.mongoUsers.findOne({$and:[{username:username},{password:password}]});

    }

    async createUser(username,password){
        
        await this.connector()
        const lol = await this.mongoUsers.findOne({username:username});
        
        if(lol){
            return Promise.resolve("Already exists")
        }else{
            return this.mongoUsers.insertOne({username:username,password:password})  
        }
        
    }

    async changePassword(username,password,newPassword){
        
        await this.connector()
        return this.mongoUsers.updateOne({$and:[{username:username},{password:password}]},{$set: {password:newPassword}})
        
    }

    async deleteUser(username,password){
        
        await this.connector()
        return this.mongoUsers.deleteOne({$and:[{username:username},{password:password}]})
        
    }


    //DEVICES

    async showAllDevices(){
        
        await this.connector()
    
        return this.mongoDevices.find({}).toArray()
       

        
    }

    async createDevice(name,location){
        
        await this.connector()
        return this.mongoDevices.insertOne({name:name,location:location})
       
    }


  
    
        
       

    
}

module.exports = MongoAPI