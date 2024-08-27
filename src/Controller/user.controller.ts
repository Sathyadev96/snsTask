 
import bcrypt from "bcrypt";
import {userModel} from "../Model/user.model"; 
import mongoose from "mongoose"; 

 export const CreateUser = async (req:any,res:any)=>{
    try{  
        if(!req.body.password){
          console.log('Password Parameter not found!  ');
          return res.status(400).send({status: 400  , message: "Password Parameter not found!.."});
        }

        const salt = await bcrypt.genSalt(10);  
        const hashedCode = await bcrypt.hash(req.body.password, salt); 
        req.body.password = hashedCode; 
        console.log("\n body :", req.body)
          await userModel.create(req.body).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Created.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Creation.."});
          })
    }catch(error){
        console.error('Error on Create User :', error);
        throw error;
    }
};

export const LoginUser = async (req:any,res:any)=>{
  try{  
      if(!req.body.email || !req.body.password){
        console.log('Credentials invalid!..');
        return res.status(400).send({status: 400  , message: "Invalid credentials!.."});
      } 

      const client:any = await userModel.findOne({email: req.body.email});

      if(!client){
        return res.status(400).send({status: 400 , message: "User not available.."}); 
      }; 
       const authenticate = await bcrypt.compare(req.body.password,client?.password);
       if(!authenticate)  return res.status(400).send({status: 400 , message: "Invalid password.."}); 
          
       return res.status(200).send({status: 200, message: "User Authenticate Successfully.."}); 
        
  }catch(error){
      console.error('Error on Authenticate User :', error);
      throw error;
  }
};

export const EditUser = async (req:any,res:any)=>{
    try{
        if(!req.params.id){
            return 'Parameter not found!'
        } 

        let updateData:any = {};

        if(req.body.firstName){
          updateData.firstName = req.body.firstName;          
        }
        if(req.body.role){
          updateData.role = req.body.role
        }
        if(req.body.status){
          updateData.status = req.body.status
        } console.log("\n updatedata: ",updateData)
         
          await userModel.findByIdAndUpdate(req.params.id,updateData).then((data)=>{
            return res.status(200).send({status: 200 , result: data, message: "User Updated.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Update.."});
          })
    }catch(error){
        console.error('Error on Update User :', error);
        throw error;
    }
};

export const DeleteUser = async (req:any,res:any)=>{
    try{
        if(!req.params.id){
            return 'Parameter not found!'
        } 
          await userModel.findByIdAndDelete(req.params.id).then((data)=>{
            return res.status(200).send({status: 200 , message: "User Deleted.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Deletion.."});
          })
    }catch(error){
        console.error('Error on Delete User :', error);
        throw error;
    }
};

export const DisplayUser = async (req:any,res:any)=>{
    try{
      console.log('\n parameter: ', req.params.id);

      let search:any,filter:any;

      if(req.query.search){
        search = {
            $or: [
              {
                firstName: {
                  $regex: req.query.search,
                  $options: "i",
                },
              },
              {
                lastName: {
                  $regex: req.query.search,
                  $options: "i",
                },
              },
              {
                email: {
                  $regex: req.query.search,
                  $options: "i",
                },
              },
              {
                role: {
                  $regex: req.query.search,
                  $options: "i",
                },
              },
              {
                mobileNo: {
                  $regex: req.query.search,
                  $options: "i",
                },
              },
            ],
          }
      }

      if(req.query.role){
        filter = { role : req.query.role}
      }

      let constraint = filter ? filter : search

      console.log("\n filter and search: ", search, filter,constraint);   

        if(req.params.id){ 
            await userModel.findById(req.params.id).then((data)=>{
                return res.status(200).send({status: 200 , result: data, message: "User Displayed.."});
              }).catch((error)=>{ 
                return res.status(400).send({status: 400 , error: error, message: "Error on User Selection.."});
              })
        } 
         await userModel.find(constraint).sort({name : 1}).limit(10).then((data)=>{
            console.log("\n check role: ", data)
            return res.status(200).send({status: 200 , result: data, message: "User Displayed.."});
          }).catch((error)=>{ 
            return res.status(400).send({status: 400 , error: error, message: "Error on User Selection.."});
          })              
        
         
    }catch(error){
        console.error('Error on Select User :', error);
        throw error;
    }
}; 

module.exports = {
    CreateUser,
    EditUser,
    DeleteUser,
    DisplayUser,
    LoginUser
}
