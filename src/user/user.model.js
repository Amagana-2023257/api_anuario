import mongoose from "mongoose";

const roleEnum = ['USER', 'ADMIN']; 

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        surname: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (v) => /\S+@\S+\.\S+/.test(v),
                message: (props) => `${props.value} no es un correo electrónico válido`
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePicture: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: roleEnum,
            default: 'user'
        },
        status: {
            type: Boolean,
            default: true 
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function(){
    const {password, _id, ...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

const User = mongoose.model("User", userSchema);

export default User;
