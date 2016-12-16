const BOARD_TITLES = [
	'rejected',
	'pending',
	'development',
	'testing',
	'production'
];
const DOUBLE_CLICK_TIMEOUT = 400;

class Board extends alloy('scrum-board') {
	
	constructor () {
		super();
		this.columns = new Map();
		this.tasks = new Set();
		this.activeTask = null;
		modify({
			element: this,
			children: BOARD_TITLES.map(name => {
				let element = new Column(this, name);
				this.columns.set(name, element);
				return element;
			})
		});
	}
	
	addTaskTo(columnName, taskName) {
		let column = this.columns.get(columnName);
		if (!column)
			throw new Error('No such column');
		column.createTask(taskName);
	}
	
	editTask(task) {
		if (this.activeTask)
			task.delete("contenteditable");
		if (this.activeTask === task)
			return this.activeTask = null;
			
		this.activeTask = task;
		task.set("contenteditable", "");
	}

}

class Column extends alloy('scrum-column') {
	
	constructor (board, name) {
		super();
		this.board = board;
		this.rect = null;
		modify({
			element: this,
			children: [
				{
					class: 'column-title',
					text: name
				},
				{
					class: 'column-area'
				}
			]
		});
		this.updateRect();
	}
	
	updateRect () {
		this.rect = this.getBoundingClientRect();
	}
	
	createTask (name) {
		let task = new Task(this, name);
		this.last.insert(task);
	}
	
	addTask (task) {
		if (task.column === this)
			return;
		if (task.column)
			task.column.removeTask(task);
		this.insert(task);
		this.board.tasks.add(task);
		task.column = this;
		task.board = this.board;
	}
	
	removeTask (task) {
		this.remove(task);
		task.board.tasks.delete(task);
		task.column = null;
		task.board = null;
	}
	
	hitTest (x, y) {
		let r = this.rect;
		return r.left < x && r.top < y && r.right > x && r.bottom > y;
	}
}

class Task extends alloy('scrum-task') {
	constructor (column, name) {
		let mousetime = 0;
		let elementLeft;
		let elementTop;
		let mouseLeft;
		let mouseTop;
		
		super();
		
		this.column = column;
		this.board = column.board;
		this.board.tasks.add(this);
		modify({
			element: this,
			text: name,
			on: {
				mousedown: e => {
					let boundingRect = this.element.getBoundingClientRect();
					elementLeft = boundingRect.left;
					elementTop = boundingRect.top;
					mouseLeft = e.x;
					mouseTop = e.y;
				},
				mousemove: e => {
					let x = mouseLeft - e.x;
					let y = mouseTop - e.y;
					if (!this.has("contenteditable"))
						this.style.transform = `translate(${x}px, ${y}px)`;
				},
				mouseup: e => {
					let time = e.timeStamp;
					let timedelta = time - mousetime;
					
					if (timedelta < DOUBLE_CLICK_TIMEOUT) {
						this.board.editTask(this);
						this.style.transform = "";
						mousetime = 0;
						return;
					}
					
					if (!this.has("contenteditable")) {
						for (let column of this.board.columns) {
							if (column !== this.column && column.hitTest(e.x, e.y)) {
								this.column.addTask(this);
								break;
							}
						}
					}
					mousetime = time;
				}
			}
		});
	}
}

define('scrum-board', Board);
define('scrum-column', Column);
define('scrum-task', Task);