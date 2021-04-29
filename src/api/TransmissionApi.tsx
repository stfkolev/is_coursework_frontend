import axios from 'axios';
import { Transmission } from '../models/Transmission';
import { apiUrl } from '../utilities/globals';

async function GetTransmissions(): Promise<Transmission[]> {
	const result = await axios
		.get(apiUrl('transmissions'))
		.then((response) => response.data);

	return result as Transmission[];
}
async function GetTransmissionById(id: bigint): Promise<Transmission> {
	const result = await axios
		.get(apiUrl('transmissions') + id)
		.then((response) => response.data);

	return result as Transmission;
}

async function CreateTransmission(data: {
	name: string;
}): Promise<Transmission> {
	const result = await axios
		.post(apiUrl('transmissions'), data)
		.then((response) => response.data);

	return result as Transmission;
}

async function DeleteTransmission(
	transmission: Transmission,
): Promise<Transmission> {
	const result = await axios
		.delete(apiUrl('transmissions') + `/${transmission.id}`, {
			data: transmission,
		})
		.then((response) => response.data);

	return result as Transmission;
}

async function UpdateTransmission(
	transmission: Transmission,
): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('transmissions') + `/${transmission.id}`, transmission)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetTransmissions,
	GetTransmissionById,
	CreateTransmission,
	DeleteTransmission,
	UpdateTransmission,
};
