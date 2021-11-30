const router = require("express").Router();
//import * as proc from '../Calculator/processing.mjs'
const {Questionare_First,Questionare_Second} = require("../Calculator/processing.js")
const User = require("../models/User");
const Travel =require("../models/Travel");
const UserModelInput = require("../models/UserInput");
const UserModelOutput = require("../models/UserOutput")
const jwt = require("jsonwebtoken");
const { requireAuth } = require('./authMiddleware');
const UserInput =require("../models/UserInput");
router.get('/',(req,res)=>{
    res.render("index");
})
router.get('/entry_signup',(req,res)=>{
    res.render("entry"); 
})
router.get('/entry_signin',(req,res)=>{
    res.render("entry");
})
//handling post requests register
router.post('/processing_signup',async (req,res)=>{
    try{
        const newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
          });
    
          console.log(req.body);
          const user = await newUser.save();
         // res.status(200).json(user);
          res.json({ok: true});
    }
    catch(err){
        res.status(500).json(err);
    }
    
})

//jwt token creation
const maxAge= 3*24*60*60;
const createToken =(id) => {
  return jwt.sign({id},'AFBLKIEWRU$FODIGIDFSDFHODFSKL',{
      expiresIn: maxAge,
  })
}


router.post("/processing_signin", async(req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email});
      !user && res.json({resp2:"Wrong  credentials!"});
  
      const validated =  (req.body.password===user.password);
      !validated && res.json({resp2:"Wrong  credentials!"});
  
     if(validated) {
         const token =createToken(user._id);
         console.log(user);
         res.cookie('jwt',token,{httpOnly :true , maxAge :maxAge*1000});
        res.json({resp:"Correct"});
     }
      //res.status(200).json(user);
    }catch (err) {
     console.log("error");
    }
  });

router.get('/MyAccount',requireAuth,async (req,res)=>{
    try{
        const token = req.cookies.jwt;
        jwt.verify(token,'AFBLKIEWRU$FODIGIDFSDFHODFSKL',async (err,decodedToken)=>{
            const placeid=decodedToken.id;
            const userInput = await UserModelInput.findOne({ uuid : placeid});
            if(userInput)
            {
               const userOut = await UserModelOutput.findOne({ uuid : placeid});
               const userTravel =await Travel.findOne({uuid : placeid});
              res.render("dashboard",{
                    acf:userOut.monthly_average,
                    sf:userOut.carbon_footprint,
                    gl:userOut.goal,
                    avg:userInput.so_far_this_month,
                    food:userInput.food,
                    fly:userTravel.fly,
                    car_taxi:userTravel.car,
                    motorbike:userTravel.motorbike,
                    travel:userInput.travel,
                    elec:userInput.electricity,
              });  
              //res.send("uikjfhsdak");
            }
            else{

                res.render("questionare");
            }

        })
    }
     catch(err){

}
})

router.post('/questionare_filling',requireAuth,async (req,res)=>{
    try{
        const token = req.cookies.jwt;
        jwt.verify(token,'AFBLKIEWRU$FODIGIDFSDFHODFSKL', async (err,decodedToken)=>{
            const placeid=decodedToken.id;
            console.log(req.body);
            const filldata = new Questionare_First();
            const travel= filldata.create_travel_object(req.body);
            const food=filldata.create_food_object(req.body);
            const elec=filldata.create_electricity_object(req.body);
            const calcin= filldata.calculate_inputs(req.body);
          
            travel.get_travel_details.uuid=placeid;
           
            const newTravel = new Travel(travel.get_travel_details);
            const travelData = await newTravel.save();
            console.log(travelData);
            
            const newCalcin = new UserModelInput({
                uuid:placeid,
                travel:travel.get_travel_data,
                food:food.get_food_data,
                electricity:elec.get_electricity_data,
                so_far_this_month:calcin.get_so_far_this_month,
                dates:travel.get_travel_details.dates,

            });
           const monNewCalc =await newCalcin.save();
           console.log(monNewCalc);

           const newOutput = new UserModelOutput({
            uuid:placeid,
            carbon_footprint:calcin.get_so_far_this_month,
            monthly_average:calcin.get_monthly_average,
            total_co2:calcin.get_total_co2,
            dates:travel.get_travel_details.dates,
            goal:calcin.get_goal_to_reach,
        });
       const monNewOut =await newOutput.save();
       console.log(monNewOut);
         
       res.json({resp1:"Correct",resp2:"Registered"});

        })
    }
     catch(err){
      res.json({resp1:"Correct",resp2:"Invalid "});
}
})



router.post('/questionare_update',requireAuth,async (req,res)=>{
    try{
        const token = req.cookies.jwt;
        jwt.verify(token,'AFBLKIEWRU$FODIGIDFSDFHODFSKL', async(err,decodedToken)=>{
            const placeid=decodedToken.id;
            console.log(req.body);
            const userUpdateInput = await UserInput.findOne({ uuid : placeid});
            const filldata = new Questionare_Second(userUpdateInput);
            const travel= filldata.create_travel_object(req.body);
            const food=filldata.create_food_object(req.body);
            const elec=filldata.create_electricity_object(req.body);
            const calcin= filldata.calculate_inputs(userUpdateInput);
          
           // travel.get_travel_details.uuid=placeid;
           const userUpdateTravel = await Travel.findOne({ uuid : placeid});
           const UserTravel_id = userUpdateTravel._id;
           const updatedTravel = await Travel.findByIdAndUpdate(
            UserTravel_id,
            {
              $set:travel.get_travel_details,
            },
            { new: true }
          );
          console.log(updatedTravel);
            //const newTravel = new Travel(travel.get_travel_details);
           // const travelData = await newTravel.save();
           const UserInput_id = userUpdateInput._id;
           const updatedInput = await UserInput.findByIdAndUpdate(
            UserInput_id,
            {
              $set: {
                travel:travel.get_travel_data,
                food:food.get_food_data,
                electricity:elec.get_electricity_data,
                so_far_this_month:calcin.get_so_far_this_month,
                dates:travel.get_travel_details.dates, 
              },
            },
            { new: true }
          );
            console.log(updatedInput);
            
            // const newCalcin = new UserModelInput({
            //     uuid:placeid,
            //     travel:travel.get_travel_data,
            //     food:food.get_food_data,
            //     electricity:elec.get_electricity_data,
            //     so_far_this_month:calcin.get_so_far_this_month,
            //     dates:travel.get_travel_details.dates,
            // });
          // const monNewCalc =await newCalcin.save();
          //console.log(monNewCalc);

         
       res.json({resp1:"Correct",resp2:"Registered"});

        })
    }
     catch(err){
      res.json({resp1:"Correct",resp2:"Invalid "});
}
})


router.post("/get_graph",(req,res)=>{
    res.json({resp:"10,20,30,40,50,60,70,100,120,140,160,180"});
});


router.get('/community',(req,res)=>{
  res.render("community"); 
});

router.get('/logout',(req,res)=>{
  res.cookie('jwt','',{ maxAge :1});
  res.redirect('/');
});


module.exports = router