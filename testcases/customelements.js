define("alloy-button", class FancyButton extends alloy('button') {
	constructor() {
		super(); // always call super() first in the ctor.
		this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
	}

	// Material design ripple animation.
	drawRipple(x, y) {
		let div = document.createElement('div');
		div.classList.add('ripple');
		this.appendChild(div);
		div.style.top = `${y - div.clientHeight / 2}px`;
		div.style.left = `${x - div.clientWidth / 2}px`;
		div.style.backgroundColor = 'currentColor';
		div.classList.add('run');
		div.addEventListener('transitionend', e => div.remove());
	}
});