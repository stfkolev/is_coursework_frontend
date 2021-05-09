import axios from 'axios';

const apiUrl = (endpoint: string) => `https://localhost:44350/api/${endpoint}`;
const ApiRequest = (url: string): Promise<any> => {
	return axios.get(url).then((response) => response.data);
};

export { apiUrl, ApiRequest };
