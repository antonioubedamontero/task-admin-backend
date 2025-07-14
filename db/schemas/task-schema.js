const mongoose = require("mongoose");
const TaskState = require("../../types/states.enum");

const STATE_VALUES = Object.values(TaskState);

// Schema
const LogStateSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: [...STATE_VALUES],
    },
    endDate: {
      type: String,
    },
    justification: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    currentState: {
      type: String,
      required: true,
      enum: [...STATE_VALUES],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logStates: {
      type: [LogStateSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt
  }
);

// Indexes
TaskSchema.index({ userId: 1 });
TaskSchema.index({ userId: 1, name: 1 }, { unique: true });
TaskSchema.index({ userId: 1, currentState: 1 });

// Model
const Task = mongoose.model("Task", TaskSchema);

module.exports = {
  STATE_VALUES,
  Task,
};
