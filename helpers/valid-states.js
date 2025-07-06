const { TaskState } = require("../types/states.enum");

const isValidTaskState = (state) => {
  const validStates = Object.values(TaskState);
  return validStates.includes(state);
};

module.exports = {
  isValidTaskState,
};
