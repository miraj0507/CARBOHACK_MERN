const jwt = require("jsonwebtoken");


const requireAuth= (req,res,next) =>
{
    const token = req.cookies.jwt;
    //verify token
    if(token)
    {
      jwt.verify(token,'AFBLKIEWRU$FODIGIDFSDFHODFSKL', (err,decodedToken)=>{
       if(err){
           console.log(err.message);
           res.redirect('/');
       }
       else{
          console.log(decodedToken);
          
          next(); 
       }
      })

    }else{
        res.redirect('/');
    }
}
module.exports ={requireAuth};