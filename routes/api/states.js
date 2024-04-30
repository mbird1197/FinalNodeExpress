const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../../controller/statesController');
const verifyStateCodes = require('../../middleware/verifyStates');
const State = require('../../model/State');
const data = require('../../model/statesData.json');

router.route('/')
.get(async(req, res) => {

///states/?contig=true 


const contig = req.query.contig;
if(contig == "true"){
    
    const responseData = data.filter( (state )=> {

        return (state.code != "AK" && state.code != "HI");

    } )

    return res.json(responseData);
}
if(contig == 'false'){

    const responseData = data.filter( (state )=> {

        return (state.code == "AK" || state.code == "HI");

    } )
    return res.json(responseData);

}
const stateWithFunFacts = [];
for(const state of data ){
    const stateResult = await State.findOne({stateCode : state.code});
    if(stateResult){
        stateWithFunFacts.push({
            ...state, 
            funfacts: stateResult.funfacts
        })
    }
    else{
        stateWithFunFacts.push({ ...state, funfacts: []});
    }
    
}

res.json(stateWithFunFacts);


    //res.json(data);
})

router.get('/', verifyStateCodes, statesController.getAllStates)

router.get('/:state', verifyStateCodes, statesController.getSingleState);
router.get('/:state/capital', verifyStateCodes, statesController.getStateCapital);
router.get('/:state/nickname', verifyStateCodes, statesController.getStateNickname);
router.get('/:state/population', verifyStateCodes, statesController.getStatePopulation);
router.get('/:state/admission', verifyStateCodes, statesController.getStateAdmission);
router.get('/:state/funfact', verifyStateCodes, statesController.getFunFact);
router.post('/:state/funfact', verifyStateCodes, statesController.addFunFact );
router.patch('/:state/funfact', verifyStateCodes, statesController.updateFunFact);
router.delete('/:state/funfact', verifyStateCodes, statesController.deleteFunFact);


//

module.exports = router; 