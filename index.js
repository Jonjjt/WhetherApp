// import bodyParser from 'body-parser';
import mongoose from "mongoose";
import express from "express";
import fetch from 'node-fetch';
import { Decimal128, MongoClient } from "mongodb";

const app = express();
// const jsonParser = bodyParser.json()

// mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {res.send("Hello World");
});

const CONNECTION_URL = `mongodb+srv://admin:admin@cluster0.2p4n1.mongodb.net/WhetherApp?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000;

function callWeatherAPI() {
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=51.51&lon=0.13&exclude=minutely,hourly,daily,alerts&appid=c3a2ab1eb5775866562679aa553ebf47";
    fetch(url)
    .then(res => res.json())
    .then(json => {
        const mydata = new hourlyData({
            'date': json.current.dt,
            'temp': json.current.temp,
            'feels_like': json.current.feels_like,
            'pressure': json.current.pressure,
            'humidity': json.current.humidity,
            'windSpeed': json.current.wind_speed,
            'weather': json.current.weather[0].main,
            'weatherDetail': json.current.weather[0].description
        })
    })
}

function updateDB() {
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=51.51&lon=0.13&exclude=minutely,hourly,daily,alerts&appid=c3a2ab1eb5775866562679aa553ebf47";
    fetch(url)
    .then(res => res.json())
    .then(json => {
        const mydata = new hourlyData({
            'date': json.current.dt,
            'temp': json.current.temp,
            'feels_like': json.current.feels_like,
            'pressure': json.current.pressure,
            'humidity': json.current.humidity,
            'windSpeed': json.current.wind_speed,
            'weather': json.current.weather[0].main,
            'weatherDetail': json.current.weather[0].description
        })
        mydata.save(function(err, result){
            if (err) throw err;
            if(result) {
                console.log(result)
            }
        })
    })
}

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, function (){
        callWeatherAPI();
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((error) => console.log(error.message));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

setInterval(updateDB, 3600000);

const weatherSchema = new mongoose.Schema({
    date: Number,
    temp: Decimal128,
    feels_like: Decimal128,
    pressure: Decimal128,
    humidity: Decimal128,
    windSpeed: Decimal128,
    weather: String,
    weatherDetail: String
});
var hourlyData = mongoose.model("hourlyData", weatherSchema);

// console.log(await hourlyData.findOne().sort({ field: 'asc', _id: -1 }));

app.get("/api", (req, res) => {
    hourlyData.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
});

app.get("/current", (req, res) => {
    hourlyData.findOne().sort({ field: 'asc', _id: -1 }, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
});

// var axios = require('axios');
// import axios from 'axios';
// var data = JSON.stringify({
//     "collection": "hourlydatas",
//     "database": "WhetherApp",
//     "dataSource": "Cluster0",
//     "projection": {
//         "_id": 1
//     }
// });
            
// var config = {
//     method: 'post',
//     url: 'https://data.mongodb-api.com/app/data-emuvu/endpoint/data/beta/action/findOne',
//     headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Request-Headers': '*',
//         'api-key': 'ZnLR1uZkfThL2S37WLpaRBCMeSCX0ErohojZZUAjnuDfxmEfale84uo9ayydcw0o'
//     },
//     data : data
// };
            
// axios(config)
//     .then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });