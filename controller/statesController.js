const State = require('../model/State');




const getAllStates = async (req, res) => {

    const states = await State.find();
    if(!states) return res.status(204).json({ 'message' : 'No states found.'});
    res.json(states);

    
}

module.exports = { getAllStates };


