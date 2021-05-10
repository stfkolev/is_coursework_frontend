import axios from 'axios';
import { Rent } from '../models/Rent';
import { apiUrl } from '../utilities/globals';

async function GetRents(): Promise<Rent[]> {
	const result = await axios
		.get(apiUrl('rents'))
		.then((response) => response.data);

	return result as Rent[];
}
async function GetRentById(id: bigint): Promise<Rent> {
	const result = await axios
		.get(apiUrl('rents') + `/${id}`)
		.then((response) => response.data);

	return result as Rent;
}

async function CreateRent(data: {
	price: number;

	pickUpDate: string;
	dropOffDate: string;

	clientId: bigint;
	carId: bigint;
	companyId: bigint;
}): Promise<Rent> {
	console.log({ data });
	const result = await axios
		.post(apiUrl('rents'), data)
		.then((response) => response.data);

	return result as Rent;
}

async function DeleteRent(rent: Rent): Promise<Rent> {
	const result = await axios
		.delete(apiUrl('rents') + `/${rent.id}`, {
			data: rent,
		})
		.then((response) => response.data);

	return result as Rent;
}

async function UpdateRent(rent: Rent): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('rents') + `/${rent.id}`, rent)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetRents, GetRentById, CreateRent, DeleteRent, UpdateRent };
