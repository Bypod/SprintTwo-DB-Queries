const {MongoClient} = require('mongodb')
const uri = "mongodb+srv://john:ranger16@cluster0.ilmyj.mongodb.net/sprintdb?retryWrites=true&w=majority"


async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ")
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

async function carsByName(client ,word, i){
    await client.connect()

    if(i == 'dealer_loc'){
        const result = await client.db("sprintdb").collection("car_info").find({dealer_loc: word}).sort({car_year: -1})
        const carResults = await result.toArray();

        return carResults
    } else if(i == 'car_year'){
        console.log(word)
        let num = parseInt(word)
        const result = await client.db("sprintdb").collection("car_info").find({car_year: num}).sort({car_km: -1})
        const carResults = await result.toArray();
    
        return carResults
    } if(i == 'car_make'){
        const result = await client.db("sprintdb").collection("car_info").find({car_make: word}).sort({car_year: -1})
        const carResults = await result.toArray();
    
        return carResults
    } if(i == 'car_model'){
        const result = await client.db("sprintdb").collection("car_info").find({car_model: word}).sort({car_year: -1})
        const carResults = await result.toArray();
    
        return carResults
    }

}

async function allCars(client){
    await client.connect()
    const result = await client.db("sprintdb").collection("car_info").find()
    const carResults = await result.toArray();
    
    return carResults
}

module.exports = {
    carsByName,
    allCars,
}