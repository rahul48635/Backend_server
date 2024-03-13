const userModel = require("../modal/userSchema");
const emailValidator = require("email-validator");
const bcrypt=require("bcrypt");
const signup = async (req, res, next) => {
  const { name, email, password, cpassword } = req.body;
  console.log(name, email, password, cpassword);
  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields",
    });
  }
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }
  if (password !== cpassword) {
    return res.status(400).json({
      success: false,
      message: "Password does not match",
    });
  }
  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user || !(await bcrypt.compare(password,user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = user.jwtToken();
    user.password = undefined;
    user.email = undefined;
    user.cpassword = undefined;
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const getUser=async(req,res)=>{
  const userId=req.user.id;
  try{
    const user=await userModel.findById(userId);
    return res.status(200).json({
      success:true,
      data:user
    });
  }catch(e){
    return res.status(400).json({
      success:false,
      message: e.message
    })
  };
}

const logout=(req,res)=>{
    try{
      const cookieOption={
        expires:new Date(),
        httpOnly:true
      }
      res.cookie("token",null,cookieOption)
      res.status(200).json({
        success:true,
        message:"Logged out successfully"
      })
    }catch(e){
      res.status(400).json({
        success:false,
        message:e.message
      })
    }
}
module.exports = { signup, signin , getUser,logout};
