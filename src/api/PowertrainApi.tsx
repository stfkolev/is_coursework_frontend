import axios from 'axios';
import { Powertrain } from '../models/Powertrain';
import { apiUrl } from '../utilities/globals';

async function GetPowertrains(): Promise<Powertrain[]> {
	const result = await axios
		.get(apiUrl('powertrains'))
		.then((response) => response.data);

	return result as Powertrain[];
}
async function GetPowertrainById(id: bigint): Promise<Powertrain> {
	const result = await axios
		.get(apiUrl('powertrains') + `/${id}`)
		.then((response) => response.data);

	return result as Powertrain;
}

async function CreatePowertrain(data: { name: string }): Promise<Powertrain> {
	const result = await axios
		.post(apiUrl('powertrains'), data)
		.then((response) => response.data);

	return result as Powertrain;
}

async function DeletePowertrain(powertrain: Powertrain): Promise<Powertrain> {
	const result = await axios
		.delete(apiUrl('powertrains') + `/${powertrain.id}`, {
			data: powertrain,
		})
		.then((response) => response.data);

	return result as Powertrain;
}

async function UpdatePowertrain(powertrain: Powertrain): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('powertrains') + `/${powertrain.id}`, powertrain)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetPowertrains,
	GetPowertrainById,
	CreatePowertrain,
	DeletePowertrain,
	UpdatePowertrain,
};
