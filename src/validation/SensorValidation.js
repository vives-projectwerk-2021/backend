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
        "required": ["deviceid", "devicename", "location"],
        "additionalProperties": false
    }
    //first and last name are at the moment given with the addsensor but should not be necessery later when you have to loging to add sensors
}

export { SensorValidation }