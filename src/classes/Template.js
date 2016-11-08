const MUSTACHE_REGEX = /{{([\w.]+)}}/g;
const RENDER_QUEUE = new Map();

let renderCallback = null;

function renderQueue() {
	renderCallback = null;
	for (let template of RENDER_QUEUE) {
		template.render();
	}
	RENDER_QUEUE.clear();
}

export default class Template
{
	constructor (element, model, string, safe = true)
	{
		this.pattern = string;
		this.keys = new Map();
		this.queue = RENDER_QUEUE;
		this.value = "";
		this.replacer = (match, group) => {
			let value;
			if (this.keys.has(group)) {
				value = this.keys.get(group);
			} else {
				value = model.get(group);
				this.keys.set(group, value + "");
			}
			return value;
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
		model.watch((path, value) => {
			if (this.keys.has(path)) {
				this.queue.set(element, this);
				this.keys.set(path, value + "");
				if (!renderCallback)
					renderCallback = requestAnimationFrame(renderQueue);
			}
		});
		// update with whatever we have now
		this.render();
	}
	
	template (str) {
		this.keys.clear();
		this.pattern = str;
		this.render();
	}
	
	render ()
	{
		const content = this.pattern.replace(MUSTACHE_REGEX, this.replacer);
		if (this.value !== content)
		{
			this.value = content;
			this.element[this.safe ? "textContent" : "innerHTML"] = content;
		}
	}
	
	static render (model, string) {
		return string.replace(MUSTACHE_REGEX, (match, group) => model.get(group));
	}
}