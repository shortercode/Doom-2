const MUSTACHE_REGEX = /{{([\w.]+)}}/g;
const RENDER_QUEUE = new Set();

let renderCallback = null;

function renderQueue() {
	renderCallback = null;
	for (let template of RENDER_QUEUE) {
		template.render();
	}
	RENDER_QUEUE.clear();
}

class Template
{
	constructor (element, model, string, safe = true)
	{
		this.pattern = string;
		this.keys = new Map();
		this.value = "";
		this.replacer = (match, group) => {
			let value;
			if (this.keys.has(e.path)) {
				value = this.keys.get(e.path);
			} else {
				value = model.get(group);
				this.keys.set(e.path, value + "");
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
		model.on("set", e => {
			if (this.keys.has(e.path)) {
				RENDER_QUEUE.add(this);
				this.keys.set(e.path, e.value + "");
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

export Template;