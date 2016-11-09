export function wait(value, callback, ...args) {
	let anim = value === "nextframe";
	let delay = Math.Max(0, ~~value);
	let res = () => {
		ref = null;
		callback(...args);
	};
	let ref = anim ? requestAnimationFrame(res) : setTimeout(res, delay);
	return new Disposable(() => ref && (
		anim ? cancelAnimationFrame(ref) : clearTimeout(ref)
	));
}