const paramsCecker = {

    create: {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "pattern": "^[\\d,a-f]{24}$"
            }
        },
        "required": ["id"],
        "additionalProperties": false
        //first and last name are at the moment given with the addsensor but should not be necessery later when you have to loging to add sensors
    }
}
export { paramsCecker }