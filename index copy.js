// var express = require("express");
// var mongoose = require("mongoose");
// import bodyParser from 'body-parser';
import mongoose from "mongoose";
import express from "express";
import fetch from 'node-fetch';
import { Decimal128 } from "mongodb";

var app = express();
// var jsonParser = bodyParser.json()

// mongoose.Promise = global.Promise;

app.use(express.json());
app.get("/", (req, res) => {res.send("Hello World");
});

const CONNECTION_URL = `mongodb+srv://admin:admin@cluster0.2p4n1.mongodb.net/WhetherApp?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, function (){
        const url = "http://history.openweathermap.org/data/2.5/history/city?lat=51.50&lon=0.13&type=hour&start=1638796521&end=1639699685&appid=c3a2ab1eb5775866562679aa553ebf47";
        fetch(url)
        .then(res => res.json())
        .then(json => {
            const length = json.list.length;
            console.log(length);
            for (let i=0; i<length; i++){
                const mydata = new hourlyData({
                    'date': json.list[i].dt,
                    'temp': json.list[i].main.temp,
                    'feels_like': json.list[i].main.feels_like,
                    'pressure': json.list[i].main.pressure,
                    'humidity': json.list[i].main.humidity,
                    'windSpeed': json.list[i].wind.speed,
                    'weather': json.list[i].weather[0].main,
                    'weatherDetail': json.list[i].weather[0].description
                })
                mydata.save(function(err, result){
                    if (err) throw err;
                    if(result) {
                        console.log(result)
                    }
                })
            }           
        })
        console.log(`Server running on port: ${PORT}`);
    }))
    .catch((error) => console.log(error.message));

var weatherSchema = new mongoose.Schema({
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

app.post("/", (req, res) => {
    var myData = new hourlyData(req.body);
    myData.save()
      .then(item => {
        res.send("item saved to database");
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  });
