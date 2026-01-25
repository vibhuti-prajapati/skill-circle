const adminAuth=(req, res,next)=>{
  console.log("checking authorization ");
  const toekn ="abs";
  const isAuthorized = toekn==="abs";
  if(!isAuthorized){
    res.statusCode(401).send(" you are not authorized for this action ");
  }else{
    next();
  }
}; 

const userAuth= (req, res,next)=>{
  console.log("checking authorization fro user  ");
  const toekn ="abt";
  const isAuthorized = toekn==="abt";
  if(!isAuthorized){
    res.statusCode(401).send(" you are not authorized for this action ");
  }else{
    next();
  }
}; 

export {adminAuth, userAuth};