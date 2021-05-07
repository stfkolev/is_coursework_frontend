import axios from 'axios';
import { Fuel } from '../models/Fuel';
import { apiUrl } from '../utilities/globals';

async function GetFuels(): Promise<Fuel[]> {
	const result = await axios
		.get(apiUrl('fuels'))
		.then((response) => response.data);

	return result as Fuel[];
}
async function GetFuelById(id: bigint): Promise<Fuel> {
	const result = await axios
		.get(apiUrl('fuels') + `/${id}`)
		.then((response) => response.data);

	return result as Fuel;
}

async function CreateFuel(data: { name: string }): Promise<Fuel> {
	const result = await axios
		.post(apiUrl('fuels'), data)
		.then((response) => response.data);

	return result as Fuel;
}

async function DeleteFuel(fuel: Fuel): Promise<Fuel> {
	const result = await axios
		.delete(apiUrl('fuels') + `/${fuel.id}`, {
			data: fuel,
		})
		.then((response) => response.data);

	return result as Fuel;
}

async function UpdateFuel(fuel: Fuel): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('fuels') + `/${fuel.id}`, fuel)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetFuels, GetFuelById, CreateFuel, DeleteFuel, UpdateFuel };
