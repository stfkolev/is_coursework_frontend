import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, InputNumber } from 'antd';
import { Car } from '../../../models/Car';
import { Client } from '../../../models/Client';
import { Company } from '../../../models/Company';
import { GetCarById, GetCars } from '../../../api/CarApi';
import { GetCompanies } from '../../../api/CompanyApi';
import { GetClients } from '../../../api/ClientApi';
import moment from 'moment';
import { prices } from '../../globals';
import { GetEngineById } from '../../../api/EngineApi';
import { Engine } from '../../../models/Engine';
import { GetRents } from '../../../api/RentApi';
import { Rent } from '../../../models/Rent';

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

const isAvailableForRent = (car: Car, rents: Rent[]) => {
	const result = rents.some((obj) => {
		const expr =
			moment().isBetween(obj.pickUpDate, obj.dropOffDate) &&
			car.id === obj.carId;

		// console.log(
		// 	`${obj.carId} -- ${obj.pickUpDate} -- ${
		// 		obj.dropOffDate
		// 	} -- ${!moment().isBetween(obj.pickUpDate, obj.dropOffDate)} -- -- ${
		// 		car.id
		// 	} ${obj.carId !== car.id}`,
		// );

		// console.log(`carId === car.id: ${obj.carId === car.id} -- expr: ${expr}`);

		return expr;
	});

	return !result;
};

const CreateRentModal: React.FC<RentCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [rents, setRents] = useState<Rent[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [dropOffDate, setDropOffDate] = useState<Date>(new Date());
	const [price, setPrice] = useState(0.0);

	useEffect(() => {
		GetCars().then((values) => setCars(values));
		GetClients().then((values) => setClients(values));
		GetCompanies().then((values) => setCompanies(values));
		GetRents().then((values) => setRents(values));
	}, [price]);

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
					<InputNumber
						min={1.0}
						max={10000.0}
						style={{ width: '100%' }}
						value={price}
						disabled
					/>
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
						disabledDate={(current) => {
							return current < moment();
						}}
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
						onSelect={(current) => {
							setDropOffDate(moment(current).toDate());
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
					<Select
						allowClear
						onSelect={(value: number) => {
							GetCarById(value).then((car: Car) => {
								let calculatePrice = 0.0;

								calculatePrice += car.seats * prices.pricePerSeat;
								calculatePrice += car.luggageSpace
									? prices.priceForLuggaceSpace
									: 0.0;

								GetEngineById(car.engineId).then((engine: Engine) => {
									calculatePrice +=
										(engine.displacement / 1000) *
										prices.pricePerLiterDisplacement;
									calculatePrice += engine.power * prices.pricePerHorsepower;

									const dateDiffInDays = moment(dropOffDate).diff(
										selectedDate,
										'days',
									);
									setPrice(calculatePrice * dateDiffInDays);

									console.log({ price });

									form.setFieldsValue({ price: price });
								});
							});
						}}>
						{cars.map((data) => {
							if (isAvailableForRent(data, rents)) {
								return (
									<Option
										key={data.id.toString()}
										value={Number.parseInt(data.id.toString())}>
										{data.numberPlate}
									</Option>
								);
							}
						})}
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
