import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber } from 'antd';
import { Car } from '../../../models/Car';
import { Client } from '../../../models/Client';
import { Company } from '../../../models/Company';
import { GetCars } from '../../../api/CarApi';
import { GetCompanies } from '../../../api/CompanyApi';
import { GetClients } from '../../../api/ClientApi';
import moment from 'moment';

export interface Values {
	price: number;

	pickUpDate: Date;
	dropOffDate: Date;

	clientId: bigint;
	carId: bigint;
	companyId: bigint;
}

interface RentCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const { Option } = Select;

const CreateRentModal: React.FC<RentCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [cars, setCars] = useState<Car[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	useEffect(() => {
		GetCars().then((values) => setCars(values));
		GetClients().then((values) => setClients(values));
		GetCompanies().then((values) => setCompanies(values));
	}, []);

	return (
		<Modal
			visible={visible}
			title='Create a new rent'
			okText='Create'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onCreate(values as Values);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='price'
					label='Rent Price'
					rules={[
						{
							required: true,
							message: 'Please input the price of the rent!',
						},
					]}>
					<InputNumber min={1.0} max={10000.0} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='pickUpDate'
					label='Rent Pick-up Date'
					rules={[
						{
							required: true,
							message: 'Please input the pick-up date of the rent!',
						},
					]}>
					<DatePicker
						defaultValue={moment()}
						style={{ width: '100%' }}
						onSelect={(value) => {
							setSelectedDate(moment(value).toDate());
							console.log({ value });
						}}
					/>
				</Form.Item>

				<Form.Item
					name='dropOffDate'
					label='Rent Drop-off Date'
					rules={[
						{
							required: true,
							message: 'Please input the drop-off date of the rent!',
						},
					]}>
					<DatePicker
						style={{ width: '100%' }}
						disabledDate={(current) => {
							return current && current < moment(selectedDate).startOf('day');
						}}
					/>
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
			</Form>
		</Modal>
	);
};

export { CreateRentModal };
