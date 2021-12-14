import config from "../config/config.js"
import { MongoClient } from "mongodb";
import {mongo_write, mongo_read} from "../routes/metricRoute.js";
import axios from "axios"

//import CryptoJS from "crypto-js";


let client;

class users_db{

    constructor(){
        this.url =`${config.users_db.token}`;
        this.dbName= `${config.users_db.db}`;
        this.users=`${config.users_db.ucoll}`;
        this.devices=`${config.users_db.dcoll}`;
        this.members=`${config.users_db.mcoll}`;
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
            this.mongoMembers=this.client.db(this.dbName).collection(this.members);
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
        mongo_read.inc();
        return this.mongoUsers.find({}).toArray()
    }

    async findUserByName(username,password){
        this.ConnectionChecker()
        mongo_read.inc();
        return  this.mongoUsers.findOne({$and:[{username:username},{password:password}]});
    }

    async createUser(username,password){
        this.ConnectionChecker()
        mongo_write.inc();
        const lol = await this.mongoUsers.findOne({username:username});
        
        if(lol){
            return Promise.resolve("Already exists")
        }else{
            return this.mongoUsers.insertOne({username:username,password:password})  
        }
    }

    async changePassword(username,password,newPassword){
        this.ConnectionChecker()
        mongo_write.inc();
        return this.mongoUsers.updateOne({$and:[{username:username},{password:password}]},{$set: {password:newPassword}})
    }

    async deleteUser(username,password){
        this.ConnectionChecker()
        mongo_write.inc();
        return this.mongoUsers.deleteOne({$and:[{username:username},{password:password}]})
    }


    //DEVICES
    async getDeviceByID(deviceid){
        this.ConnectionChecker()
        mongo_read.inc();
        return this.mongoDevices.findOne({deviceid:deviceid})
    }

    async showAllDevices(){
        this.ConnectionChecker()
        mongo_read.inc();
        return this.mongoDevices.find({}).toArray()
    }

    async createDevice(deviceid, devicename, location){
        this.ConnectionChecker()
        mongo_write.inc();
        return this.mongoDevices.insertOne({ deviceid: deviceid, devicename: devicename, location: location })
    }

    async deleteDevice(deviceid){
        this.ConnectionChecker()
        mongo_write.inc();
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



    //Members

    

    async getMembers(){
        this.ConnectionChecker()
        mongo_read.inc();
        let members=await this.mongoMembers.find({}).toArray()

        
        
        if(members[0]==null){
            console.log(Date.now()+": getting members")
            let people = await axios.get("https://api.github.com/orgs/vives-projectwerk-2021/members",{headers:{Authorization: `Bearer ${config.users_db.githubtoken}`}})
            let amount=people.data.length
            mongo_write.inc();
            this.mongoMembers.insertOne({time:Date.now(),members:amount})

            return amount
        }else{
            if(Date.now()-members[0].time>=60*60*1000){
                console.log(Date.now()+": updating members")
                let people= await axios.get("https://api.github.com/orgs/vives-projectwerk-2021/members")
                let amount=people.data.length
                mongo_write.inc();
                this.mongoMembers.updateOne({_id:members[0]._id},{$set:{time:Date.now(),members:amount}})

                return amount
                
            }else{
                console.log(Date.now()+": returning members")

                return members[0].members
            }
        }



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