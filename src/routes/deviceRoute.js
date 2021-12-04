import users_db from "../databases/users_db.js"
import { AddSensorChecker } from "../validation/AddSensorChecker.js"
import { validate } from "jsonschema";
import values_db from "../databases/values_db.js";

// Mongo
let api = new users_db();
let api2 = new values_db();

const DeviceRoute = {
    list: (req, res, next) => {
        api.showAllDevices().then(result => res.status(201).send(result));
    },
    get: (req, res, next) => {
        // Host ID
        const id = req.params.id

        // Mapper with default values
        let mapper = {
            default:{start: '-1h', per: '15s'},
            hour:{start: '-1h', per: '15s'},
            day: { start: '-1d', per: '5m' },
            week:{start: '-7d', per: '30m'},
            month: {start:'-1mo', per: '2h'},
            year:{start: '-1y', per: '1d'},
    
        }

        // Assinging the standard time
        let defaultTime = mapper[req.query.start]
        if(req.query.start==null){
            defaultTime = mapper["default"]
        }


        send()
        async function getInfo(){
           let info = await api.getDeviceByID(id)
            return info
        }

        async function getValues() {
            let values = await api2.readData(id,defaultTime)
                console.log("Length array: "+values.length)
                return values
        }

        async function send(){
            let info = await getInfo()
            let value = await getValues()

            let sendsensor = {
                info,
                value
            }
            //console.log(sendsenor)        Too much logging
            res.status(200).send(sendsensor)
        }
    },
    post: (req, res, next) => {
        const data = req.body
        console.log(data)
        const validation = validate(data, AddSensorChecker.create)
        if (!validation.valid) {
            res.status(400).send({
                message: 'JSON validation failed',
                details: validation.errors.map(e => e.stack)
            })
            return;
        }
        api.createDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname)
            .then(result => res.status(201).json(result))
            .catch(() => {
                res.status(500).send({
                    message: "Failed to write to JSON db",
                    code: 105
                })
            })
    },
    delete: (req, res, next) => {
        const data = req.params.id
        api.deleteDevice(data)
            .then(result => res.status(201).json(result)) // TODO change status
    },
    put: (req, res, next) => {
        const data = req.body;
        api.putDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname)
            .then(result => res.status(201).json(result)) // TODO change status
    }

}

export default DeviceRoute;