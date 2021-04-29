import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Powertrain } from '../../models/Powertrain';
import { DeletePowertrain, UpdatePowertrain } from '../../api/PowertrainApi';
import { EditPowertrainModal } from '../modals/powertrains/EditPowertrainModal';

const { Column } = Table;

interface PowertrainsTableProps {
	powertrains: Powertrain[];
	onDelete: (powertrain: Powertrain) => void;
	onEdit: () => void;
}

const openNotification = (powertrain: Powertrain) => {
	notification['info']({
		message: 'Selected Powertrain',
		description: `You have selected ${powertrain?.name} powertrain`,
		duration: 2,
	});
};

const PowertrainsTable: React.FC<PowertrainsTableProps> = ({
	powertrains,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Powertrain) => {
		const result = await UpdatePowertrain({ id: values.id, name: values.name });

		if (result === true) {
			const key = 'powertrainEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the powertrain name to '${values.name}'`,
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
		<Table dataSource={powertrains} rowKey='id'>
			<Column
				title='Powertrain ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Powertrain;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Powertrain, right: Powertrain) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const powertrain = record as Powertrain;

							openNotification(powertrain);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Powertrain) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this powertrain?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeletePowertrain(record);

								onDelete(result as Powertrain);
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
							<EditPowertrainModal
								powertrain={record}
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

export { PowertrainsTable };
