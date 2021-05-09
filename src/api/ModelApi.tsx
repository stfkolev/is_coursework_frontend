import axios from 'axios';
import { Model } from '../models/Model';
import { apiUrl } from '../utilities/globals';

async function GetModels(): Promise<Model[]> {
	const result = await axios
		.get(apiUrl('models'))
		.then((response) => response.data);

	return result as Model[];
}
async function GetModelById(id: bigint): Promise<Model> {
	const result = await axios
		.get(apiUrl('models') + `/${id}`)
		.then((response) => response.data);

	return result as Model;
}

async function CreateModel(data: { name: string, manufacturerId: number, carTypeId: number }): Promise<Model> {
	const result = await axios
		.post(apiUrl('models'), data)
		.then((response) => response.data);

	return result as Model;
}

async function DeleteModel(model: Model): Promise<Model> {
	const result = await axios
		.delete(apiUrl('models') + `/${model.id}`, {
			data: model,
		})
		.then((response) => response.data);

	return result as Model;
}

async function UpdateModel(model: Model): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('models') + `/${model.id}`, model)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetModels, GetModelById, CreateModel, DeleteModel, UpdateModel };
