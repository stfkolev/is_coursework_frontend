import React, { useEffect, useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Rent } from '../../models/Rent';
import { DeleteRent, UpdateRent } from '../../api/RentApi';
import { EditRentModal } from '../modals/rents/EditRentModal';
import moment from 'moment';
import { Client } from '../../models/Client';
import { GetClients } from '../../api/ClientApi';
import { Car } from '../../models/Car';
import { Company } from '../../models/Company';
import { GetCars } from '../../api/CarApi';
import { GetCompanies } from '../../api/CompanyApi';

const { Column } = Table;

interface RentsTableProps {
	rents: Rent[];
	onDelete: (rent: Rent) => void;
	onEdit: () => void;
}

const openNotification = (rent: Rent) => {
	notification['info']({
		message: 'Selected Rent',
		description: `You have selected ${rent?.id} rent`,
		duration: 2,
	});
};

const RentsTable: React.FC<RentsTableProps> = ({ rents, onEdit, onDelete }) => {
	const [clients, setClients] = useState<Client[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	useEffect(() => {
		GetClients().then((values) => {
			setClients(values);
		});
		GetCars().then((values) => {
			setCars(values);
		});
		GetCompanies().then((values) => {
			setCompanies(values);
		});
	}, []);

	const onEditInternal = async (values: Rent) => {
		const result = await UpdateRent({
			id: values.id,
			price: values.price,
			pickUpDate: values.pickUpDate,
			dropOffDate: values.dropOffDate,
			clientId: values.clientId,
			carId: values.carId,
			companyId: values.companyId,
		});

		if (result === true) {
			const key = 'rentEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the rent'`,
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
		<Table dataSource={rents} rowKey='id'>
			<Column
				title='Rent ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Price'
				dataIndex='price'
				sorter={(left: Rent, right: Rent) => {
					return left.price - right.price;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Pick-up Date'
				dataIndex='pickUpDate'
				sorter={(left: Rent, right: Rent) => {
					return (
						moment(left.pickUpDate).unix() - moment(right.pickUpDate).unix()
					);
				}}
				render={(value, record, index) => moment(value).format('DD/MM/YYYY')}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Drop-off Date'
				dataIndex='dropOffDate'
				sorter={(left: Rent, right: Rent) => {
					return (
						moment(left.dropOffDate).unix() - moment(right.dropOffDate).unix()
					);
				}}
				render={(value, record, index) => moment(value).format('DD/MM/YYYY')}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Client'
				dataIndex='clientId'
				render={(value, record, index) => {
					const data = clients.find((obj) => obj.id === value);

					return data === undefined
						? value
						: `${data.firstName} ${data.lastName}`;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Car'
				dataIndex='carId'
				render={(value, record, index) => {
					const data = cars.find((obj) => obj.id === value);

					return data === undefined ? value : `${data.numberPlate}`;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Company'
				dataIndex='companyId'
				render={(value, record, index) => {
					const data = companies.find((obj) => obj.id === value);

					return data === undefined ? value : `${data.name}`;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const rent = record as Rent;

							openNotification(rent);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Rent) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this rent?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteRent(record);

								onDelete(result as Rent);
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
							<EditRentModal
								rent={record}
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

export { RentsTable };
