const mongoose = require("mongoose");
const UserInputSchema = new mongoose.Schema(
    {
        uuid:{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
           },
        travel: {
          type: Number,
          required: true,
        },
        food: {
          type: Number,
          required: true,
        },
        electricity: {
          type: Number,
          required:true,
        },
        so_far_this_month:{
          type: Number,
          required:true,
        },
        dates: {
          type: Date,
          required: true,
        }
    }
  );
  module.exports = mongoose.model("User_Input", UserInputSchema);