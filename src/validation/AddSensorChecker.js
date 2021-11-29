const AddSensorChecker = {

    create: {
        "type": "object",
        "properties": {
            "deviceid": { "type": "string" },
            "devicename": { "type": "string" },
            "location": { "type": "string" },
            "firstname": { "type": "string" },
            "lastname": { "type": "string" }
        },
        "required": ["devicename", "location", "firstname", "lastname"],
        "additionalProperties": false
        //first and last name are at the moment given with the addsensor but should not be necessery later when you have to loging to add sensors
    },
    update: {
        "type": "object",
        "properties": {
            "devicename": { "type": "string" },
            "location": { "type": "string" },
            "firstname": { "type": "string" },
            "lastname": { "type": "string" }
        },
        "additionalProperties": false
    }
}

export { AddSensorChecker }