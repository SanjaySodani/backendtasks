const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { dbUrl, MongoClient } = require('../dbConfig');
const { ObjectId } = require('mongodb');

router.use(bodyParser.json());

/* 
    Get all the mentors
*/
router.get('/', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let document = await db.collection('mentors').find().toArray();

        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});


/* 
    Create a mentor by passing a name
    Post : /create-mentor
*/
router.post('/create-mentor', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let body = {
            name: req.body.name,
            students: []
        }
        let document = await db.collection('mentors').insertOne(body);

        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});


/*
    Assign students to a mentor with a list
    Example: 
    {
        "id": "61fd5c6f10417b919fb41255",
        "students": ["61fd5c6310417b919fb41253", "61fd5ceb10417b919fb41256"]
    }
*/
router.put('/assign-students', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let document = await db.collection('mentors').findOneAndUpdate(
            {_id: ObjectId(req.body.id)}, {$set: {students: req.body.students}});
        if (document.value) {
            for (let i=0; i<req.body.students.length; i++) {
                await db.collection('students').findOneAndUpdate(
                    {_id: ObjectId(req.body.students[i])}, {$set: {mentor: req.body.id}}
                )
            }
        }
        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});

module.exports = router;