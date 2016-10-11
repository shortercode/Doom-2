export function search(str, parent) {
	return (parent || document).querySelector(str);
}

export function searchAll(str, parent) {
	return (parent || document).querySelector(str);
}