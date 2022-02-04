const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbUrl = "mongodb+srv://Sanjay:admin321@sanjaycluster.zurat.mongodb.net/test";

module.exports = {MongoClient, dbUrl};