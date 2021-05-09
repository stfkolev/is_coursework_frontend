import axios from 'axios';
import { Car } from '../models/Car';
import { apiUrl } from '../utilities/globals';

async function GetCars(): Promise<Car[]> {
	const result = await axios
		.get(apiUrl('cars'))
		.then((response) => response.data);

	return result as Car[];
}
async function GetCarById(id: bigint): Promise<Car> {
	const result = await axios
		.get(apiUrl('cars') + `/${id}`)
		.then((response) => response.data);

	return result as Car;
}

async function CreateCar(data: { 	
	numberPlate: string,

	seats: number,
	luggageSpace: boolean,
	technicallyApproved: boolean,

	modelId: bigint,
	colorId: bigint,
	engineId: bigint,
}): Promise<Car> {
	const result = await axios
		.post(apiUrl('cars'), data)
		.then((response) => response.data);

	return result as Car;
}

async function DeleteCar(car: Car): Promise<Car> {
	const result = await axios
		.delete(apiUrl('cars') + `/${car.id}`, {
			data: car,
		})
		.then((response) => response.data);

	return result as Car;
}

async function UpdateCar(car: Car): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('cars') + `/${car.id}`, car)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetCars,
	GetCarById,
	CreateCar,
	DeleteCar,
	UpdateCar,
};
