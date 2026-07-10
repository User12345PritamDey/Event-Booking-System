const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const eventRoutes = require('./routes/event.js');
const bookingRoutes = require('./routes/booking.js');
dotenv.config();
const app = express();
app.use(cors());
//Basically input data may have many forms json or others but server only know the javascript object so previously people used body-parser(it converts ant version of data into object type) but in new version of express,it includes a built in functionality that is app.use(express.json()) 
app.use(express.json());
//Routes
app.use('/api/auth', authRoutes);//This app.use tells the Express that for any request starting with this /api/auth/endpoint ,here endpoint may be login or anything.Basically,if a request URL starts with /api/auth, send it to authRoutes
app.use('/api/event',eventRoutes);
app.use('/api/booking',bookingRoutes);
//connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('connected',()=>{
    console.log("Database is connected");
})
db.on('disconnected',()=>{
    console.log("Database is disconnected")
})
db.on('error',(err)=>{
    console.log(err);
})
const PORT=process.env.PORT||7000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

