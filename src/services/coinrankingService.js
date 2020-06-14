const endpoint = 'https://api.coinranking.com/v1/public/coins';
const params = {
	base: 'GBP',
	sort: 'price',
	timePeriod: '7d'
};

const objectToQueryString = (object) => {
  const keys = Object.keys(object);

  if (!keys.length) {
		return '';
	}
	
	return `?${keys.map(value => `${encodeURIComponent(value)}=${encodeURIComponent(object[value])}`).join('&')}`;
};

const getCoins = async () => {
	const response = await fetch(`${endpoint}${objectToQueryString(params)}`)
										.then(async response => await response.json())
										.then(response => response.data.coins);
	
	return response;
};

exports.default = getCoins;
