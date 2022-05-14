const ShopkeeperModel = require('../models/shopkeeper-model')
const UserModel = require('../models/user-modal')

class UserService {
    async findUser(filter) {
        const user = await ShopkeeperModel.findOne(filter)
        return user
    }

    async getAllUsers() {
        try {
            const users = await ShopkeeperModel.find()
            return users
        } catch (err) {
            return err
        }
    }

    async createUser(data) {
        const user = await ShopkeeperModel.create(data)
        return user
    }

    async findEndUser(filter) {
        const user = await UserModel.findOne(filter)
        return user
    }

    async createEndUser(data) {
        const user = await UserModel.create(data)
        return user
    }
}

module.exports = new UserService()