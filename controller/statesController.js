
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

    const contig = req.query.contig;
    let _data = data.states;
    if(contig == "true"){
    
    const responseData = data.states.filter( (state )=> {

        return (state.code != "AK" && state.code != "HI");

    } )

    _data = responseData;
}
    if(contig == 'false'){

    const responseData = data.states.filter( (state )=> {

        return (state.code == "AK" || state.code == "HI");

    } )
        _data = responseData;

}
    
    const stateWithFunFacts = [];
    for(const state of _data ){
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
    
  
// /states/TX/funfact endpoint POST request will return a message saying 'State fun facts value required' if no funfacts are in the body of the request.‣
// /states/UT/funfact endpoint POST request will return a message saying 'State fun facts value must be an array' if funfacts are not provided in an array.


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



// /states/NE/funfact endpoint PATCH request should update the fun fact at the provided index property. REMEMBER: Provided indexes should start a 1, not zero.‣
// /states/NE/funfact endpoint PATCH request should return a JSON object with 4 properties and represent the updated data. REMEMBER: Provided indexes should start a 1, not zero.‣
// /states/MI/funfact endpoint PATCH request will return a message saying 'State fun fact index value required' if no index is provided in the body of the request.‣
// /states/CT/funfact endpoint PATCH request will return a message saying 'State fun fact value required' if a funfact property is not provided with a string value.‣
// /states/AZ/funfact endpoint PATCH request will return a message saying 'No Fun Facts found for Arizona' if no funfacts exist to update.‣
// /states/KS/funfact endpoint PATCH request will return a message saying 'No Fun Fact found at that index for Kansas' if no fun fact exists to update at the provided index.

const updateFunFact = async (req, res ) => {

    const state = await State.findOne({stateCode: req.code})
    if(!state){
      
        return res.status(400).json({message: 'State does not exist'});
    }

    const { index , funfact} = req.body;
    if(!index || index <= 0 || !funfact){
        return res.status(400).json({message: 'No fun facts found'});

    }
    if(!state.funfacts || state.funfacts.length === 0){
        return res.status(400).json({message: 'No fun facts array' });
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


// /states/NE/funfact endpoint DELETE request should delete the fun fact at the provided index property. REMEMBER: Provided indexes should start a 1, not zero.‣
// /states/OR/funfact endpoint DELETE request should return a JSON object with 4 properties and represent the updated data. REMEMBER: Provided indexes should start a 1, not zero.‣
// /states/WY/funfact endpoint DELETE request will return a message saying 'State fun fact index value required' if no index is provided in the body of the request.‣
// /states/MT/funfact endpoint DELETE request will return a message saying 'No Fun Facts found for Montana' if no funfacts exist to delete.‣
// /states/CO/funfact endpoint DELETE request will return a message saying 'No Fun Fact found at that index for Colorado' if no fun fact exists to delete at the provided index.

const deleteFunFact = async (req, res) => {

    const state = await State.findOne({stateCode: req.code})
    const stateCode = req.code;
    
    const stateName = data.states.find(state => {

        return state.code === stateCode;
    }).state;

    if(!state){
      
        return res.status(400).json({message: 'State does not exist'});
    }

    const {index } = req.body;
    if(!index || index <= 0){

        return res.status(400).json({message: 'State fun fact index value required'});
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


