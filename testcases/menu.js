class Menu extends alloy('div') {
	constructor (context, rootMenu) {
		super();
		
		this.rootMenu = rootMenu;
		this.context = context;
		this.items = new Set();
		
		this.visible = false;
		
		this.subscribers = new ComspositeDisposable(
			Disposable.from(this, "pointermove", e => ),
			Disposable.from(this, "pointerup"),
			Disposable.from(this, )
		);
		
		this.activeItem = null;
	}
	release () {
		
		this.subscribers.dispose();
		this.hide();
		this.items.clear();
		
		this.rootMenu = null;
		this.context = null;
		
		this.items = null;
		this.visible = false;
		
		this.subscribers = null;
		
	}
	addItem (label, method, preventClose) {
		const item = create("alloy-menuitem", this, label, method, preventClose);
		
		this.items.add(item);
		this.subscribers.add(() => item.release());
	}
	addMenu (label) {
		const menu = create("alloy-menu", null, this.context, this.rootMenu);
		
		this.addItem(label, () => menu.show(), true);
		
		return menu;
	}
	addSeparator () {
		
	}
	show (x, y) {
		
	}
	hide () {
		
	}
}

class Item extends alloy('div') {
	constructor (name, method, preventClose) {
		super();
		this.label = label;
		this.method = method;
		this.shouldClose = !preventClose;
	}
	activate () {
		if (this.method)
			this.method();
		if (this.shouldClose)
			
	}
}

define("alloy-menu", Menu);
define("alloy-menuitem", Item);