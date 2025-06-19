const TaskState = require('../types/states.enum');

const logStatesMock = [
    {
        startDate: new Date().toLocaleString(),
        state: TaskState.CREATED,
        endDate: null,
        justification: ''
    }
];

const task1Mock = {
    id: '1',
    name: 'task1',
    description: 'Task1 description',
    startDate: '2025-06-17',
    dueDate: '2025-06-18',
    currentState: TaskState.BACKLOG,
    userId: '1',
    logStates: [...logStatesMock]
};

const task2Mock = {
    id: '2',
    name: 'task2',
    description: 'Task2 description',
    startDate: '2025-06-18',
    dueDate: '2025-06-25',
    currentState: TaskState.STARTED,
    userId: '2',
    logStates: [...logStatesMock]
};

const task3Mock = {
    id: '3',
    name: 'task3',
    description: 'Task3 description',
    startDate: '2025-06-19',
    dueDate: '2025-06-20',
    currentState: TaskState.STARTED,
    userId: '2',
    logStates: [...logStatesMock]
};

const task4Mock = {
    id: '4',
    name: 'task4',
    description: 'Task4 description',
    startDate: '2025-06-20',
    dueDate: '2025-06-21',
    currentState: TaskState.PAUSED,
    userId: '3',
    logStates: [...logStatesMock]
};

const task5Mock = {
    id: '5',
    name: 'task5',
    description: 'Task5 description',
    startDate: '2025-06-21',
    dueDate: '2025-06-22',
    currentState: TaskState.ENDED,
    userId: '4',
    logStates: [...logStatesMock]
};

const task6Mock = {
    id: '6',
    name: 'task6',
    description: 'Task6 description',
    startDate: '2025-06-22',
    dueDate: '2025-06-23',
    currentState: TaskState.ENDED,
    userId: '5',
    logStates: [...logStatesMock]
};

const task7Mock = {
    id: '7',
    name: 'task7',
    description: 'Task7 description',
    startDate: '2025-06-23',
    dueDate: '2025-06-24',
    currentState: TaskState.CANCELED,
    userId: '6',
    logStates: [...logStatesMock]
};

module.exports = [
    task1Mock,
    task2Mock,
    task3Mock,
    task4Mock,
    task5Mock,
    task6Mock,
    task7Mock,
]
