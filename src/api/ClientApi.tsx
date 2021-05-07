import axios from 'axios';
import { Client } from '../models/Client';
import { apiUrl } from '../utilities/globals';

async function GetClients(): Promise<Client[]> {
	const result = await axios
		.get(apiUrl('clients'))
		.then((response) => response.data);

	return result as Client[];
}
async function GetClientById(id: bigint): Promise<Client> {
	const result = await axios
		.get(apiUrl('clients') + `/${id}`)
		.then((response) => response.data);

	return result as Client;
}

async function CreateClient(data: {
	firstName: string;
	lastName: string;
	address: string;
	ucn: string;
	license: string;
	licenseExpiryDate: Date;
}): Promise<Client> {
	const result = await axios
		.post(apiUrl('clients'), data)
		.then((response) => response.data);

	return result as Client;
}

async function DeleteClient(client: Client): Promise<Client> {
	const result = await axios
		.delete(apiUrl('clients') + `/${client.id}`, {
			data: client,
		})
		.then((response) => response.data);

	return result as Client;
}

async function UpdateClient(client: Client): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('clients') + `/${client.id}`, client)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export { GetClients, GetClientById, CreateClient, DeleteClient, UpdateClient };
