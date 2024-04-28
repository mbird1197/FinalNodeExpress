const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../../controller/statesController');
const data = {};
data.statesData = require('../../model/statesData.json');

router.route('/')
.get((req, res) => {
    res.json(data.statesData);
})


module.exports = router;