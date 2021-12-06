const AddSensorChecker = {

    create: {
        "type": "object",
        "properties": {
            "deviceid": { "type": "string" },
            "devicename": { "type": "string" },
            "location": { "type": "string" }
        },
        "required": ["deviceid", "devicename", "location"],
        "additionalProperties": false
        //first and last name are at the moment given with the addsensor but should not be necessery later when you have to loging to add sensors
    },
    update: {
        "type": "object",
        "properties": {
            "devicename": { "type": "string" },
            "location": {
                "type": "object",
                "properties": {
                    "lat": {
                        "type": "number",
                        "minimum": -90,
                        "maximum": 90
                    },
                    "long": {
                        "type": "number",
                        "minimum": -180,
                        "maximum": 180
                    }
                },
                "required": ["lat", "long"],
                "additionalProperties": false
            },

        },
        "required": ["devicename", "location"],
        "additionalProperties": false
    }
}

export { AddSensorChecker }