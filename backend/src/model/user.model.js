import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema(

    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: '',
        },

        profilePic: {
            type: String,
            required: true,
        },
        nativeLanguage: {
            type: String,
            default: "",

        },
        learningLanguage: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
        friends : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            }
        ],

        refreshTokens : {
            type : String,
        }


    },

    { timestamps: true }

);

userSchema.pre("save" ,  async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password , 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



const User = model("User" , userSchema);

export {User};