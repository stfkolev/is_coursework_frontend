import axios from 'axios';
import { Company } from '../models/Company';
import { apiUrl } from '../utilities/globals';

async function GetCompanies(): Promise<Company[]> {
	const result = await axios
		.get(apiUrl('companies'))
		.then((response) => response.data);

	return result as Company[];
}
async function GetCompanyById(id: bigint): Promise<Company> {
	const result = await axios
		.get(apiUrl('companies') + id)
		.then((response) => response.data);

	return result as Company;
}

async function CreateCompany(data: { name: string }): Promise<Company> {
	const result = await axios
		.post(apiUrl('companies'), data)
		.then((response) => response.data);

	return result as Company;
}

async function DeleteCompany(company: Company): Promise<Company> {
	const result = await axios
		.delete(apiUrl('companies') + `/${company.id}`, {
			data: company,
		})
		.then((response) => response.data);

	return result as Company;
}

async function UpdateCompany(company: Company): Promise<Boolean> {
	const result = await axios
		.put(apiUrl('companies') + `/${company.id}`, company)
		.then((response) => response.status === 204);

	return result as Boolean;
}

export {
	GetCompanies,
	GetCompanyById,
	CreateCompany,
	DeleteCompany,
	UpdateCompany,
};
