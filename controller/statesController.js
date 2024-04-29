
const State = require('../model/State');



const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) {this.states = data}
};

async function mergeModels(){

    for(const state in data.states){

        const fact = await State.findOne({statecode: data.states[state].code}).exec();
        if(fact){

            data.states[state].funfacts = fact.funfacts;

        }
      }
}

mergeModels();


const getAllStates = async (req, res) => {

    
    res.json(data);

    
}

const getSingleState = async (req, res) => {

    const code = req.code;
   
    const stateData = data.states.find(state => { 
        return state.code === code;
    });



res.json(stateData);


}


const getStateCapital = async (req, res) => {



    const code = req.code;
    console.log(code);
    const stateData = data.states.find(state => { 
        return state.code === code;
    });

    res.json({ state: stateData.state, capital: stateData.capital_city });




}



const getStateNickname = async (req, res) => 
{


    const code = req.code;
    
    const stateData = data.states.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'nickname': stateData.nickname });

}



const getStatePopulation = async (req, res) => 
{


    const code = req.code;

    const stateData = data.states.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'population': stateData.population.toLocaleString() });

}

const getStateAdmission = async (req, res) => 
{


    const code = req.code;
    
    const stateData = data.states.find(state => { 
        return state.code === code;
    });

    res.json({ 'state': stateData.state, 'admitted': stateData.admission_date });

}

/*
const getFunFact = async (req, res) => {

   
    
    const stateCode = req.code;
    
    const stateName = data.states.find(state => {

        return state.code === stateCode;
    }).state;
    const state = await State.findOne({stateCode});

   
    
    if(!state.funfacts || state.funfacts.length == 0){

        return res.status(404).json({message : `No fun facts for ${stateName}`});
    }      
  
    const randomFunFact = Math.floor(Math.random() * state.funfacts.length);

        res.json({'funfact' : state.funfacts[randomFunFact]});




}
    
  */  



const addFunFact = async (req, res) => {

    if(!req.body.funfacts || req.body.funfacts.length == 0){
        return res.status(400).json({message: 'Please provide funfacts array'});

    }
    try{

        const state = await State.findOne({stateCode: req.code})
        if(state){
           const updatedState = await State.findOneAndUpdate({ stateCode : req.code } , { $push : {funfacts:{$each: req.body.funfacts }  } }, {new: true});
           console.log(updatedState);
            return res.json(updatedState);
        }

        const newData = new State({
            
            stateCode: req.code,
            funfacts: req.body.funfacts
        });

        await newData.save();
        res.json(newData);
    }catch(err){
        console.error(err);
        res.status(500).send('Error adding funfact');
    }


}

const updateFunFact = async (req, res ) => {

    const state = await State.findOne({stateCode: req.code})
    if(!state){
      
        return res.status(400).json({message: 'State does not exist'});
    }

    const { funfactIndex , newFunFact} = req.body;
    if(!funfactIndex || funfactIndex <= 0 || !newFunFact){
        return res.status(400).json({message: 'No fun facts found'});

    }
    if(!state.funfacts || state.funfacts.length === 0){
        return res.status(400).json({message: 'No fun facts array' });
    }

    state.funfacts = state.funfacts.map( (fact, index ) => {

        if(funfactIndex === index + 1){
            return newFunFact;
        }
        else{
            return fact;
        }

    })

    await state.save();
     res.json(state);



}


const deleteFunFact = async (req, res) => {

    const state = await State.findOne({stateCode: req.code})
    if(!state){
      
        return res.status(400).json({message: 'State does not exist'});
    }

    const {index } = req.body;
    if(!index || index <= 0){

        return res.status(400).json({message: 'No index exists'});
    }

    
    if(!state.funfacts || state.funfacts.length === 0){
        return res.status(400).json({message: 'No fun facts array' });
    }

    state.funfacts = state.funfacts.filter( (fact, idx) => {

        if(index == idx + 1){
            return false;
        }
        return true;
    })


    await state.save();
    res.json(state);
}


module.exports = { 
    getAllStates, 
    getSingleState,
     getStateCapital, 
     getStateNickname,
      getStatePopulation,
       getStateAdmission, 
       //getFunFact,
    addFunFact,
    updateFunFact,
    deleteFunFact 
};


