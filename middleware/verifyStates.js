const statesData = require('../model/statesData.json');
const express = require('express');
const app = express();


const verifyStateCodes = (req, res, next) => {

app.get('/states/:state', (req, res, next) =>{

    const stateCode = req.params.state;

    const upperCaseCode = stateCode.toUpperCase();

    const statesCodes = statesData.map(state => state.stateCode);
   
    function isStateAbbreviationValid(stateCode) {
       
        const foundState = statesCodes.find(state => state === stateCode);
        
       return foundState !== undefined;
        
      }


      if(!isStateAbbreviationValid(upperCaseCode)){
        return res.status(404).send({'error' : 'Not a valid state.'});
      }
    req.code = upperCaseCode;

    next();
})



}

module.exports = verifyStateCodes;