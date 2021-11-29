import users_db from "../databases/users_db.js"
import { AddSensorChecker } from "../validation/AddSensorChecker.js"
import { paramsCecker } from "../validation/paramsCecker.js";
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
        const id = req.params.id
        if (!id.length === 24) {
            res.status(400).send({
                message: 'Validation failed, id length is not exactly 24 characters or is not a number',
            })
            return;
        }
        const validation = validate(parseInt(id), paramsCecker.get)
        if (!validation.valid) {
            console.log("The JSON validator gave an error: ", validation.errors)
            res.status(400).send({
                message: 'JSON validation failed',
                details: validation.errors.map(e => e.stack)
            });
            return;
        }

        send()
        async function getInfo() {
            let info = await api.getDeviceByID(id)
            return info
        }

        async function getValues() {
            let values = await api2.readData(id)
            return values
        }

        async function send() {
            let info = await getInfo()
            let value = await getValues()

            let sendsenor = {
                info,
                value
            }
            //console.log(sendsenor)        Too much logging
            res.status(200).send(sendsenor)
        }
    },
    post: (req, res, next) => {
        const data = req.body
        if (!data.length === 24) {
            res.status(400).send({
                message: 'Validation failed, id length is not exactly 24 characters or is not a number',
            })
            return;
        }
        const validation = validate(data, AddSensorChecker.create)
        console.log("The JSON validator gave an error: ", validation.errors)
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
        const validation = validate(parseInt(data), paramsCecker.delete)
        if (!validation.valid) {
            console.log("The JSON validator gave an error: ", validation.errors)
            res.status(400).send({
                message: 'JSON validation failed',
                details: validation.errors.map(e => e.stack)
            })
            return;
        }
        api.deleteDevice(data)
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

export default DeviceRoute;