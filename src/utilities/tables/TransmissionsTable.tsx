import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Transmission } from '../../models/Transmission';
import {
	DeleteTransmission,
	UpdateTransmission,
} from '../../api/TransmissionApi';
import { EditTransmissionModal } from '../modals/transmissions/EditTransmissionModal';

const { Column } = Table;

interface TransmissionsTableProps {
	transmissions: Transmission[];
	onDelete: (transmission: Transmission) => void;
	onEdit: () => void;
}

const openNotification = (transmission: Transmission) => {
	notification['info']({
		message: 'Selected Transmission',
		description: `You have selected ${transmission?.name} transmission`,
		duration: 2,
	});
};

const TransmissionsTable: React.FC<TransmissionsTableProps> = ({
	transmissions,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Transmission) => {
		const result = await UpdateTransmission({
			id: values.id,
			name: values.name,
		});

		if (result === true) {
			const key = 'transmissionEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the transmission name to '${values.name}'`,
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
		<Table dataSource={transmissions} rowKey='id'>
			<Column
				title='Transmission ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Transmission;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Transmission, right: Transmission) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const transmission = record as Transmission;

							openNotification(transmission);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Transmission) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this transmission?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteTransmission(record);

								onDelete(result as Transmission);
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
							<EditTransmissionModal
								transmission={record}
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

export { TransmissionsTable };
