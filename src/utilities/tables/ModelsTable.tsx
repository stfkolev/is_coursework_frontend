import React, { useEffect, useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Model } from '../../models/Model';
import {
	DeleteModel,
	UpdateModel,
} from '../../api/ModelApi';
import { EditModelModal } from '../modals/models/EditModelModal';
import { Manufacturer } from '../../models/Manufacturer';
import { CarType } from '../../models/CarType';
import { GetManufacturers } from '../../api/ManufacturerApi';
import { GetCarTypes } from '../../api/CarTypeApi';

const { Column } = Table;

interface ModelsTableProps {
	models: Model[];
	onDelete: (model: Model) => void;
	onEdit: () => void;
}

const openNotification = (model: Model) => {
	notification['info']({
		message: 'Selected Model',
		description: `You have selected ${model?.name} model`,
		duration: 2,
	});
};

const ModelsTable: React.FC<ModelsTableProps> = ({
	models,
	onEdit,
	onDelete,
}) => {
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [carTypes, setCarTypes] = useState<CarType[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	useEffect(() => {
		GetManufacturers().then((values) => {
			setManufacturers(values);
		});
		GetCarTypes().then((values) => {
			setCarTypes(values);
		});
	}, []);

	const onEditInternal = async (values: Model) => {
		const result = await UpdateModel({
			id: values.id,
			name: values.name,
			manufacturerId: values.manufacturerId,
			carTypeId: values.carTypeId,
		});

		if (result === true) {
			const key = 'modelEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the model name to '${values.name}'`,
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
		<Table dataSource={models} rowKey='id'>
			<Column
				title='Model ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const model = record as Model;

							openNotification(model);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Model, right: Model) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const model = record as Model;

							openNotification(model);
						},
					};
				}}
			/>

			<Column
				title='Manufacturer'
				dataIndex='manufacturerId'
				render={(value, record, index) => {
					const data = manufacturers.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const model = record as Model;

							openNotification(model);
						},
					};
				}}
			/>

			<Column
				title='Car Type'
				dataIndex='carTypeId'
				render={(value, record, index) => {
					const data = carTypes.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const model = record as Model;

							openNotification(model);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Model) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this model?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteModel(record);

								onDelete(result as Model);
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
							<EditModelModal
								model={record}
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

export { ModelsTable };
