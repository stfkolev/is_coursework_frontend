import axios from 'axios';

const apiUrl = (endpoint: string) => `https://localhost:49155/api/${endpoint}`;
const ApiRequest = (url: string): Promise<any> => {
	return axios.get(url).then((response) => response.data);
};

const prices = {
	pricePerSeat: 1.53,
	pricePerLiterDisplacement: 4.23,
	pricePerHorsepower: 0.11,
	priceForLuggaceSpace: 4.91,
};

export { apiUrl, ApiRequest, prices };
