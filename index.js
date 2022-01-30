const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

let rooms = [];
let id = 0;

app.get('/', (req, res) => {
    res.status(200).json({message: "Ok"});
})

/*
    Create a room with a POST request
    Example : Send a POST request with JSON date 
    {
        "numberOfSeats": 100,
        "amenities": ["4 AC", "104 Inch TV"],
        "price": 1000
    }
    Later some more properties are created for booking the hall and an ID.
*/
app.post('/create-room', (req, res) => {
    id = id + 1;
    let temp = {
        roomId: id,
        numberOfSeats: req.body.numberOfSeats,
        amenities: req.body.amenities,
        price: req.body.price,
        customerName: "",
        date: "",
        startTime: 0,
        endTime: 0,
        isBooked: false
    }
    rooms.push(temp);
    res.status(200).json({ message: `Room created with ID - ${id}`, room: temp });
})


function getRoomIndex(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId == id) {
            return i;
        }
    }
    return false;
}

/*
    Book a room with POST request
    Example: 
    {
        "roomId": 1,
        "customerName": "Sanjay",
        "date": "30-1-2022",
        "startTime": 15,
        "endTime": 20
    }
*/
app.post('/book-room', (req, res) => {
    let requestData = req.body;
    let roomIndex = getRoomIndex(requestData.roomId);
    if (roomIndex !== false) {
        if (rooms[roomIndex].date !== requestData.date || parseInt(rooms[roomIndex].endTime) <= parseInt(requestData.startTime)) {
            rooms[roomIndex].customerName = requestData.customerName;
            rooms[roomIndex].date = requestData.date;
            rooms[roomIndex].startTime = requestData.startTime;
            rooms[roomIndex].endTime = requestData.endTime;
            rooms[roomIndex].isBooked = true;
            res.json(rooms[roomIndex]);
        }
        else {
            res.status(404).json({ message: "This room is booked!" });
        }
    }
    else {
        res.status(404).json({ message: "Invalid Room ID!" });
    }
})


/*
    List all rooms with booked data with
    Get all the booked rooms
*/
app.get('/booked-rooms', (req, res) => {
    if (rooms.length > 0) {
        let bookedRooms = [];
        for (let i=0; i<rooms.length; i++) {
            if (rooms[i].isBooked) {
                let temp = {
                    roomName: "Room " + rooms[i].roomId,
                    bookedStatus: "Booked",
                    customerName: rooms[i].customerName,
                    date: rooms[i].date,
                    startTime: rooms[i].startTime,
                    endTime: rooms[i].endTime
                }
                bookedRooms.push(temp);
            }
        }
        if (bookedRooms.length > 0) {
            res.status(200).json(bookedRooms);
        }
        else {
            res.status(200).json({message: "No rooms are booked!"});
        }
    }
    else {
        res.status(200).json({message: "No rooms are created!"})
    }
})


/*
    List all customers with booked data with
    Get all the booked rooms
*/
app.get('/customer-booked-rooms', (req, res) => {
    if (rooms.length > 0) {
        let bookedRooms = [];
        for (let i=0; i<rooms.length; i++) {
            if (rooms[i].isBooked) {
                let temp = {
                    customerName: rooms[i].customerName,
                    roomName: "Room " + rooms[i].roomId,
                    date: rooms[i].date,
                    startTime: rooms[i].startTime,
                    endTime: rooms[i].endTime
                }
                bookedRooms.push(temp);
            }
        }
        if (bookedRooms.length > 0) {
            res.status(200).json(bookedRooms);
        }
        else {
            res.status(200).json({message: "No customer have booked a room!"});
        }
    }
    else {
        res.status(200).json({message: "There are no rooms!"})
    }
})


app.listen(3000);
console.log("Server listening on PORT 3000");