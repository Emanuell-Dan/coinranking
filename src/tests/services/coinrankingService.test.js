require('regenerator-runtime/runtime');
const getCoins = require('../../services/coinrankingService').default;
const fetchMock = require('fetch-mock');

const url = 'https://api.coinranking.com/v1/public/coins?base=GBP&sort=price&timePeriod=7d';

test('fetches data from coinranking endpoint', async () => {
	const expectedResponse = 
	{
		data : {
			coins: [
				{	coinId: '1'	},
				{	coinId: '2'	},
				{	coinId: '3'	}
			]
		}
	};

	fetchMock.mock({
		name: 'route',
		matcher: url,
		method: 'GET',
		response: {
			status: 200,
			body: expectedResponse
		}
	});

	const response = await getCoins();

	expect(fetchMock.called()).toEqual(true);
	expect(fetchMock.calls().length).toEqual(1);
	expect(response).toEqual(expectedResponse.data.coins);
});
