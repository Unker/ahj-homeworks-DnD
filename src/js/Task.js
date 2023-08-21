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

    
    const task_list = document.createElement('div');
    task_list.classList.add('task_list');
    tasks.appendChild(task_list);

    const adderCard = document.createElement('div');
    adderCard.classList.add('adder_card');
    adderCard.textContent = '+ Add another card';
    tasks.appendChild(adderCard);

    adderCard.addEventListener('click', (e) => this.onAddCardClick(e));

    task_list.addEventListener('mousedown', (e) => this.onMouseDownTask(e)); 

    this.tasks = tasks;
    this.task_list = task_list;
    this.adderCard = adderCard;
  }

  onMouseDownTask(e) {
    e.preventDefault();

    const actualEl = e.target;

    // если элемент не таск, то игнорируем событие
    if (!actualEl.classList.contains('task_card')) {
      return;
    }

    this.dragging = { 'el': actualEl };
    this.dragging['el'].classList.add('dragged');
    this.dragging['index'] = this.getIndexInParent(actualEl);
    const rect = actualEl.getBoundingClientRect();
    this.dragging['offsetX'] = e.clientX - rect.left;
    this.dragging['offsetY'] = e.clientY - rect.top;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mouseover', this.onMouseOver);
  }

  onMouseUp(e) {
    console.log('up');
    const mouseUpItem = e.target;

    if (this.dragging && mouseUpItem.classList.contains('task_card')) {
      const dropIndex = this.getIndexInParent(mouseUpItem);

      // Вставляем элемент перед или после целевого элемента
      if (this.dragging['index'] < dropIndex) {
        mouseUpItem.parentElement.insertBefore(this.dragging['el'], mouseUpItem.nextElementSibling);
      } else {
        mouseUpItem.parentElement.insertBefore(this.dragging['el'], mouseUpItem);
      }
    }
    console.log(this.dragging['el'])
    this.dragging['el'].classList.remove('dragged');
    this.dragging = undefined;

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseOver);

  }

  onMouseOver(e) {
    console.log('over');
    console.log(e);
    if (this.dragging) {
      // this.dragging['el'].style.top = e.clientY + 'px';
      // this.dragging['el'].style.left = e.clientX + 'px';
      const posX = e.clientX - this.offsetX;
      const posY = e.clientY - this.offsetY;
      this.dragging['el'].style.transform = `translate(${posX}px, ${posY}px)`;
    }
  }

  getIndexInParent(element) {
    return Array.from(element.parentElement.children).indexOf(element);
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

    this.task_list.appendChild(card);
    // this.tasks.insertBefore(card, this.adderCard);
    
  }
}
