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
            console.log('connecting to database: '+ this.dbName );
            return this.client.connect();
        }catch(error){
            console.log(error)
        }
       
        
           
    }

    //ACCOUNTS

    async findAllUsers(){
        try {
            await this.connector()
            return this.mongoUsers.find({}).toArray()
        } catch (error) {
            return Promise.reject("Error: "+error)
        }
        
    }

    async findUserByName(username,password){
        try{
            await this.connector()
            return  this.mongoUsers.findOne({$and:[{username:username},{password:password}]});
        } catch (error) {
            return Promise.reject("Error: "+error)
        }
    }

    async createUser(username,password){
        try{
            await this.connector()
            const lol = await this.mongoUsers.findOne({username:username});
            
            if(lol){
                return Promise.resolve("Already exists")
            }else{
                return this.mongoUsers.insertOne({username:username,password:password})  
            }
        } catch (error) {
            return Promise.reject("Error: "+error)
        }
    }

    async changePassword(username,password,newPassword){
        try{
            await this.connector()
            return this.mongoUsers.updateOne({$and:[{username:username},{password:password}]},{$set: {password:newPassword}})
        } catch (error) {
            return Promise.reject("Error: "+error)
        }
    }

    async deleteUser(username,password){
        try{
            await this.connector()
            return this.mongoUsers.deleteOne({$and:[{username:username},{password:password}]})
        } catch (error) {
            return Promise.reject("Error: "+error)
        }
    }


    //DEVICES

    async showAllDevices(){
        try{
            await this.connector()
        
            return this.mongoDevices.find({}).toArray()
        }
        catch (error) {
            return Promise.reject("Error: "+error)
        }

        
    }

    async createDevice(name,location){
        try{
            await this.connector()
            return this.mongoDevices.insertOne({name:name,location:location})
        }catch (error) {
            return Promise.reject("Error: "+error)
        }
    }


  
    
        
       

    
}

export default users_db;