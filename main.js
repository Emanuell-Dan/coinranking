document.addEventListener('DOMContentLoaded', () => buildHTML());

// setInterval(() => {
// 	document.querySelectorAll('.coin-list-item').forEach(e => e.parentNode.removeChild(e));
// 	getData();
// }, 60000);

let coins;

const divElement = document.createElement('div');
const listElement = document.createElement('ul');
const listItemElement = document.createElement('li');

// GET data
const getData = async () => {
	const response = await fetch('https://api.coinranking.com/v1/public/coins?base=GBP&sort=price&timePeriod=7d');
	coins = await response.json().then(response => response.data.coins);
	
	buildDataMarkup(coins);
};

const documentCreateElement = (parentEl, childEl, tagName, className, innerHtml) => {
	childEl = document.createElement(tagName);
	childEl.setAttribute('class', className);

	if (innerHtml) {
		childEl.innerHTML = innerHtml;
	}

	parentEl.appendChild(childEl);

	return childEl;
};

const buildHTML = () => {
	const parentContainer = divElement.cloneNode();
	parentContainer.setAttribute('class', 'container');
	document.querySelector('body').appendChild(parentContainer);

	let title;
	title = documentCreateElement(parentContainer, title, 'h1', 'heading', 'Coinranking Cryptocurrency Exchange');

	buildToggleMarkup(parentContainer);

	let coinList;
	coinList = documentCreateElement(parentContainer, coinList, 'div', 'coin-list');
};

const buildToggleMarkup = parent => {
	let sortByPriceWrapper;
	sortByPriceWrapper = documentCreateElement(parent, sortByPriceWrapper, 'div', 'sort-by-price');

	let sortByPriceText;
	sortByPriceText = documentCreateElement(sortByPriceWrapper, sortByPriceText, 'p', 'sort-by-price-text', 'Ordered by descending');

	let sortByPriceLabel;
	sortByPriceLabel = documentCreateElement(sortByPriceWrapper, sortByPriceLabel, 'label', 'sort-by-price-toggle');

	const sortByPriceInput = document.createElement('input');
	sortByPriceInput.setAttribute('class', 'sort-by-price-input');
	sortByPriceInput.setAttribute('type', 'checkbox');
	sortByPriceLabel.appendChild(sortByPriceInput);

	const sortByPriceSlider = document.createElement('span');
	sortByPriceSlider.setAttribute('class', 'sort-by-price-slider');
	sortByPriceSlider.addEventListener('click', toggleView);
	sortByPriceLabel.appendChild(sortByPriceSlider);
};

// Reverse array order and update UI
const toggleView = () => {
	document.querySelectorAll('.coin-list-item').forEach(e => e.parentNode.removeChild(e));
	buildDataMarkup(coins.reverse());
};

const buildDataMarkup = coins => {
	coins.forEach(coin => {
		const coinListItem = listItemElement.cloneNode();
		coinListItem.setAttribute('class', 'coin-list-item');
		coinListItem.addEventListener('click', () => buildModalMarkup(coin));
		document.querySelector('.coin-list').appendChild(coinListItem);

		const coinNameWrapper = divElement.cloneNode();
		coinNameWrapper.setAttribute('class', 'coin-name-wrapper');
		coinListItem.appendChild(coinNameWrapper);

		const coinImage = document.createElement('img');
		coinImage.setAttribute('src', coin.iconUrl);
		coinImage.setAttribute('alt', coin.name);
		coinImage.setAttribute('class', 'coin-image');
		coinNameWrapper.appendChild(coinImage);

		const coinName = document.createElement('h3');
		coinName.setAttribute('class', 'coin-name');
		coinName.innerHTML = coin.name;
		coinNameWrapper.appendChild(coinName);

		const coinSymbol = document.createElement('p');
		coinSymbol.setAttribute('class', 'coin-symbol');
		coinSymbol.innerHTML = coin.symbol;
		coinNameWrapper.appendChild(coinSymbol);

		const coinPricesWrapper = divElement.cloneNode();
		coinPricesWrapper.setAttribute('class', 'coin-price-wrapper');
		coinListItem.appendChild(coinPricesWrapper);

		const currentPrice = document.createElement('h3');
		currentPrice.setAttribute('class', 'coin-price');
		currentPrice.innerHTML = Number(coin.price).toFixed(2);
		coinPricesWrapper.appendChild(currentPrice);

		const dailyRate = document.createElement('p');
		dailyRate.setAttribute('class', 'coin-daily-rate');
		dailyRate.classList.add(dailyRateDynamicClass(coin.change));
		dailyRate.innerHTML = coin.change > 0 ? `+${coin.change}` : coin.change;
		coinPricesWrapper.appendChild(dailyRate);
	});
};

// Adds classes dynamically based on coin daily fluctuation
const dailyRateDynamicClass = value => {
	return value > 0 ? 'coin-daily-rate-green' : 'coin-daily-rate-red';
};

const buildModalMarkup = coin => {
	const modalWrapper = divElement.cloneNode();
	modalWrapper.setAttribute('class', 'modal');
	document.querySelector('.container').appendChild(modalWrapper);

	const overlay = document.createElement('span');
	overlay.setAttribute('class', 'overlay');
	overlay.addEventListener('click', dismissModal);
	document.querySelector('.container').appendChild(overlay);

	const modalCoinheading = divElement.cloneNode();
	modalCoinheading.setAttribute('class', 'modal-coin-heading');
	modalWrapper.appendChild(modalCoinheading);

	const modalCoinIcon = document.createElement('img');
	modalCoinIcon.setAttribute('src', coin.iconUrl);
	modalCoinIcon.setAttribute('alt', coin.name);
	modalCoinIcon.setAttribute('class', 'modal-coin-icon');
	modalCoinheading.appendChild(modalCoinIcon);

	const modalCoinTitle = document.createElement('h2');
	modalCoinTitle.setAttribute('class', 'modal-coin-title');
	modalCoinTitle.innerHTML = `${coin.name} (${coin.symbol})`;
	modalCoinheading.appendChild(modalCoinTitle);

	const modalCoinDescription = document.createElement('p');
	modalCoinDescription.setAttribute('class', 'modal-coin-description');
	modalCoinDescription.innerHTML = coin.description;
	modalWrapper.appendChild(modalCoinDescription);

	const modalCoinLegend = document.createElement('h3');
	modalCoinLegend.setAttribute('class', 'modal-coin-legend');
	modalCoinLegend.innerHTML = 'Further Information:';
	modalWrapper.appendChild(modalCoinLegend);

	const modalCoinDetails = listElement.cloneNode();
	modalCoinDetails.setAttribute('class', 'modal-coin-details');
	modalWrapper.appendChild(modalCoinDetails);

	const modalCoinLaunchDate = listItemElement.cloneNode();
	modalCoinLaunchDate.setAttribute('class', 'modal-coin-entry');
	modalCoinLaunchDate.innerHTML = `First seen on: ${convertToDateString(coin.firstSeen)}`;
	modalCoinDetails.appendChild(modalCoinLaunchDate);

	const totalSupply = listItemElement.cloneNode();
	totalSupply.setAttribute('class', 'modal-coin-entry');
	totalSupply.innerHTML = `Total Supply: ${numberWithCommas(numberWithCommas(coin.totalSupply))}`;
	modalCoinDetails.appendChild(totalSupply);

	const modalCoinCirculatingSupply = listItemElement.cloneNode();
	modalCoinCirculatingSupply.setAttribute('class', 'modal-coin-entry');
	modalCoinCirculatingSupply.innerHTML = `Circulating Supply: ${numberWithCommas(coin.circulatingSupply)}`;
	modalCoinDetails.appendChild(modalCoinCirculatingSupply);

	const modalCoinMarketCap = listItemElement.cloneNode();
	modalCoinMarketCap.setAttribute('class', 'modal-coin-entry');
	modalCoinMarketCap.innerHTML = `Market Cap: ${numberWithCommas(coin.marketCap)}`;
	modalCoinDetails.appendChild(modalCoinMarketCap);

	const modalCoinVolume = listItemElement.cloneNode();
	modalCoinVolume.setAttribute('class', 'modal-coin-entry');
	modalCoinVolume.innerHTML = `Volume: ${numberWithCommas(coin.price)}`;
	modalCoinDetails.appendChild(modalCoinVolume);

	const modalCoinCurrentPrice = listItemElement.cloneNode();
	modalCoinCurrentPrice.setAttribute('class', 'modal-coin-entry');
	modalCoinCurrentPrice.innerHTML = `Current Price: ${numberWithCommas(coin.volume)}`;
	modalCoinDetails.appendChild(modalCoinCurrentPrice);

	const modalCoinNumberOfExchanges = listItemElement.cloneNode();
	modalCoinNumberOfExchanges.setAttribute('class', 'modal-coin-entry');
	modalCoinNumberOfExchanges.innerHTML = `Number of Exchanges: ${coin.numberOfExchanges}`;
	modalCoinDetails.appendChild(modalCoinNumberOfExchanges);

	const modalCoinNumberOfMarkets = listItemElement.cloneNode();
	modalCoinNumberOfMarkets.setAttribute('class', 'modal-coin-entry');
	modalCoinNumberOfMarkets.innerHTML = `Number of Markets: ${coin.numberOfMarkets}`;
	modalCoinDetails.appendChild(modalCoinNumberOfMarkets);

	// link to website
	// social links
};

const dismissModal = () => {
	document.querySelector('.modal').remove();
	document.querySelector('.overlay').remove();
};

const convertToDateString = value => {
	value = new Date(value);
  return value.toDateString();
};

const numberWithCommas = value => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

getData();
