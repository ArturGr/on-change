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
	if (options.observePath.length == 0) return true;
	const fullPath = path.concat(cache.getPath(target), property);
	const pathProperties = [];
	path.walk(fullPath, (key) => {
		pathProperties.push(key);
	});
	let doNotObserve = false;
	pathProperties.forEach((property, depth) => {
		options.observePath.forEach((pathOption) => {
			if (pathOption.depth === depth) {
				if (
					Array.isArray(pathOption.keys) &&
					!pathOption.keys.includes(property)
				) {
					doNotObserve = true;
				}
			}
		});
	});
	return !doNotObserve;
}
