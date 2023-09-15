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

    const tasksHeaderText = document.createElement('h4');
    tasksHeaderText.classList.add('tasks_header_text');
    tasksHeaderText.textContent = headerText;
    header.appendChild(tasksHeaderText);

    const optionsBtn = document.createElement('span');
    optionsBtn.classList.add('task_header_options');
    optionsBtn.textContent = '...';
    header.appendChild(optionsBtn);

    const taskList = document.createElement('div');
    taskList.classList.add('task_list');
    tasks.appendChild(taskList);

    const adderCard = document.createElement('div');
    adderCard.classList.add('adder_card');
    adderCard.textContent = '+ Add another card';
    tasks.appendChild(adderCard);

    adderCard.addEventListener('click', (e) => this.onAddCardClick(e));

    taskList.addEventListener('mousedown', (e) => this.onMouseDownTask(e));

    this.tasks = tasks;
    this.taskList = taskList;
    this.adderCard = adderCard;

    // Добавляем переменные для отслеживания перемещения
    this.dragging = null; // Элемент, который перетаскивается
    this.startX = 0; // Начальная позиция курсора по оси X относительно элемента
    this.startY = 0; // Начальная позиция курсора по оси Y относительно элемента
  }

  onMouseDownTask(e) {
    e.preventDefault();

    if (e.button !== 0) return;

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

    // Запоминаем соседей, чтобы вернуть элемент на место в случае невозможности вставки
    this.previousNeighbour = this.dragging.previousElementSibling;
    this.nextNeighbour = this.dragging.nextElementSibling;

    // Добавляем пустой элемент на месте перемещаемого элемента
    this.placeholder = document.createElement('div');
    this.placeholder.style.width = `${this.dragging.offsetWidth}px`;
    this.placeholder.style.height = `${this.dragging.offsetHeight}px`;
    this.dragging.parentNode.insertBefore(this.placeholder, this.dragging);

    this.dragging.classList.add('dragging');

    // Устанавливаем начальные координаты
    this.dragging.style.left = `${rect.left}px`;
    this.dragging.style.top = `${rect.top}px`;
    this.dragging.style.width = `${rect.width}px`;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    // Обновляем позицию элемента в соответствии с перемещением мыши
    const posX = e.clientX - this.startX;
    const posY = e.clientY - this.startY;
    this.dragging.style.left = `${posX}px`;
    this.dragging.style.top = `${posY}px`;

    // падение проекции при перемещении карточки
    const { target } = e;
    if (target.classList.contains('task_card')) {
      const rect = target.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      if (dropY > rect.height / 2) {
        target.parentNode.insertBefore(this.placeholder, target.nextSibling);
      } else {
        target.parentNode.insertBefore(this.placeholder, target);
      }
    }
  }

  onMouseUp(e) {
    if (!this.dragging) return;

    this.dragging.style = undefined;

    // Ставим элемент на место, где произошло событие mouseup
    const { target } = e;
    // Определяем соседей для вставки
    let previous = target.previousElementSibling;
    if (previous && !previous.classList.contains('task_card')) {
      previous = null;
    }
    let next = target.nextElementSibling;
    if (next && !next.classList.contains('task_card')) {
      next = null;
    }

    const targetList = target.closest('.task_list');
    let container = targetList;

    if (!targetList) {
      // Если targetList не найден, возвращаем элемент на исходное место
      previous = this.previousNeighbour;
      next = this.nextNeighbour;
      container = this.dragging.parentNode;
    } else if (targetList && !previous && !next) {
      targetList.appendChild(this.dragging);
    }

    if (previous) {
      container.insertBefore(this.dragging, previous.nextSibling);
    } else if (next) {
      container.insertBefore(this.dragging, next);
    } else {
      container.appendChild(this.dragging);
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

  onAddCardClick(e) {
    if (e.button !== 0) return;
    this.addCard();
  }

  addCard(textTask = undefined) {
    const card = document.createElement('div');
    card.classList.add('task_card');

    const tmp = document.createElement('div');
    tmp.classList.add('close_button_container');
    card.appendChild(tmp);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close_button');
    closeButton.innerText = '×';

    // Удаляем блок задачи при клике на крестик
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      card.remove();
    });

    // card.appendChild(closeButton);
    tmp.appendChild(closeButton);

    // блок ввода текста
    const cardText = document.createElement('div');
    cardText.classList.add('content_card');
    if (!textTask) {
      cardText.innerText = 'Нажмите, чтобы начать редактирование';
    } else {
      cardText.setAttribute('contenteditable', 'true');
      cardText.innerText = textTask;
    }

    card.appendChild(cardText);

    const cardTextEdit = document.createElement('div');
    cardTextEdit.classList.add('card_text_edit');
    cardTextEdit.innerText = '\u270E';
    card.appendChild(cardTextEdit);

    cardTextEdit.addEventListener('click', () => {
      // если это первое редактирование, то удалим предыдущий текст
      if (cardText.getAttribute('contenteditable') === null) {
        cardText.textContent = '';
      }
      cardText.setAttribute('contenteditable', 'true');
      cardText.focus();
    });

    this.taskList.appendChild(card);
  }
}
