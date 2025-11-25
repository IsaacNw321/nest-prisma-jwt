const secret = process.env.JWT_SECRET;
if(!secret){
  throw new Error("The secret should be defined")  
}
export const MySecret = secret