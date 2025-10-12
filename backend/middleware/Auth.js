const auth=async(req,res,next)=>{
    try{
        const {token}=req.body

        if(!token) return res.json({
            success:false,
            message:error,
        })

        
 next();
    }catch(error){
        return res.json({
            success:false,
            message:error.message
        })
    }
}