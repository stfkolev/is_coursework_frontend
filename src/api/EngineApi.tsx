import axios from 'axios';
import { Engine } from '../models/Engine';
import { apiUrl } from '../utilities/globals';

async function GetEngines(): Promise<Engine[]> {
	const result = await axios
		.get(apiUrl('engines'))
		.then((response) => response.data);

	return result as Engine[];
}
async function GetEngineById(id: bigint): Promise<Engine> {
	const result = await axios
		.get(apiUrl('engines') + `/${id}`)
		.then((response) => response.data);

	return result as Engine;
}

async function CreateEngine(data: { 	
	name: string,

	displacement: number,
	power: number,
	torque: number,
	cyllinders: number,

	powertrainId: bigint,
	fuelId: bigint,
	transmissionId: bigint,
}): Promise<Engine> {
	const result = await axios
		.post(apiUrl('engines'), data)
		.then((response) => response.data);

	return result as Engine;
}

async function DeleteEngine(engine: Engine): Promise<Engine> {
	const result = await axios
		.delete(apiUrl('engines') + `/${engine.id}`, {
			data: engine,
		})
		.then((response) => response.data);

	return result as Engine;
}

async function UpdateEngine(engine: Engine): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('engines') + `/${engine.id}`, engine)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetEngines, GetEngineById, CreateEngine, DeleteEngine, UpdateEngine };
