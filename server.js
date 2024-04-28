require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const statesController = require('./controller/statesController');
const verifyStateCodes = require('./middleware/verifyStates');
const statesData = require('./model/statesData.json');
const cors = require('cors');
const { applyDefaults } = require('./model/State');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5500;
connectDB();
app.use(cors());

app.use(express.urlencoded({ extended: false}));

app.use(express.json());

app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

/*app.get('/states/', (req, res) => {

res.json(statesData);


})

*/ 

//




app.all('*', (req, res) => {

res.status(404);
if(req.accepts('html')) {

    res.sendFile(path.join(__dirname, 'views', '404.html'));
} else if (req.accepts('json')){
    res.json({"error" : "404 Not Found"});

} else {
    res.type('txt').send('404 Not Found');
}


});




mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});