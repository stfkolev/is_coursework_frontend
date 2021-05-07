import axios from 'axios';
import { Manufacturer } from '../models/Manufacturer';
import { apiUrl } from '../utilities/globals';

async function GetManufacturers(): Promise<Manufacturer[]> {
	const result = await axios
		.get(apiUrl('manufacturers'))
		.then((response) => response.data);

	return result as Manufacturer[];
}
async function GetManufacturerById(id: bigint): Promise<Manufacturer> {
	const result = await axios
		.get(apiUrl('manufacturers') + `/${id}`)
		.then((response) => response.data);

	return result as Manufacturer;
}

async function CreateManufacturer(data: {
	name: string;
	createdAt: string;
	countryId: number;
}): Promise<Manufacturer> {
	console.log({ data });
	const result = await axios
		.post(apiUrl('manufacturers'), data)
		.then((response) => response.data);

	return result as Manufacturer;
}

async function DeleteManufacturer(
	manufacturer: Manufacturer,
): Promise<Manufacturer> {
	const result = await axios
		.delete(apiUrl('manufacturers') + `/${manufacturer.id}`, {
			data: manufacturer,
		})
		.then((response) => response.data);

	return result as Manufacturer;
}

async function UpdateManufacturer(
	manufacturer: Manufacturer,
): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('manufacturers') + `/${manufacturer.id}`, manufacturer)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetManufacturers,
	GetManufacturerById,
	CreateManufacturer,
	DeleteManufacturer,
	UpdateManufacturer,
};
