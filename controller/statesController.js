
const State = require('../model/State');
const data1 = require('../model/statesData.json');


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


    const contig = req.query.contig;
    if(contig == "true"){
    
    const responseData = data1.filter( (state )=> {
    
    return (state.code != "AK" && state.code != "HI");
    
    } )
    
    return res.json(responseData);
    }
    if(contig == 'false'){
    
    const responseData = data1.filter( (state )=> {
    
    return (state.code == "AK" || state.code == "HI");
    
    } )
    return res.json(responseData);
    
    }
    const stateWithFunFacts = [];
    const states = await State.find({})
    for(const state of data1 ){
    const funfactState = states.find(st => st.stateCode === state.code)
    
    if(funfactState){
    stateWithFunFacts.push({
    ...state,
    funfacts: funfactState.funfacts
    })
    }
    else{
    stateWithFunFacts.push({ ...state});
    }
    
    }
    
    res.json(stateWithFunFacts);
    
    
    


    
}

const getSingleState = async (req, res) => {

    const code = req.code;

    const state = await State.findOne({stateCode: code});
    
   
    const stateData = data.states.find(state => { 
        return state.code === code;
    });
    if(state && state.funfacts){
        stateData.funfacts = state.funfacts;
    }


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


const getFunFact = async (req, res) => {

   
    
    const stateCode = req.code;
    
    const stateName = data.states.find(state => {

        return state.code === stateCode;
    }).state;
    const state = await State.findOne({stateCode});

   
    
    if(!state || !state.funfacts || state.funfacts.length == 0){

        return res.status(404).json({message : `No Fun Facts found for ${stateName}`});
    }      
  
    const randomFunFact = Math.floor(Math.random() * state.funfacts.length);

        res.json({'funfact' : state.funfacts[randomFunFact]});




}
    
  


const addFunFact = async (req, res) => {

    if(!req.body.funfacts){
        return res.status(400).json({message: 'State fun facts value required'});

    }
    if(!Array.isArray(req.body.funfacts)){
        return res.status(404).json({message: 'State fun facts value must be an array'});
    }
    try{

        const state = await State.findOne({stateCode: req.code})
        if(state){
           const updatedState = await State.findOneAndUpdate({ stateCode : req.code } ,  { $push : { funfacts : req.body.funfacts }   }, {new: true});
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
    
    const { index , funfact} = req.body;

    if(!index || index <= 0 ){
        return res.status(400).json({message: 'State fun fact index value required'});

    }

    if(!funfact){
        return res.status(400).json({message: 'State fun fact value required'});
    }
    const stateCode = req.code;
    
    const stateName = data.states.find(state => {

        return state.code === stateCode;
    }).state;

    const state = await State.findOne({stateCode: req.code})
    if(!state){
      
        return res.status(400).json({message: `No Fun Facts found for ${stateName}`});
    }

    

    
    

    if(index > state.funfacts.length ){
        return res.status(400).json({message: `No Fun Fact found at that index for ${stateName}` });
    }

    state.funfacts = state.funfacts.map( (fact, idx ) => {

        if(index === idx + 1){
            return funfact;
        }
        else{
            return fact;
        }

    })

    await state.save();
     res.json(state);



}




const deleteFunFact = async (req, res) => {

    const {index } = req.body;
    if(!index || index <= 0){

        return res.status(400).json({message: 'State fun fact index value required'});
    }

    const state = await State.findOne({stateCode: req.code})
    const stateCode = req.code;
    


    const stateName = data.states.find(state => {

        return state.code === stateCode;
    }).state;

    if(!state){
      
        return res.status(400).json({message: `No Fun Facts found for ${stateName}`});
    }

    

    

    
    if(!state.funfacts || state.funfacts.length === 0){
        return res.status(400).json({message: `No Fun Facts found for ${stateName}`});
    }
    if( index > state.funfacts.length){
        return res.status(400).json({message: `No Fun Fact found at that index for ${stateName}`});
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
       getFunFact,
    addFunFact,
    updateFunFact,
    deleteFunFact 
};


