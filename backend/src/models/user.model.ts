import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends Document{
  username:string;
  email:string;
  password:string;
  isPasswordValid:(password:string)=>boolean
  generateJWT:()=>string
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  console.log(this.password);
  this.password = bcrypt.hashSync(this.password as string, 10);

  next();
});


userSchema.methods.isPasswordValid = function(password:string){
  return bcrypt.compareSync(password,this.password);
}


userSchema.methods.generateJWT = function(){

   const token =  jwt.sign({
      id:this._id,
      username:this.username,
      email:this.email,
    },process.env.JWT_SECRET as string)

    return token;
}

export const User = mongoose.model<IUser>("User", userSchema);
