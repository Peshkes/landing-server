import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["admin", "user"]
    }
});

const RoleModel = mongoose.model("Role", roleSchema);
export default RoleModel;
