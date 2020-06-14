const documentCreateElement = (
	parentEl,
	childEl,
	tagName,
	attributes,
	innerHtml,
	event) => {
	childEl = document.createElement(tagName);

	// console.log(childEl);

	Object.keys(attributes).forEach(key => {
		childEl.setAttribute(key, attributes[key]);
	});

	if (innerHtml) {
		childEl.innerHTML = innerHtml;
	}

	if (event) {
		childEl.addEventListener(event.type, event.listener);
	}

	parentEl.appendChild(childEl);

	return childEl;
};

exports.default = documentCreateElement;
