export default class Task {
  constructor(container, headerText) {
    this.container = container;

    const tasks = document.createElement('div');
    tasks.classList.add('list_tasks');
    container.appendChild(tasks);

    const header = document.createElement('div');
    header.classList.add('tasks_header');
    tasks.appendChild(header);

    const tasks_header_text = document.createElement('h4');
    tasks_header_text.classList.add('tasks_header_text');
    tasks_header_text.textContent = headerText;
    header.appendChild(tasks_header_text);

    const optionsBtn = document.createElement('span');
    optionsBtn.classList.add('task_header_options');
    optionsBtn.textContent = '...';
    header.appendChild(optionsBtn);

    const adderCard = document.createElement('div');
    adderCard.classList.add('adder_card');
    adderCard.textContent = '+ Add another card';
    tasks.appendChild(adderCard);

    adderCard.addEventListener('click', (event) => this.onAddCardClick(event));

    this.tasks = tasks;
  }

  onAddCardClick(event) {
    console.log('add card');
  }

  addCard(text) {
    // this.tasks.appendChild
  }
}
