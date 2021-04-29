import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { CarType } from '../../models/CarType';
import { DeleteCarType, UpdateCarType } from '../../api/CarTypeApi';
import { EditCarTypeModal } from '../modals/EditCarTypeModal';

const { Column } = Table;

interface CarTypesTableProps {
	carTypes: CarType[];
	onDelete: (carType: CarType) => void;
	onEdit: () => void;
}

const openNotification = (carType: CarType) => {
	notification['info']({
		message: 'Selected Car Type',
		description: `You have selected ${carType?.name} car type`,
		duration: 2,
	});
};

const CarTypesTable: React.FC<CarTypesTableProps> = ({
	carTypes,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: CarType) => {
		const result = await UpdateCarType({ id: values.id, name: values.name });

		if (result === true) {
			const key = 'carTypeEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the car type name to '${values.name}'`,
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
		<Table dataSource={carTypes} rowKey='id'>
			<Column
				title='Car Type ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as CarType;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: CarType, right: CarType) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const carType = record as CarType;

							openNotification(carType);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: CarType) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this car type?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteCarType(record);

								onDelete(result as CarType);
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
							style={{ borderColor: '#e67e22', color: '#e67e22' }}>
							Edit
						</Button>

						{activeModalId === record.id && (
							<EditCarTypeModal
								carType={record}
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

export { CarTypesTable };
