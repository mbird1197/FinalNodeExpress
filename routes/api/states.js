const express = require('express');
const router = express.Router();
const path = require('path');
const statesController = require('../../controller/statesController');
const verifyStateCodes = require('../../middleware/verifyStates');



router.get('/', statesController.getAllStates);

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