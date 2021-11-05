# Local hosting a MongoDB

This is for the development of the backend to test functionality without editing the database where the actual data is in.

## Download mongosh

[Download mongosh link](https://www.mongodb.com/try/download/shell?jmp=docs)

[Mongosh install website](https://docs.mongodb.com/mongodb-shell/install/#std-label-mdb-shell-install)

## Starting mongosh

Start a cmd or powershell window and type "mongosh" to start the shell.

```cmd
mongosh
```

You will see "Connecting to:  mongodb:xxxxx", copy that, that is the uri to connect with your local MongoDB.

## Create the DB

To create the database, type "use" and then the NAME of the DB, check in the .env file to have the right name, otherwise it won't work.

```cmd
use NAME
```

## Create the collections

To create the collections, you need to insert some data to it, you can delete that later. Again check the .env file for the right names (change COLLECTION to right name). Do this for every collection you need.

```cmd
db.COLLECTION.insertOne({data:"test"})
```

## Connect to local MongoDB

Mongosh is a service that always runs, you can stop it in "Services" on your pc.

To connect you just enter the uri you copied in the .env and if you did everything right (SPELLING!), it should work.
