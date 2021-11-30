
const mongoose = require("mongoose");
const UserOutputSchema = new mongoose.Schema({
    uuid : {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carbon_footprint:{
      type: Number,
      required: true,
    },
    monthly_average:{
      type: Number,
      required: true,
    },
    total_co2:{ 
      type: Number,
      required: true,
    },
    dates:{
      type: Date,
      required: true,
    },
    goal:{
      type:Number,
      required:true,
    }
  });
  module.exports = mongoose.model("User_Output", UserOutputSchema);