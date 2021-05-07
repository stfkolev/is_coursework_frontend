import axios from 'axios';
import { Color } from '../models/Color';
import { apiUrl } from '../utilities/globals';

async function GetColors(): Promise<Color[]> {
	const result = await axios
		.get(apiUrl('colors'))
		.then((response) => response.data);

	return result as Color[];
}
async function GetColorById(id: bigint): Promise<Color> {
	const result = await axios
		.get(apiUrl('colors') + `/${id}`)
		.then((response) => response.data);

	return result as Color;
}

async function CreateColor(data: { name: string }): Promise<Color> {
	const result = await axios
		.post(apiUrl('colors'), data)
		.then((response) => response.data);

	return result as Color;
}

async function DeleteColor(color: Color): Promise<Color> {
	const result = await axios
		.delete(apiUrl('colors') + `/${color.id}`, {
			data: color,
		})
		.then((response) => response.data);

	return result as Color;
}

async function UpdateColor(color: Color): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('colors') + `/${color.id}`, color)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetColors, GetColorById, CreateColor, DeleteColor, UpdateColor };
