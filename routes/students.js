const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { dbUrl, MongoClient } = require('../dbConfig');
const { ObjectId } = require('mongodb');

router.use(bodyParser.json());

/*
    Get all the students
*/
router.get('/', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let document = await db.collection('students').find().toArray();
        
        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});


/*
    Create a student by passing a name 
    Post : /create-student 
*/
router.post('/create-student', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let document = await db.collection('students').insertOne(req.body);

        res.json(document);
    } catch (error) {
        console.log(error);
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});


/*
    Assign a mentor or update a mentor
    Example: /students/assign-mentor
    {
        "id": "61fd5c6310417b919fb41253",
        "mentor": "61fd5c6f10417b919fb41255"
    }
*/
router.put('/assign-mentor', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let currStudent = await db.collection('students').find({_id: ObjectId(req.body.id)}).toArray();
        let mentorExists = await db.collection('mentors').find({_id: ObjectId(req.body.mentor)}).toArray();
        let document;
        if (currStudent.length > 0 && mentorExists.length > 0){
            document = await db.collection('students').findOneAndUpdate(
                {_id: ObjectId(req.body.id)}, {$set: {mentor: req.body.mentor}}
            );
            if (currStudent[0].mentor) {
                // There is assigned Mentor, needs to be updated
                let mentor = await db.collection('mentors').find({_id: ObjectId(currStudent[0].mentor)}).toArray();
                mentor = mentor[0];
                let studentList = mentor.students;
                studentList.splice(studentList.indexOf(req.body.id), 1);
                await db.collection('mentors').findOneAndUpdate(
                    {_id: ObjectId(currStudent[0].mentor)}, {$set: {students: studentList}}
                ); 

                mentor = await db.collection('mentors').find({_id: ObjectId(req.body.mentor)}).toArray();
                mentor = mentor[0];
                studentList = mentor.students;
                studentList.push(req.body.id);
                await db.collection('mentors').findOneAndUpdate(
                    {_id: ObjectId(req.body.mentor)}, {$set: {students: studentList}}
                );
            }
            else {
                // Mentor getting assigned for first time
                let mentor = await db.collection('mentors').find({_id: ObjectId(req.body.mentor)}).toArray();
                mentor = mentor[0];
                let studentList = mentor.students;
                studentList.push(req.body.id);
                await db.collection('mentors').findOneAndUpdate(
                    {_id: ObjectId(req.body.mentor)}, {$set: {students: studentList}}
                );
            }
        }
        else if (currStudent.length < 1) {
            res.json({message: "Invalid student ID"});
        }
        else if (mentorExists.length < 1) {
            res.json({message: "Invalid mentor ID"});
        }

        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});


/*
    Get all the students for a mentor
    Example: /students/mentor/{mentorID}
*/
router.get('/mentor/:mentorId', async (req, res)=>{
    let client = await MongoClient.connect(dbUrl);
    try{
        let db = await client.db('guvi');
        let document = await db.collection('students').find({mentor: req.params.mentorId}).toArray();

        res.json(document);
    } catch (error) {
        res.json({message: 'Internal server error'});
    } finally {
        client.close();
    }
});

module.exports = router;