import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Fuel } from '../../models/Fuel';
import { DeleteFuel, UpdateFuel } from '../../api/FuelApi';
import { EditFuelModal } from '../modals/fuels/EditFuelModal';

const { Column } = Table;

interface FuelsTableProps {
	fuels: Fuel[];
	onDelete: (fuel: Fuel) => void;
	onEdit: () => void;
}

const openNotification = (fuel: Fuel) => {
	notification['info']({
		message: 'Selected Fuel',
		description: `You have selected ${fuel?.name} fuel`,
		duration: 2,
	});
};

const FuelsTable: React.FC<FuelsTableProps> = ({ fuels, onEdit, onDelete }) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Fuel) => {
		const result = await UpdateFuel({
			id: values.id,
			name: values.name,
		});

		if (result === true) {
			const key = 'fuelEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the fuel name to '${values.name}'`,
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
		<Table dataSource={fuels} rowKey='id'>
			<Column
				title='Fuel ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Fuel;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Fuel, right: Fuel) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const fuel = record as Fuel;

							openNotification(fuel);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Fuel) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this fuel?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteFuel(record);

								onDelete(result as Fuel);
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
							<EditFuelModal
								fuel={record}
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

export { FuelsTable };
