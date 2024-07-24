import mongoose from "mongoose";

const userModel = new mongoose.Schema ({ 
    name: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", userModel);

export default User;