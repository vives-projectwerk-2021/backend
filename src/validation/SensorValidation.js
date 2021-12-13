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
                    },
                    "place_name": { "type": "string" }
                },
                "required": ["lat", "long", "place_name"],
                "additionalProperties": false
            },

        },
        "required": ["deviceid", "devicename", "location"],
        "additionalProperties": false
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
                    },
                    "place_name": { "type": "string" }
                },
                "required": ["lat", "long", "place_name"],
                "additionalProperties": false
            },

        },
        "required": ["devicename", "location"],
        "additionalProperties": false
    }
}

export { SensorValidation }