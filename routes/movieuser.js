var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const  MovieUser  = require("../models/movieusers");
const jwt = require("jsonwebtoken")
const axios = require('axios')
const movieapi = require('../models/movielist');
const Showtime = require('../models/showtime');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource of kathirvel');
});



    router.get('/register', async (req, res) => {
      try {
          const register = await MovieUser.find();
          res.json(register);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  });


router.post('/register', async function(req, res, next) {
   
try{
    const salt = bcrypt.genSaltSync(10);
    console.log(salt,"1");
    
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash,"2");

    req.body.password = hash;

    console.log( req.body.password,'3');

   
    const movieuser = new MovieUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    console.log(movieuser,'4');

     await movieuser.save();

     console.log( await movieuser.save(),"5");
     
   
   
  return  res.json({message:'respond with a resource of kathirvel'});
 
}
catch (error){
console.log(error);

return res.status(500).json({ message:'internal server error '});

}
});

  

router.post('/login', async function(req, res, next) {

try{

  const userLogin = await MovieUser.findOne({ email : req.body.email})   
console.log(">>>>>>>>>>>>>>");

  if(!userLogin){
    return res.status(400).jsom({ message : "Invalid Credentials" });
  }

  const isValid = bcrypt.compareSync(req.body.password , userLogin.password);

  if(! isValid) {
    return res.status(400).jsom({ message : "Invalid Credentials" });
  }

  const token = jwt.sign({ id : userLogin._id}, process.env.JWT_SECRET)
  return res.json({ message : "movie user Login successsfully", token: token});
}
catch(error){
console.log(error);

}
});


router.get("/movies/:title", async (req, res) => {
  console.log("list");
  
    try {
        const { title } = req.params;
        const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1`);
        if (!response.data.Search) {
          return res.status(404).json({ message: "No movies found" });
      }
        const movielist = await  movieapi.insertMany(response.data.Search);
        
        res.json({message:"movies saved successfuly", data : movielist});
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie details" });
    }
});


router.get("/movies/:title/:id", async (req, res) => {
  console.log("list");
  
    try {
        const { title } = req.params;
        const {id} = req.params.id;
        const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1/${id}`);
        if (!response.data.Search) {
          return res.status(404).json({ message: "No movies found" });
      }
        const movielist = await  movieapi.find();
        
        res.json({message:"movies saved successfuly", data : movielist});
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie details" });
    }
});







module.exports = router;
