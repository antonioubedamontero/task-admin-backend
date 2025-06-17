const TaskState = require('../types/states.enum');

const logStates = [
    {
        startDate: '2025-06-19',
        state: TaskState.PAUSED,
        endDate: '2025-06-20',
        justification: 'waiting for backend'
    },
    {
        startDate: '2025-06-20',
        state: TaskState.STARTED,
        endDate: null,
        justification: 'continue development'
    },
]

module.exports = logStates;
