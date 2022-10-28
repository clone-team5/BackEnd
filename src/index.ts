import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("db연결 성공!")

}).catch(error => console.log(error))


module.exports = AppDataSource;