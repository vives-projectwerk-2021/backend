import users_db from "../databases/users_db.js"

// Mongo
let api = new users_db();

const UserRoute = {
    list: (req, res, next) => {
        api.findAllUsers()
            .then(result => res.status(200).send(result))
    },
    get_amount: (req, res, next) => {
        api.findAllUsers()
            .then(result => res.status(200).send([{ amount: result.length }]))
    },
    login: (req, res, next) => {
        const data = req.body
        api.findUserByName(data.username, data.password)
            .then(result => res.status(201).json(result))
    },
    post: (req, res, next) => {
        const data = req.body

        api.createUser(data.username, data.password).then(result => {
            if (result == "Already exists") {
                res.status(201).json([{ message: result }])
            } else {
                res.status(201).json([{ message: "Success" }])
            }
        })
    },
    delete: (req, res, next) => {
        const data = req.body
        api.deleteUser(data.username, data.password)
            .then(result => res.status(201).json(result))
    }

}

export default UserRoute;