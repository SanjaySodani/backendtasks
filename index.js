const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res)=>{
    res.json({message: "ok"});
});

// Students route
const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

// Mentors route
const mentorsRouter = require('./routes/mentors');
app.use('/mentors', mentorsRouter);

app.listen(process.env.PORT || 3000);
console.log("Server is running on PORT 3000");