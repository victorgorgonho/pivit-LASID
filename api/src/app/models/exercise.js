const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  heartbeat: {
    type: [Number],
    required: true,
  },
  averageHeartbeat: {
    type: Number,
    required: true,
  },
  distance: {
    type: [Number],
    required: true,
  },
  averageDistance: {
    type: Number,
    required: true,
  },
  velocity: {
    type: [Number],
    required: true,
  },
  averageVelocity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;