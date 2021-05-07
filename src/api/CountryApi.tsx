import axios from 'axios';
import { Country } from '../models/Country';
import { apiUrl } from '../utilities/globals';

async function GetCountries(): Promise<Country[]> {
	const result = await axios
		.get(apiUrl('countries'))
		.then((response) => response.data);

	return result as Country[];
}
async function GetCountryById(id: bigint): Promise<Country> {
	const result = await axios
		.get(apiUrl('countries') + `/${id}`)
		.then((response) => response.data);

	return result as Country;
}

async function CreateCountry(data: {
	name: string;
	code: string;
}): Promise<Country> {
	const result = await axios
		.post(apiUrl('countries'), data)
		.then((response) => response.data);

	return result as Country;
}

async function DeleteCountry(country: Country): Promise<Country> {
	const result = await axios
		.delete(apiUrl('countries') + `/${country.id}`, {
			data: country,
		})
		.then((response) => response.data);

	return result as Country;
}

async function UpdateCountry(country: Country): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('countries') + `/${country.id}`, country)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetCountries,
	GetCountryById,
	CreateCountry,
	DeleteCountry,
	UpdateCountry,
};
