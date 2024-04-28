const data = require('../model/statesData.json');






const getAllStates = async (req, res) => {

    const states = await State.find();
    if(!states) return res.status(204).json({ 'message' : 'No states found.'});
    res.json(states);

    
}

const getSingleState = async (req, res) => {

    const code = req.code;
    console.log(code);
    const stateData = data.find(state => { 
        return state.code === code;
    });

// Do something with specificEntry

res.json(stateData);


}


const getStateCapital = async (req, res) => {

//{ ‘state’: stateName, ‘capital’: capitalName }

    const code = req.code;
    console.log(code);
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ state: stateData.state, capital: stateData.capital_city });




}



const getStateNickname = async (req, res) => 
{


    const code = req.code;
    console.log(code);
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ state: stateData.state, nickname: stateData.nickname });

}



const getStatePopulation = async (req, res) => 
{


    const code = req.code;
    console.log(code);
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ state: stateData.state, population: stateData.population });

}

const getStateAdmission = async (req, res) => 
{


    const code = req.code;
    console.log(code);
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ state: stateData.state, admission: stateData.admission_date });

}

module.exports = { getAllStates, getSingleState, getStateCapital, getStateNickname, getStatePopulation, getStateAdmission };


