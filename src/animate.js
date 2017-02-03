
{
	const NOW = () => Performance.now()
	const TIMINGS = {
		LINEAR: (t) => t,
		// quad, slowest accelaration
		EASE_IN_QUAD: (t) => t*t,
		EASE_OUT_QUAD: (t) => t*(2-t),
		EASE_IN_OUT_QUAD: (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
		// cubic, slow accelaration
		EASE_IN_CUBIC: (t) => t*t*t,
		EASE_OUT_CUBIC: (t) => (--t)*t*t+1,
		EASE_IN_OUT_CUBIC: (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
		// quart, fast accelaration
		EASE_IN_QUART: (t) => t*t*t*t,
		EASE_OUT_QUART: (t) => 1-(--t)*t*t*t,
		EASE_IN_OUT_QUART: (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
		// quint, fastest accelaration
		EASE_IN_QUINT: (t) => t*t*t*t*t,
		EASE_OUT_QUINT: (t) => 1+(--t)*t*t*t*t,
		EASE_IN_OUT_QUINT: (t) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
	};
	
	const START = Date.now();
	const PER_LOOP = new Set();
	const ANIMATIONS = new Set();
	const SCHEDULED = new Set();
	
	const TICK = () => {
		requestAnimationFrame(TICK);
		const CURRENT = NOW();
		const ELAPSED = CURRENT - START;
		for (let func of PER_LOOP) {
			func(ELAPSED);
		}
		if (SCHEDULED.size > 0) {
			for (let anim of SCHEDULED) { // start scheduled animations
				if (anim.start >= CURRENT) {
					ANIMATIONS.add(anim);
					SCHEDULED.delete(anim);
					anim.onstart && anim.onstart();
				}
			}
		}
		if (ANIMATIONS.size > 0) {
			for (let anim of ANIMATIONS) { // iterate active animations
				let delta = Math.min((CURRENT - anim.start) / anim.duration, 1);
				let t = anim.timing(anim.direction == 'FORWARDS' ? delta : 1 - delta);
				anim.iteration(t);
				if (delta == 1) {
					if (anim.repeats) {
						anim.start = CURRENT;
						if (anim.pingpong) {
							anim.direction = anim.direction === 'FORWARDS' ? 'BACKWARDS' :'FORWARDS';
						}
					} else {
						ANIMATIONS.delete(anim);
						anim.oncompletion && anim.oncompletion();
					}
				}
			}
		}
	};
	
	requestAnimationFrame(TICK);
	
	return {
		animate (oniteration, {
			delay = 0,
			duration,
			timing,
			repeats,
			pingpong,
			direction = 'FORWARDS',
			oncompletion,
			onstart
		}) {
			const START = NOW();
			let anim = {
				start: START + delay, // animation start time in ms from common fixed point
				duration: +time, // animation duration in ms
				direction: direction, // animation direction ( "FORWARDS" || "BACKWARDS" )
				pingpong: !!pingpong, // boolean specifying if the direction should switch on complete
				timing: TIMINGS[timing] || TIMINGS['LINEAR'], // timing function curve
				repeats: !!repeats, // boolean specifying if the animation should repeat after completion
				oniteration: oniteration, // listener that is called on each frame
				oncompletion: oncompletion, // listener that is called when an animation finishes
				onstart: onstart // listener that is called when an animation starts
			};
			SCHEDULED.add(anim);
			return anim;
		}
		
		perFrame (oniteration) {
			PER_LOOP.add(oniteration);
		}
		
		cancel (anim) {
			// for lazy, attempt to remove from all!
			SCHEDULED.delete(anim);
			ANIMATIONS.delete(anim);
			PER_LOOP.delete(anim);
		}
	}
}