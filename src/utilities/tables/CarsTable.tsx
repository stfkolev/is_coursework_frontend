import React, { useEffect, useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Car } from '../../models/Car';
import {
	DeleteCar,
	UpdateCar,
} from '../../api/CarApi';
import { EditCarModal } from '../modals/cars/EditCarModal';
import { GetColors } from '../../api/ColorApi';
import { GetModels } from '../../api/ModelApi';
import { GetEngines } from '../../api/EngineApi';
import { Color } from '../../models/Color';
import { Model } from '../../models/Model';
import { Engine } from '../../models/Engine';


const { Column } = Table;

interface CarsTableProps {
	cars: Car[];
	onDelete: (car: Car) => void;
	onEdit: () => void;
}

const openNotification = (car: Car) => {
	notification['info']({
		message: 'Selected Car',
		description: `You have selected ${car?.numberPlate} car`,
		duration: 2,
	});
};

const CarsTable: React.FC<CarsTableProps> = ({
	cars,
	onEdit,
	onDelete,
}) => {
	const [colors, setColors] = useState<Color[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [engines, setEngines] = useState<Engine[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	useEffect(() => {
		GetColors().then((values) => {
			setColors(values);
		});
		GetModels().then((values) => {
			setModels(values);
		});
		GetEngines().then((values) => {
			setEngines(values);
		});
	}, []);

	const onEditInternal = async (values: Car) => {
		const result = await UpdateCar({
			id: values.id,
			numberPlate: values.numberPlate,
			
			seats: values.seats,
			luggageSpace: values.luggageSpace,
			technicallyApproved: values.technicallyApproved,

			modelId: values.modelId,
			colorId: values.colorId,
			engineId: values.engineId,
		});

		if (result === true) {
			const key = 'carEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the car`,
					key,
					duration: 1,
				});

				onEdit();
			}, 1000);
		}

		setVisible(false);
		setActiveModalId(BigInt(0));
	};
	return (
		<Table dataSource={cars} rowKey='id'>
			<Column
				title='Car ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Number Plate'
				dataIndex='numberPlate'
				sorter={(left: Car, right: Car) => {
					return left.numberPlate.localeCompare(right.numberPlate);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Seats'
				dataIndex='seats'
				sorter={(left: Car, right: Car) => {
					return left.seats - right.seats;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Luggage Space'
				dataIndex='luggageSpace'
				render={(value, record, index) => value ? 'Yes' : 'No'}
				filters={[
					{
						text: 'Yes',
						value: true,
					},
					{
						text: 'No',
						value: false,
					}
				]}
				filterMultiple={false}
				onFilter={(value, record) => {
					return (record as Car).luggageSpace === value
				}}

				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Technically Approved'
				dataIndex='technicallyApproved'
				render={(value, record, index) => value ? 'Yes' : 'No'}
				filters={[
					{
						text: 'Yes',
						value: true,
					},
					{
						text: 'No',
						value: false,
					}
				]}
				filterMultiple={false}
				onFilter={(value, record) => {
					return (record as Car).technicallyApproved === value
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Model'
				dataIndex='modelId'
				render={(value, record, index) => {
					const data = models.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>
			
			<Column
				title='Color'
				dataIndex='colorId'
				render={(value, record, index) => {
					const data = colors.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Engine'
				dataIndex='engineId'
				render={(value, record, index) => {
					const data = engines.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const car = record as Car;

							openNotification(car);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Car) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this car?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteCar(record);

								onDelete(result as Car);
							}}
							onCancel={(event) => {
								console.log(text);
							}}
							okText='Yes, Delete'
							cancelText='No, Cancel'>
							<Button type='dashed' danger>
								Delete
							</Button>
						</Popconfirm>

						<Button
							type='dashed'
							danger
							onClick={() => {
								setActiveModalId(record.id);
								setVisible(true);
							}}
							style={{
								borderColor: '#e67e22',
								color: '#e67e22',
							}}>
							Edit
						</Button>

						{activeModalId === record.id && (
							<EditCarModal
								car={record}
								visible={visible}
								onEdit={onEditInternal}
								onCancel={() => {
									setVisible(false);
								}}
							/>
						)}
					</Space>
				)}
			/>
		</Table>
	);
};

export { CarsTable };
