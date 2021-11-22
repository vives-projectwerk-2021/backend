import users_db from "../databases/users_db.js"
import { AddSensorChecker } from "../validation/AddSensorChecker.js"
import { validate } from "jsonschema";

// Mongo
let api = new users_db();

const DeviceRoute = {
    list: (req, res, next) => {
        api.showAllDevices().then(result => res.status(201).send(result));
    },
    get: (req, res, next) => {
        const id = req.params.id
        api.getDeviceByID(id)
            .then(result => res.status(201).send(result))
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
        const data = req.body
        api.deleteDevice(data.deviceid)
            .then(result => res.status(201).json(result)) // TODO change status
    },
    put: (req, res, next) => {
        const data = req.body;
        const validation = validate(data, AddSensorChecker.create)
        if (!validation.valid) {
            res.status(400).send({
                message: 'JSON validation failed',
                details: validation.errors.map(e => e.stack)
            })
            return;
        }
        api.putDevice(data.deviceid, data.devicename, data.location, data.firstname, data.lastname)
            .then(result => res.status(201).json(result)) // TODO change status
    }

}

function validate(data,schema){

}

export default DeviceRoute;