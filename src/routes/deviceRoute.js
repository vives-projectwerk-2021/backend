import users_db from "../databases/users_db.js"
import { SensorValidation } from "../validation/SensorValidation.js"
import { paramsCecker } from "../validation/paramsCecker.js";
import { validate } from "jsonschema";
import values_db from "../databases/values_db.js";
import { ErrorResponse } from "../middleware/error-handler.js"

// Mongo
let api = new users_db();
let api2 = new values_db();

const DeviceRoute = {
    list: (req, res, next) => {
        api.showAllDevices()
            .then(result => {
                res.send(result.map(d => d.deviceid))
            })
            .catch((err) => {
                console.log(err)
                res.status(404).send(err)
            });
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
        let mapper = {
            default: { start: '-1h', per: '15s' },
            hour: { start: '-1h', per: '15s' },
            day: { start: '-1d', per: '5m' },
            week: { start: '-7d', per: '30m' },
            month: { start: '-1mo', per: '2h' },
            year: { start: '-1y', per: '1d' },
        }

        // Assinging the standard time
        let defaultTime = mapper[req.query.start]
        if (req.query.start == null) {
            defaultTime = mapper["default"]
        }

        send()
        async function getInfo() {
            let info = await api.getDeviceByID(id)
            return info
        }

        async function getValues() {
            let values = await api2.readData(id,defaultTime)
                //console.log("Length array: "+ values.length)
                return values
        }

        async function send() {
            let info = await getInfo()
            let values = await getValues()

            let sendsensor={}
            if(info==null){
                sendsensor = {
                    info,
                    values
                }
                
            }else{
                sendsensor = {
                    "id":info.deviceid,
                    "name":info.devicename,
                    "location":info.location,
                    values
                }
                
            }

            //console.log(sendsenor)        Too much  logging
            res.status(200).send(sendsensor)
            
        }
    },
    post: (req, res, next) => {

        // validation of request body
        const validation = validate(req.body, SensorValidation.create)
        if (!validation.valid) {
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err);
            return;
        }

        const new_device = req.body;
        // Check if deviceID already exists
        api.getDeviceByID(new_device.deviceid)
            .then((device) => {
                if (device) {
                    // Duplicate deviceID
                    const err = new ErrorResponse(400, "deviceID already in use");
                    next(err);
                    return;
                }
                // deviceID is unique so create new device
                api.createDevice(new_device.deviceid, new_device.devicename, new_device.location)
                    .then(() =>{
                        res.status(201).json(new_device);
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
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
        const id = req.params.id;
        const device = req.body;

        // validate body
        const validation = validate(device, SensorValidation.update)
        if (!validation.valid) {
            const err = new ErrorResponse(400, 'JSON validation failed', validation.errors.map(e => e.stack));
            next(err);
            return;
        }

        // update device with id in mongo
        api.putDevice(id, device)
            .then(result => {
                if (result.matchedCount < 1) {
                    // no documents matched
                    const err = new ErrorResponse(404, "Sensor not found.");
                    next(err);
                } else {
                    res.status(204).send()
                }
            })
            .catch(err => console.log(err))
    }

}

export default DeviceRoute;