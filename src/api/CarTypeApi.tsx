import axios from 'axios';
import { CarType } from '../models/CarType';
import { apiUrl } from '../utilities/globals';

async function GetCarTypes(): Promise<CarType[]> {
	const result = await axios
		.get(apiUrl('carTypes'))
		.then((response) => response.data);

	return result as CarType[];
}
async function GetCarTypeById(id: bigint): Promise<CarType> {
	const result = await axios
		.get(apiUrl('carTypes') + `/${id}`)
		.then((response) => response.data);

	return result as CarType;
}

async function CreateCarType(data: { name: string }): Promise<CarType> {
	const result = await axios
		.post(apiUrl('carTypes'), data)
		.then((response) => response.data);

	return result as CarType;
}

async function DeleteCarType(carType: CarType): Promise<CarType> {
	const result = await axios
		.delete(apiUrl('carTypes') + `/${carType.id}`, {
			data: carType,
		})
		.then((response) => response.data);

	return result as CarType;
}

async function UpdateCarType(carType: CarType): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('carTypes') + `/${carType.id}`, carType)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetCarTypes,
	GetCarTypeById,
	CreateCarType,
	DeleteCarType,
	UpdateCarType,
};
