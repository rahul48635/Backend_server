const mongoose=require('mongoose');
const {Schema}=mongoose;
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema=new Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        minLenght:[5,'Name should be at least 5 characters'],
        maxLenght:[30,'Name should not be more than 30 characters'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please provide an email'],
        unique:true,
        lowercase:true,
        unique:[true,'Email already exists'],
    },
    password:{
        type:String,
    },
    cpassword:{
        type:String,
    },
    forgotPasswordToken:{
        type:String,
    },
    forPasswordExpiryDate:{
        type:Date,
    },
  },
  {timestamps:true});


  userSchema.pre('save' ,async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    this.cpassword=await bcrypt.hash(this.cpassword,10);
    return next();
})


userSchema.methods={
    jwtToken(){
        return JWT.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    }
}
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;