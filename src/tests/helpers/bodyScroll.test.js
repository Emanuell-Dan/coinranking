const importFresh = require('import-fresh');
let bodyScroll = require('body-scroll-toggle');
let DOM = importFresh('../../helpers/bodyScroll');

beforeEach(() => {
	bodyScroll = require('body-scroll-toggle');
	bodyScroll.enable = jest.fn();
	bodyScroll.disable = jest.fn();
	DOM = importFresh('../../helpers/bodyScroll');
});

afterEach(() => {
	jest.resetModules();
});

describe('scrollLock', () => {
	beforeEach(() => {
		DOM.scrollLock();
	});

	test('disables body scroll', () => {
		expect(bodyScroll.disable).toHaveBeenCalled();
	});

	test('does not disable body scroll again on subsequent calls', () => {
		DOM.scrollLock();
		expect(bodyScroll.disable).toHaveBeenCalledTimes(1);
	});
});

describe('scrollUnlock', () => {
	test('enables body scroll', () => {
		DOM.scrollUnlock();
		expect(bodyScroll.enable).toHaveBeenCalled();
	});
});
