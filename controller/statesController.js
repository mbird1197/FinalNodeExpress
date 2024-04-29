const data = require('../model/statesData.json');
const State = require('../model/State');





const getAllStates = async (req, res) => {

    const states = await State.find();
    if(!states) return res.status(204).json({ 'message' : 'No states found.'});
    res.json(states);

    
}

const getSingleState = async (req, res) => {

    const code = req.code;
   
    const stateData = data.find(state => { 
        return state.code === code;
    });



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
    
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'nickname': stateData.nickname });

}



const getStatePopulation = async (req, res) => 
{


    const code = req.code;

    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'population': stateData.population.toLocaleString() });

}

const getStateAdmission = async (req, res) => 
{


    const code = req.code;
    
    const stateData = data.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'admitted': stateData.admission_date });

}


const getFunFact = async (req, res) => {

    const stateCode = req.code;
    
  
    const state = await State.findOne({stateCode});

    if (state.funfacts === undefined || state.funfacts.length === 0) {
        return res.status(204).json({message : `No Fun Facts found for Georgia`}); // Plain text response
    

    }
        
    else{
    const randomFunFact = Math.floor(Math.random() * state.funfacts.length);

        res.json({'funfact' : state.funfacts[randomFunFact]});


    }





    
    
    



const addFunFact = async (req, res) => {


    try{



        const newData = new State({

            stateCode: req.body.code,
            funfacts: req.body.funfacts
        });

        await newData.save();
    }catch(err){
        console.error(err);
        res.status(500).send('Error adding funfact');
    }


}}


module.exports = { 
    getAllStates, 
    getSingleState,
     getStateCapital, 
     getStateNickname,
      getStatePopulation,
       getStateAdmission, 
       getFunFact,
    //addFunFact 
};


