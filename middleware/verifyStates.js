const statesData = require('../model/statesData.json');


const verifyStateCodes = (req, res, next) => {
 
  const stateCode = req.params.state;
  const upperCaseCode = stateCode.toUpperCase();
  const statesCodes = statesData.map(state => state.code);

  function isStateAbbreviationValid(upperCaseCode) {
      const foundState = statesCodes.find(state => state === upperCaseCode);
      return foundState !== undefined;
  }

  if (!isStateAbbreviationValid(upperCaseCode)) {
      return res.status(404).send({'error': 'Not a valid state.'});
  }

  // Set the state code in the request object
  req.code = upperCaseCode;

  // Call next to move to the next middleware or route handler
  next();



}

module.exports = verifyStateCodes;