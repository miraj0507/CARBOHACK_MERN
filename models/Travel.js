
const mongoose = require("mongoose");
const TravelSchema = new mongoose.Schema({
    uuid : {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bus:{
      type: Number,
      required: true,
    },
    taxi:{
      type: Number,
      required: true,
    },
    train:{
      type: Number,
      required: true,
    },
    car:{
      type: Number,
      required: true,
    },
    motorbike:{
      type: Number,
      required: true,
    },
    cycling:{
      type: Number,
      required: true,
    },
    walking:{
      type: Number,
      required: true,
    },
    fly:{
      type: Number,
      required: true,
    },
    dates:{
      type: Date,
      required: true,
    },
  });
  module.exports = mongoose.model("Travel", TravelSchema);
  