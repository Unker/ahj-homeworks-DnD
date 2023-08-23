import Task from "./Task";

const container = document.querySelector('.container');

const tasks = container.querySelectorAll('.task');
const task1 = tasks[0];

const container_tasks = document.createElement('div');
container_tasks.classList.add('container-tasks');
task1.appendChild(container_tasks);

const tasks_todo = new Task(container_tasks, 'todo');
const tasks_in_progress = new Task(
  container_tasks,
  'in progress'
);
const tasks_done = new Task(container_tasks, 'done');

// заполнение тестовыми данными
['1','22','333'].forEach((text) => tasks_todo.addCard(text));
['Task1','Task2','Task3'].forEach((text) => {
  tasks_in_progress.addCard(text)
});

