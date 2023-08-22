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

    // Добавляем переменные для отслеживания перемещения
    this.dragging = null; // Элемент, который перетаскивается
    this.startX = 0; // Начальная позиция курсора по оси X относительно элемента
    this.startY = 0; // Начальная позиция курсора по оси Y относительно элемента

    this.tmp = 1; // todo del
  }

  onMouseDownTask(e) {
    e.preventDefault();

    if (e.button != 0) {
      return;
    }

    const actualEl = e.target;

    // Если элемент не task_card, игнорируем событие
    if (!actualEl.classList.contains('task_card')) {
      return;
    }

    // Сохраняем элемент, который перетаскивается
    this.dragging = actualEl;
    
    // Рассчитываем начальные позиции курсора относительно элемента
    const rect = this.dragging.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    
    // Добавляем пустой элемент на месте перемещаемого элемента
    this.placeholder = document.createElement('div');
    this.placeholder.style.width = this.dragging.offsetWidth + 'px';
    this.placeholder.style.height = this.dragging.offsetHeight + 'px';
    this.dragging.parentNode.insertBefore(this.placeholder, this.dragging);
    
    this.dragging.classList.add('dragging');

    // Устанавливаем начальные координаты
    this.dragging.style.left = rect.left + 'px';
    this.dragging.style.top = rect.top + 'px';
    this.dragging.style.width = rect.width + 'px';

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    // Обновляем позицию элемента в соответствии с перемещением мыши
    if (this.dragging) {
      const posX = e.clientX - this.startX;
      const posY = e.clientY - this.startY;
      this.dragging.style.left = posX + 'px';
      this.dragging.style.top = posY + 'px';
    }
  }

  onMouseUp(e) {
    if (this.dragging) {
           
      // Ставим элемент на место, где произошло событие mouseup
      const target = e.target.closest('.task_card:not(.dragging)');
      if (target) {
        const rect = target.getBoundingClientRect();
        const dropY = e.clientY - rect.top;
        if (dropY > rect.height / 2) {
          target.parentNode.insertBefore(this.dragging, target.nextSibling);
        } else {
          target.parentNode.insertBefore(this.dragging, target);
        }
      } else {
        // Если target не найден, возвращаем элемент на исходное место
        const originalContainer = this.dragging.parentNode;
        originalContainer.insertBefore(this.dragging, this.placeholder);
      }

      // // Убираем абсолютное позиционирование и возвращаем элемент в поток документа
      this.dragging.classList.remove('dragging');

      if (this.placeholder && this.placeholder.parentNode) {
        this.placeholder.parentNode.removeChild(this.placeholder);
      }

      this.dragging = null;
      this.placeholder = null;

      document.documentElement.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mouseover', this.onMouseMove);
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

    //todo del
    card_text.setAttribute('contenteditable', 'true');
    card_text.innerText = this.tmp++;

    const card_text_edit = document.createElement("div");
    card_text_edit.classList.add("card_text_edit");
    card_text_edit.innerText = '\u270E';
    card.appendChild(card_text_edit);

    card_text_edit.addEventListener('click', () => {
      // если это первое редактирование, то удалим предыдущий текст
      if (card_text.getAttribute('contenteditable') === null) {
        card_text.textContent = '';
      }
      card_text.setAttribute('contenteditable', 'true');
      card_text.focus();
    });

    this.task_list.appendChild(card);   
  }
}
