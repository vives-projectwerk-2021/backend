import users_db from "../databases/users_db.js"
import { AddSensorChecker } from "../validation/AddSensorChecker.js"
import { paramsCecker } from "../validation/paramsCecker.js";
import { validate } from "jsonschema";
import values_db from "../databases/values_db.js";
import { ErrorResponse } from "../middleware/error-handler.js"

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

        // Validation
        const validation = validate(req.params, paramsCecker.create)
        if (!validation.valid) {
            console.log("The JSON validator gave an error: ", validation.errors)
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err);
            return;
        }

        // Mapper with default values
        let mapper={
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
        async function getInfo() {
            let info = await api.getDeviceByID(id)
            return info
        }

        async function getValues() {
            let values = await api2.readData(id,defaultTime)
                console.log("Length array: "+values.length)
                return values
        }

        async function send() {
            let info = await getInfo()
            let value = await getValues()

            let sendsensor={}
            if(info==null){
                sendsensor = {
                    info,
                    value
                }
                
            }else{
                sendsensor = {
                    "id":info.deviceid,
                    "name":info.devicename,
                    "location":info.location,
                    value
                }
                
            }

            //console.log(sendsenor)        Too much  logging
            res.status(200).send(sendsensor)
            
        }
    },
    post: (req, res, next) => {
        const data = req.body
        const validation = validate(data, AddSensorChecker.create)
        if (!validation.valid) {
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err);
            return;
        }
        api.createDevice(data.deviceid, data.devicename, data.location)
            .then(result => res.status(201).json(result))
            .catch(() => {
                const err = new ErrorResponse(500, 'Failed to write to db');
			    next(err);
            })
    },
    delete: (req, res, next) => {
        const validation = validate(req.params, paramsCecker.create)
        if (!validation.valid) {
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err)
            return;
        }
        const id = req.params.id
        api.deleteDevice(id)
            .then((result) => {
                if (result.deletedCount < 1) {
                    // nothing deleted so sensor not found
                    const err = new ErrorResponse(404, 'Sensor not found');
                    next(err)
                } else {
                    res.status(204).json();
                }
            })
    },
    put: (req, res, next) => {
        const data = req.body;
        const validation = validate(data, AddSensorChecker.create)
        if (!validation.valid) {
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err);
            return;
        }
        api.putDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname)
            .then(result => res.status(201).json(result)) // TODO change status
    }

}

export default DeviceRoute;