const ShopkeeperModel = require('../models/shopkeeper-model')

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
}

module.exports = new UserService()