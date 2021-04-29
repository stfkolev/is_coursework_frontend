import axios from 'axios';

const apiUrl = (endpoint: string) => `https://localhost:49159/api/${endpoint}`;
const ApiRequest = (url: string): Promise<any> => {
	return axios.get(url).then((response) => response.data);
};

export { apiUrl, ApiRequest };
