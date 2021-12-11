import isSymbol from "./is-symbol.js";
import path from "./path.js";

export default function ignoreProperty(cache, options, property, target) {
	return (
		cache.isUnsubscribed ||
		(options.ignoreSymbols && isSymbol(property)) ||
		(options.ignoreUnderscores && property.charAt(0) === "_") ||
		("ignoreKeys" in options && options.ignoreKeys.includes(property)) ||
		!isInObserverPath(cache, options, property, target)
	);
}

export function isInObserverPath(cache, options, property, target) {
	const fullPath = path.concat(cache.getPath(target), property);
	const pathPieces = [];
	path.walk(fullPath, (key) => {
		pathPieces.push(key);
	});
	return false;
}
