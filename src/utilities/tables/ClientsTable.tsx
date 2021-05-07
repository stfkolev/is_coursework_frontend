import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Client } from '../../models/Client';
import { DeleteClient, UpdateClient } from '../../api/ClientApi';
import { EditClientModal } from '../modals/clients/EditClientModal';
import moment from 'moment';
const { Column } = Table;

interface ClientsTableProps {
	clients: Client[];
	onDelete: (client: Client) => void;
	onEdit: () => void;
}

const openNotification = (client: Client) => {
	notification['info']({
		message: 'Selected Client',
		description: `You have selected ${client?.firstName} ${client?.lastName} client`,
		duration: 2,
	});
};

const ClientsTable: React.FC<ClientsTableProps> = ({
	clients,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Client) => {
		const result = await UpdateClient({
			id: values.id,
			firstName: values.firstName,
			lastName: values.lastName,
			address: values.address,
			ucn: values.ucn,
			license: values.license,
			licenseExpiryDate: values.licenseExpiryDate,
		});

		if (result === true) {
			const key = 'clientEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the client!`,
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
		<Table dataSource={clients} rowKey='id'>
			<Column
				title='Client ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Client;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='First Name'
				dataIndex='firstName'
				sorter={(left: Client, right: Client) => {
					return left.firstName.localeCompare(right.firstName);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='Last Name'
				dataIndex='lastName'
				sorter={(left: Client, right: Client) => {
					return left.lastName.localeCompare(right.lastName);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='Address'
				dataIndex='address'
				sorter={(left: Client, right: Client) => {
					return left.address.localeCompare(right.address);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='Uniform Civil Number '
				dataIndex='ucn'
				sorter={(left: Client, right: Client) => {
					return left.ucn.localeCompare(right.ucn);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='License '
				dataIndex='license'
				sorter={(left: Client, right: Client) => {
					return left.license.localeCompare(right.license);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='License Expiry Date'
				dataIndex='licenseExpiryDate'
				sorter={(left: Client, right: Client) => {
					return (
						moment(left.licenseExpiryDate).unix() -
						moment(right.licenseExpiryDate).unix()
					);
				}}
				render={(value, record, index) => moment(value).format('DD/MM/YYYY')}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const client = record as Client;

							openNotification(client);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Client) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this client?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteClient(record);

								onDelete(result as Client);
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
							<EditClientModal
								client={record}
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

export { ClientsTable };
