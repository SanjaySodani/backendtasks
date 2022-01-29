const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', (req, res)=>{
    let date = new Date();
    let timestamp = Date.now().toString();
    console.log(timestamp);
    let filename = './data/' + date.toISOString().substring(0,10) + '-T-' + date.getHours().toString() + 'H' + date.getMinutes().toString() + 'M' + '.txt';
    console.log(filename);
    try{
        fs.writeFileSync(filename, timestamp);
        res.status(200).json({
            fileCreated: date,
            fileData: timestamp
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(200).send("An error occusred!");
    }
})


app.listen(3000);
console.log("Server running on PORT:3000");