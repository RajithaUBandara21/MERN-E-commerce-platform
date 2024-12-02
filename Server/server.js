const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

mongoose
.connect("mongodb+srv://123:123@cluster0.nw8ab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {console.log('Connected to MongoDB')})
.catch((err) => {console.log('Failed to connect to MongoDB', err)});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({

        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"], 
        allowedHeaders: ["Content-Type", "Authorization" , "cache-control", "Expires", "Pragma", "Origin", "Accept", "Accept-Encoding", "Accept-Language", "Host", "Referer", "User-Agent"],
        credentials: true
    })


)

app.use(cookieParser());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});