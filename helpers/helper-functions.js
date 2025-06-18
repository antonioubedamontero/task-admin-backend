const TaskState = require('../types/states.enum');

const changeState = (logStates, currentState, justification) => {
  if (!currentState || !justification) return;

  logStates.at(-1).endDate = new Date().toLocaleString();

  logStates.push({
    startDate: new Date().toLocaleString(),
    state: currentState,
    endDate: null,
    justification: justification ?? ''
  })
}

const isValidState = (state) => {
  return Object.values(TaskState).includes(state);
};

module.exports = {
  changeState,
  isValidState
};
