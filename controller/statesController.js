const data = require('../model/statesData.json');
const State = require('../model/State');





const getAllStates = async (req, res) => {

    
    res.json(data);

    
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

   
    
    const code = req.params.state.toUpperCase();
    
    const statecode = data.states.find( state => state.code == code);
    const state = await State.findOne({statecode: code}).exec();

    if(state.funfacts.length === 0 || state.funfacts === undefined){
        res.status(201).json({message : `No fun facts for ${State.state}`});
    }
    
        
  
    const randomFunFact = Math.floor(Math.random() * state.funfacts.length);

        res.json({'funfact' : state.funfacts[randomFunFact]});




}
    
    

/*

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
*/

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


