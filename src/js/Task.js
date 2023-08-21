export default class Task {
  constructor(container, headerText) {
    this.container = container;

    const tasks = document.createElement('div');
    tasks.classList.add('container-task');
    container.appendChild(tasks);

    // содержимое контейнера
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

    const task_list = document.createElement('div');
    task_list.classList.add('task_list');
    tasks.appendChild(task_list);

    adderCard.addEventListener('click', (e) => this.onAddCardClick(e));

    task_list.addEventListener('mousedown', (e) => this.onMouseDownTask(e)); 

    this.tasks = tasks;
    this.task_list = task_list;
    this.adderCard = adderCard;
  }

  onMouseDownTask(e) {
    e.preventDefault();

    this.draggingEl = e.target;
    // если элемент не таск, то игнорируем событие
    if (!this.draggingEl.classList.contains('task_card')) {
      return;
    }
    this.draggingEl.classList.add('grabbed');

    document.documentElement.addEventListener('mouseup', this.onMouseUp(e));
    document.documentElement.addEventListener('mouseover', this.onMouseOver(e));
  }

  onMouseUp() {
    console.log('up');
  }

  onMouseOver() {
    console.log('over');
  }

  onAddCardClick(e) {
    this.#addCard();
  }

  #addCard() {
    const card = document.createElement("div");
    card.classList.add("task_card");
    
    const closeButton = document.createElement("span");
    closeButton.classList.add("close_button");
    closeButton.innerText = '×';

    // Удаляем блок задачи при клике на крестик
    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      card.remove(); 
    });
    
    card.appendChild(closeButton);

    // блок ввода текста
    const card_text = document.createElement("div");
    card_text.classList.add("content_card");
    card_text.innerText = 'Нажмите, чтобы начать редактирование';
    card.appendChild(card_text);

    const card_text_edit = document.createElement("div");
    card_text_edit.classList.add("card_text_edit");
    card_text_edit.innerText = '\u270E';
    card.appendChild(card_text_edit);

    card_text_edit.addEventListener('click', () => {
      // если это первое редактирование, то удалим предыдущий текст
      console.log(card_text.getAttribute('contenteditable'))
      if (card_text.getAttribute('contenteditable') === null) {
        card_text.textContent = '';
      }
      card_text.setAttribute('contenteditable', 'true');
      card_text.focus();
    });

    // this.task_list.appendChild(card);
    this.tasks.insertBefore(card, this.adderCard);
    
  }
}
