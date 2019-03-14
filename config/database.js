// config/database.js
module.exports = {

    // 'url': 'mongodb://localhost/simrs',
    'url': process.env.DATABASEURL,
    'secret': "jdbvdsvjbsfew7843grbfd" // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};