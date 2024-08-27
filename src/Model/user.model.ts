import mongoose,{Schema} from "mongoose";
 
const userSchema:Schema = new Schema({
    id : {
        type : String,
        autoGenerate : true
    },
    firstName : {
        type : String,
        require : true,
        trim : true
    },
    lastName : {
        type : String,
        require : true,
        trim : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
        trim : true
    },
    password : {
        type : String,
        require : true
    },
    mobileNo: {
        type : String,
        require : true,
        unique : true,
        trim : true
    },
    role: {
        type : String, 
        enum : ['user','admin','guest'],
        default : 'user'
    },
    status : {
        type: String, 
        enum : ['active','inactive'],
        default : 'active'
    }
},{
    timestamps : true
});

userSchema.index({ email: 1 });

export const userModel = mongoose.model('User', userSchema); 