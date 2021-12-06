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
        this.isConnected=false;
        this.connector();
    }
    
    async connector(){
        try{
            this.client= new MongoClient(this.url);
            this.mongoUsers=this.client.db(this.dbName).collection(this.users);
            this.mongoDevices=this.client.db(this.dbName).collection(this.devices);
            console.log(Date.now()+': connecting to database: '+ this.dbName );
            this.client.connect();
            this.isConnected=true;
        } catch(error){
            console.log(Date.now()+" : "+error)
            this.isConnected=false;
        }  
    }

    //ACCOUNTS
    async findAllUsers(){
        this.ConnectionChecker()
        return this.mongoUsers.find({}).toArray()
    }

    async findUserByName(username,password){
        this.ConnectionChecker()
        return  this.mongoUsers.findOne({$and:[{username:username},{password:password}]});
    }

    async createUser(username,password){
        this.ConnectionChecker()
        const lol = await this.mongoUsers.findOne({username:username});
        
        if(lol){
            return Promise.resolve("Already exists")
        }else{
            return this.mongoUsers.insertOne({username:username,password:password})  
        }
    }

    async changePassword(username,password,newPassword){
        this.ConnectionChecker()
        return this.mongoUsers.updateOne({$and:[{username:username},{password:password}]},{$set: {password:newPassword}})
    }

    async deleteUser(username,password){
        this.ConnectionChecker()
        return this.mongoUsers.deleteOne({$and:[{username:username},{password:password}]})
    }


    //DEVICES
    async getDeviceByID(deviceid){
        this.ConnectionChecker()
        return this.mongoDevices.findOne({deviceid:deviceid})
    }

    async showAllDevices(){
        this.ConnectionChecker()
        return this.mongoDevices.find({}).toArray()
    }

    async createDevice(deviceid,devicename,location,firstname,lastname){
        this.ConnectionChecker()
        const checker = await this.mongoDevices.findOne({deviceid:deviceid});
        
        if(checker){
            return Promise.resolve("Already exists")
        }else{
            return this.mongoDevices.insertOne({deviceid:deviceid,devicename:devicename,location:location,firstname:firstname,lastname:lastname})
        }
    }

    async deleteDevice(deviceid){
        this.ConnectionChecker()
        return this.mongoDevices.deleteOne({deviceid:deviceid})
    }

    async putDevice(id, body) {
        this.ConnectionChecker()
        const device = {
            devicename: body.devicename,
            location: body.location
        }
        return this.mongoDevices.updateOne({ deviceid: id }, { $set: device })
    }

    async closeConnection(){
        console.log(Date.now()+" : CLOSING CONNECTION")
        return this.client.close()
    }

    async ConnectionChecker(){

        await this.client.db().admin().listDatabases()
        .then(()=>{
            this.isConnected=true
        })
        .catch((error)=>{
            this.isConnected=false
            console.log( Date.now()+" :Connection with mongo: "+ this.isConnected)
            console.log(Date.now()+" : "+ error)
        })

        if(!this.isConnected){
            console.log( Date.now()+" :Connection with mongo: "+ this.isConnected)
            this.connector()
        }
    }
}

export default users_db;