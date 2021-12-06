const SensorValidation = {
    create: {
        "type": "object",
        "properties": {
            "deviceid": {
                "type": "string",
                "pattern": "^[\\d,a-f]{24}$"
            },
            "devicename": { "type": "string" },
            "location": {
                "type": "object",
                "properties": {
                    "lat": {
                        "type": "string",
                        "pattern": "^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,7})?))$"
                    },
                    "long": {
                        "type": "string",
                        "pattern": "^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,7})?))$"
                    }
                },
                "required": ["lat", "long"],
                "additionalProperties": false
            },

        },
        "required": ["deviceid", "devicename", "location"],
        "additionalProperties": false
    }
    //first and last name are at the moment given with the addsensor but should not be necessery later when you have to loging to add sensors
}

export { SensorValidation }