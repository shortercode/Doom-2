const MUSTACHE_REGEX = /{{([\w.]+)}}/g;
const BRACKET_REMOVER = /\b\[(\w)\]+/g;

class TemplateNode
{
	constructor (element, model, string, safe = true)
	{
		this.pattern = string; //string.replace(BRACKET_REMOVER, '.$1');
		this.value = "";
		this.replacer = (match, group) => {
			const val = model.get(group);
			return typeof val === "undefined" ? "undefined" : val;
		}
		// HTMLElement that this instance is linked to
		this.element = element;
		/*
			TemplateNode.safe prevents the template string being interpreted as a HTML string,
			if theres user based data coming through this template it MUST be set to true
			else it'll become XMLinjection flaw
		*/
		this.safe = safe;
		// attach the render function to the model watcher ( so we get automatic updates from the model)
		model.watch( () => this.render() );
		// update with whatever we have now
		this.render();
	}
	
	render ()
	{
		const content = this.pattern.replace(MUSTACHE_REGEX, this.replacer);
		if (this.value !== content)
		{
			this.value = content;
			if (this.safe)
			{
				this.element.textContent = content;
			}
			else
			{
				this.element.innerHTML = content;
			}
		}
	}
}

class Template
{
	constructor (model, string)
	{
		this.model = model;
		this.pattern = string; //string.replace(BRACKET_REMOVER, '.$1');
		this.value = "";
		this.replacer = (match, group) => Template.repla
	}
	
	render ()
	{
		const content = this.pattern.replace(MUSTACHE_REGEX, this.replacer);
		return this.value !== content && (this.value = content);
	}
	
	static replacer (match, group)
	{
		const val = this.model.get(group);
		return typeof val === "undefined" ? "undefined" : val;
	}
	
	/*getAttribute (str)
	{
		const path = str.split('.');
		let currentObject = this.model;
		for (let key of path)
		{
			if (currentObject[key] === "undefined")
				return "undefined";
			currentObject = currentObject[key]
		}
		return currentObject;
	}*/
}

const MODIFIED_MODELS = [];

function setCallback (model)
{
	if (MODIFIED_MODELS.length === 0)
		setTimeout(triggerCallback); // asyncify the callbacks
	MODIFIED_MODELS.push(model);
}

function triggerCallback ()
{
	const models = MODIFIED_MODELS.slice(0); // take a copy as so to lock it
	MODIFIED_MODELS.length = 0; // clear all the listeners from the main
	let i = models.length;
	while (i--)
		models[i].callWatchers();
}

class Model
{
	constructor ()
	{
		this._model = Object.create(null);
		this._handlers = [];
	}
	
	get (key)
	{
		return this._model[key];
	}
	
	set (key, value)
	{
		return this._model[key] = value;
	}
	
	watch (fn)
	{
		this._handlers.push(fn);
	}
	
	getSubAttribute (str)
	{
		const path = str.split('.');
		let currentObject = this.model;
		let val;
		for (let key of path)
		{
			val = typeof currentObject.get === 'function' ?
				currentObject.get(key) : currentObject[key];
			if (typeof val === "undefined")
				return "undefined";
			currentObject = val;
		}
		return currentObject;
	}
	
	callWatchers ()
	{
		let i = this._handlers.length;
		while (i--)
			this._handlers(this);
	}
}

DOOM.create({
	template: "Hello my name is {{firstname}} {{lastname}}"
})

// { element: HTMLElement, model: Model }

const PERSON = new Model();
const NAMETAG = document.createElement('div');
new TemplateNode(NAMETAG, PERSON, "Hello my name is {{firstname}} {{lastname}}");