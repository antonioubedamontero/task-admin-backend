const TaskState = require('../types/states.enum');
const logStates = require('../mocks/log-states');

const task1 = {
    id: '1',
    name: 'task1',
    description: 'Task1 description',
    startDate: '2025-06-17',
    dueDate: '2025-06-18',
    currentState: TaskState.BACKLOG,
    logStates: []
};

const task2 = {
    id: '2',
    name: 'task2',
    description: 'Task2 description',
    startDate: '2025-06-18',
    dueDate: '2025-06-25',
    currentState: TaskState.STARTED,
    logStates: [...logStates]
};

const task3 = {
    id: '3',
    name: 'task3',
    description: 'Task3 description',
    startDate: '2025-06-19',
    dueDate: '2025-06-20',
    currentState: TaskState.STARTED,
    logStates: []
};

const task4 = {
    id: '4',
    name: 'task4',
    description: 'Task4 description',
    startDate: '2025-06-20',
    dueDate: '2025-06-21',
    currentState: TaskState.PAUSED,
    logStates: []
};

const task5 = {
    id: '5',
    name: 'task5',
    description: 'Task5 description',
    startDate: '2025-06-21',
    dueDate: '2025-06-22',
    currentState: TaskState.ENDED,
    logStates: []
};

const task6 = {
    id: '6',
    name: 'task6',
    description: 'Task6 description',
    startDate: '2025-06-22',
    dueDate: '2025-06-23',
    currentState: TaskState.ENDED,
    logStates: []
};

const task7 = {
    id: '7',
    name: 'task7',
    description: 'Task7 description',
    startDate: '2025-06-23',
    dueDate: '2025-06-24',
    currentState: TaskState.CANCELED,
    logStates: []
};

module.exports = [
    task1,
    task2,
    task3,
    task4,
    task5,
    task6,
    task7,
]
