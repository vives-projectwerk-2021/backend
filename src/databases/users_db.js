import config from "../config/config.js"
import { MongoClient } from "mongodb";
//import CryptoJS from "crypto-js";


let client;

class users_db{
    
    constructor(){
        this.url =`${config.users_db.token}`;
        this.dbName= `${config.users_db.db}`;
        this.users=`${config.users_db.ucoll}`;
        this.devices=`${config.users_db.dcoll}`;
        this.client= "";
        this.mongoUsers="";
        this.mongoDevices="";
        
        
    }
    async connector(){
        try{
            this.client= new MongoClient(this.url);
            this.mongoUsers=this.client.db(this.dbName).collection(this.users);
            this.mongoDevices=this.client.db(this.dbName).collection(this.devices);
            console.log(Date.now()+': connecting to database: '+ this.dbName );
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

    async getDeviceByID(deviceid){
        await this.connector()

        return this.mongoDevices.findOne({deviceid:deviceid})
    }

    async showAllDevices(){
        
        await this.connector()
    
        return this.mongoDevices.find({}).toArray()
       

        
    }

    async createDevice(deviceid,devicename,location,firstname,lastname){
        
        await this.connector()

        const checker = await this.mongoDevices.findOne({deviceid:deviceid});
        
        if(checker){
            return Promise.resolve("Already exists")
        }else{
            return this.mongoDevices.insertOne({deviceid:deviceid,devicename:devicename,location:location,firstname:firstname,lastname:lastname})
 
        }
       
    }

    async deleteDevice(deviceid){
        await this.connector()

        return this.mongoDevices.deleteOne({deviceid:deviceid})
    }

    async putDevice(deviceid,devicename,location,firstname,lastname){
        await this.connector()

        return this.mongoDevices.updateOne({deviceid:deviceid},{$set: {devicename:devicename,location:location,firstname:firstname,lastname:lastname}})
    }

    async closeConnection(){
        console.log(Date.now()+" : CLOSING CONNECTION")
        return this.client.close()
    }


  
    
        
       

    
}

export default users_db;