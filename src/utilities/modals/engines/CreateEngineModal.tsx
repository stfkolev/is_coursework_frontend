import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { Powertrain } from '../../../models/Powertrain';
import { Fuel } from '../../../models/Fuel';
import { Transmission } from '../../../models/Transmission';
import { GetPowertrains } from '../../../api/PowertrainApi';
import { GetFuels } from '../../../api/FuelApi';
import { GetTransmissions } from '../../../api/TransmissionApi';

export interface Values {
	name: string;

	displacement: number;
	power: number;
	torque: number;
	cyllinders: number;

	powerTrainId: bigint;
	fuelId: bigint;
	transmissionId: bigint;
}

interface EngineCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const { Option } = Select;

const CreateEngineModal: React.FC<EngineCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [powertrains, setPowertrains] = useState<Powertrain[]>([]);
	const [fuels, setFuels] = useState<Fuel[]>([]);
	const [transmissions, setTransmissions] = useState<Transmission[]>([]);

	useEffect(() => {
		GetPowertrains().then((values) => setPowertrains(values));
		GetFuels().then((values) => setFuels(values));
		GetTransmissions().then((values) => setTransmissions(values));
	}, []);

	return (
		<Modal
			visible={visible}
			title='Create a new engine'
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
					name='name'
					label='Engine Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the engine!',
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='displacement'
					label='Engine Displacement'
					rules={[
						{
							required: true,
							message: 'Please input the displacement of the engine!',
						},
					]}>
					<InputNumber min={500} max={15000} style={{width: '100%'}} />
				</Form.Item>

				<Form.Item
					name='power'
					label='Engine Power'
					rules={[
						{
							required: true,
							message: 'Please input the power of the engine!',
						},
					]}>
					<InputNumber min={50} max={3000} style={{width: '100%'}} />
				</Form.Item>

				<Form.Item
					name='torque'
					label='Engine Torque'
					rules={[
						{
							required: true,
							message: 'Please input the torque of the engine!',
						},
					]}>
					<InputNumber min={70} max={3000} style={{width: '100%'}} />
				</Form.Item>

				<Form.Item
					name='cyllinders'
					label='Engine Cyllinders'
					rules={[
						{
							required: true,
							message: 'Please input the cyllinders of the engine!',
						},
					]}>
					<InputNumber min={3} max={16} style={{width: '100%'}} />
				</Form.Item>

				<Form.Item
					name='powerTrainId'
					label='Engine Powertrain'
					rules={[
						{
							required: true,
							message: 'Please input the powertrain of the engine!',
						},
					]}>
					<Select allowClear>
						{powertrains.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='fuelId'
					label='Engine Fuel'
					rules={[
						{
							required: true,
							message: 'Please input the fuel of the engine!',
						},
					]}>
					<Select allowClear>
						{fuels.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='transmissionId'
					label='Engine Transmission'
					rules={[
						{
							required: true,
							message: 'Please input the transmission of the engine!',
						},
					]}>
					<Select allowClear>
						{transmissions.map((data) => (
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

export { CreateEngineModal };
