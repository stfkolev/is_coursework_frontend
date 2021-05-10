import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { Rent } from '../../../models/Rent';
import { Car } from '../../../models/Car';
import { Client } from '../../../models/Client';
import { Company } from '../../../models/Company';
import { GetCars } from '../../../api/CarApi';
import { GetCompanies } from '../../../api/CompanyApi';
import { GetClients } from '../../../api/ClientApi';

interface RentEditFormProps {
	rent: Rent;
	visible: boolean;
	onEdit: (values: Rent) => void;
	onCancel: () => void;
}

const { Option } = Select;

const EditRentModal: React.FC<RentEditFormProps> = ({
	rent,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [cars, setCars] = useState<Car[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);

	useEffect(() => {
		GetCars().then((values) => setCars(values));
		GetClients().then((values) => setClients(values));
		GetCompanies().then((values) => setCompanies(values));
	}, []);

	useEffect(() => {
		form.setFieldsValue({
			id: rent.id,
			pickUpDate: rent.pickUpDate,
			dropOffDate: rent.dropOffDate,
			clientId: rent.clientId,
			carId: rent.carId,
			companyId: rent.companyId,
		});
	}, [form, rent]);

	return (
		<Modal
			visible={visible}
			title='Edit rent'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Rent);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Rent ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>
				<Form.Item
					name='price'
					label='Rent Price'
					rules={[
						{
							required: true,
							message: 'Please input the price of the rent!',
						},
					]}>
					<InputNumber min={1} max={10000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='clientId'
					label='Rent Client'
					rules={[
						{
							required: true,
							message: 'Please input the client of the rent!',
						},
					]}>
					<Select allowClear>
						{clients.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.firstName} {data.lastName}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='carId'
					label='Rent Car'
					rules={[
						{
							required: true,
							message: 'Please input the car of the rent!',
						},
					]}>
					<Select allowClear>
						{cars.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.numberPlate}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='companyId'
					label='Rent Company'
					rules={[
						{
							required: true,
							message: 'Please input the company of the rent!',
						},
					]}>
					<Select allowClear>
						{companies.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='pickUpDate'
					// label='Rent Creation Date'
					rules={[
						{
							required: true,
							message: 'Please input the creation date of the rent!',
						},
					]}>
					{/* <DatePicker style={{ width: '100%' }} /> */}
				</Form.Item>

				<Form.Item
					name='dropOffDate'
					// label='Rent Creation Date'
					rules={[
						{
							required: true,
							message: 'Please input the creation date of the rent!',
						},
					]}>
					{/* <DatePicker style={{ width: '100%' }} /> */}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { EditRentModal };
