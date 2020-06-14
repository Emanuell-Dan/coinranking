require('regenerator-runtime/runtime');
const bodyScroll = require('./helpers/bodyScroll');
const getCoins = require('./services/coinrankingService').default;
const documentCreateElement = require('./helpers/documentCreateElement').default;
const convertToDateString = require('./helpers/convertToDateString').default;
const numberWithCommas = require('./helpers/numberWithCommas').default;

document.addEventListener('DOMContentLoaded', () => buildHTML());

//Fetch new data every minute and update the UI
setInterval(() => {
	document.querySelectorAll('.coin-card').forEach(e => e.parentNode.removeChild(e));
	fetchData();
}, 60000);

let coins;

const fetchData = async () => {
	coins = await getCoins();
	buildCoinsList(coins);
}

const buildHTML = () => {
	const container = document.querySelector('.app');

	let heading;
	heading = documentCreateElement(container, heading, 'h1', {class: 'heading'}, 'Coinranking Cryptocurrency Exchange');

	buildToggleMarkup(container);

	let coinCardWrapper;
	coinCardWrapper = documentCreateElement(container, coinCardWrapper, 'div', {class: 'coin-card-wrapper'});
};

const buildToggleMarkup = container => {
	let toggle;
	toggle = documentCreateElement(container, toggle, 'div', {class: 'toggle'});

	let toggleText;
	toggleText = documentCreateElement(toggle, toggleText, 'p', {class: 'toggle__text'}, 'Ordered by descending');

	let toggleLabel;
	toggleLabel = documentCreateElement(toggle, toggleLabel, 'label', {class: 'toggle__label'});

	let toggleInput;
	toggleInput = documentCreateElement(toggleLabel, toggleInput, 'input', {class: 'toggle__input', type: 'checkbox'});

	let toggleSlider;
	toggleSlider = documentCreateElement(toggleLabel, toggleSlider, 'span', {class: 'toggle__slider'}, null, {type: 'click', listener: toggleView});
};

// Reverse array order and update UI
const toggleView = () => {
	document.querySelectorAll('.coin-card').forEach(e => e.parentNode.removeChild(e));
	buildCoinsList(coins.reverse());
};

const buildCoinsList = async coins => {
	coins.forEach(coin => {
		const coinCardWrapper = document.querySelector('.coin-card-wrapper');

		let coinCard;
		coinCard = documentCreateElement(coinCardWrapper, coinCard, 'div', {class: 'coin-card'}, null, {type: 'click', listener: () => {
			bodyScroll.scrollLock();
			buildModalMarkup(coin);
		}});

		let coinCardNameWrapper;
		coinCardNameWrapper = documentCreateElement(coinCard, coinCardNameWrapper, 'div', {class: 'coin-card__name-wrapper'});

		let coinCardImage;
		coinCardImage = documentCreateElement(coinCardNameWrapper, coinCardImage, 'img', {src: coin.iconUrl, alt: coin.name, class: 'coin-card__image'});

		let coinCardName;
		coinCardName = documentCreateElement(coinCardNameWrapper, coinCardName, 'h3', {class: 'coin-card__name'}, coin.name);

		let coinCardSymbol;
		coinCardSymbol = documentCreateElement(coinCardNameWrapper, coinCardSymbol, 'p', {class: 'coin-card__symbol'}, coin.symbol);

		let coinCardPriceWrapper;
		coinCardPriceWrapper = documentCreateElement(coinCard, coinCardSymbol, 'div', {class: 'coin-card__price-wrapper'});

		let coinCardPrice;
		coinCardPrice = coinName = documentCreateElement(coinCardPriceWrapper, coinCardPrice, 'h3', {class: 'coin-card__price'}, Number(coin.price).toFixed(2));

		let coinCardDailyRate;
		coinCardDailyRate = documentCreateElement(coinCardPriceWrapper, coinCardDailyRate, 'p', {class: `coin-card__daily-rate ${dailyRateDynamicClass(coin.change)}`}, isDailyRatePositive(coin.change));
	});
};

// Adds classes dynamically based on coin daily fluctuation
const dailyRateDynamicClass = value => {
	return value > 0 ? 'coin-card__daily-rate--green' : 'coin-card__daily-rate--red';
};

const isDailyRatePositive = coinValue => {
	return coinValue > 0 ? `+${coinValue}` : coinValue;
};

const buildModalMarkup = coin => {
	const container = document.querySelector('.app');

	let modal;
	modal = documentCreateElement(container, modal, 'div', {class: 'modal'});

	let overlay;
	overlay = documentCreateElement(container, overlay, 'span', {class: 'overlay'}, null, {type: 'click', listener: dismissModal});

	let modalHeading;
	modalHeading = documentCreateElement(modal, modalHeading, 'div', {class: 'modal__heading'});

	let closeModal;
	closeModal = documentCreateElement(modalHeading, closeModal, 'span', {class: 'modal__close'}, 'Go Back', {type: 'click', listener: dismissModal});

	let modalIcon;
	modalIcon = documentCreateElement(modalHeading, modalIcon, 'img', {src: coin.iconUrl, alt: coin.name, class: 'modal__icon'});

	let modalTitle;
	modalTitle = documentCreateElement(modalHeading, modalTitle, 'h1', {class: 'modal__title'}, `${coin.name} (${coin.symbol})`);

	let modalSection;
	let modalSubheading;

	if (coin.description) {
		modalSection = documentCreateElement(modal, modalSection, 'section', {class: 'modal__section'});
		modalSubheading = documentCreateElement(modalSection, modalSubheading, 'h2', {class: 'modal__subheading'}, 'About');
		
		let modalDescription;
		modalDescription = documentCreateElement(modalSection, modalDescription, 'p', {class: 'modal__description'}, coin.description);	
	}

	modalSection = documentCreateElement(modal, modalSection, 'section', {class: 'modal__section'});
	modalSubheading = documentCreateElement(modalSection, modalSubheading, 'h2', {class: 'modal__subheading'}, 'Further Information');

	let modalDetails;
	modalDetails = documentCreateElement(modalSection, modalDetails, 'ul', {class: 'modal__details'});

	const entries = [
		`First seen on: ${convertToDateString(coin.firstSeen)}`,
		`Total Supply: ${numberWithCommas(numberWithCommas(coin.totalSupply))}`,
		`Circulating Supply: ${numberWithCommas(coin.circulatingSupply)}`,
		`Market Cap: ${numberWithCommas(coin.marketCap)}`,
		`Volume: ${numberWithCommas(coin.price)}`,
		`Current Price: ${numberWithCommas(coin.volume)}`,
		`Number of Exchanges: ${coin.numberOfExchanges}`,
		`Number of Markets: ${coin.numberOfMarkets}`
	];
	let modalDetailEntry;

	entries.forEach(entry => {
		documentCreateElement(modalDetails, modalDetailEntry, 'li', {class: 'modal__detail-entry'}, entry);
	});

	let modalLinks;
	let modalLinkEntry;
	let modalLinkAnchor;

	if (coin.links.length) {
		modalSection = documentCreateElement(modal, modalSection, 'section', {class: 'modal__section'});
		modalSubheading = documentCreateElement(modalSection, modalSubheading, 'h2', {class: 'modal__subheading'}, 'Official links');
		
		let modalLinks;
		modalLinks = documentCreateElement(modalSection, modalLinks, 'ul', {class: 'modal__official-links'});

		let modalLinkEntry;
		let modalLinkAnchor;

		coin.links.forEach(link => {
			modalLinkEntry = documentCreateElement(modalLinks, modalLinkEntry, 'li', {class: 'modal__link-entry'});
			documentCreateElement(modalLinkEntry, modalLinkAnchor, 'a', {href: link.url, target: '_blank', rel: 'noreferrer', name: name, class: 'modal__link-anchor'}, link.name);
		});
	}

	if (coin.socials.length) {
		modalSection = documentCreateElement(modal, modalSection, 'section', {class: 'modal__section'});
		modalSubheading = documentCreateElement(modalSection, modalSubheading, 'h2', {class: 'modal__subheading'}, 'Social links');
		modalLinks = documentCreateElement(modalSection, modalLinks, 'ul', {class: 'modal__social-links'});
		
		coin.socials.forEach(link => {
			modalLinkEntry = documentCreateElement(modalLinks, modalLinkEntry, 'li', {class: 'modal__link-entry'});
			documentCreateElement(modalLinkEntry, modalLinkAnchor, 'a', {href: link.url, target: '_blank', rel: 'noreferrer', name: name, class: 'modal__link-anchor'}, link.name);
		});
	}
};

const dismissModal = () => {
	document.querySelector('.modal').remove();
	document.querySelector('.overlay').remove();
	bodyScroll.scrollUnlock();
};

fetchData();
