const jwt = require('jsonwebtoken');
 const verifyUser=(req,res,next)=>{

    const token=req.cookies.access_token;
    // console.log(token);
    if(!token){
       return res.status(400).json({success:false,message:" token unauthorized"});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(400).json({success:false,message:"error verifying token unauthorized"});
        }
        req.user=user;
        next();
    })
}

module.exports=verifyUser;