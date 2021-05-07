import React, { useEffect, useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Manufacturer } from '../../models/Manufacturer';
import {
	DeleteManufacturer,
	UpdateManufacturer,
} from '../../api/ManufacturerApi';
import { EditManufacturerModal } from '../modals/manufacturers/EditManufacturerModal';
import moment from 'moment';
import { GetCountries } from '../../api/CountryApi';
import { Country } from '../../models/Country';

const { Column } = Table;

interface ManufacturersTableProps {
	manufacturers: Manufacturer[];
	onDelete: (manufacturer: Manufacturer) => void;
	onEdit: () => void;
}

const openNotification = (manufacturer: Manufacturer) => {
	notification['info']({
		message: 'Selected Manufacturer',
		description: `You have selected ${manufacturer?.name} manufacturer`,
		duration: 2,
	});
};

const ManufacturersTable: React.FC<ManufacturersTableProps> = ({
	manufacturers,
	onEdit,
	onDelete,
}) => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	useEffect(() => {
		GetCountries().then((values) => {
			setCountries(values);
		});
	}, []);

	const onEditInternal = async (values: Manufacturer) => {
		const result = await UpdateManufacturer({
			id: values.id,
			name: values.name,
			createdAt: values.createdAt,
			countryId: values.countryId,
		});

		if (result === true) {
			const key = 'manufacturerEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the manufacturer name to '${values.name}'`,
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
		<Table dataSource={manufacturers} rowKey='id'>
			<Column
				title='Manufacturer ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const manufacturer = record as Manufacturer;

							openNotification(manufacturer);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Manufacturer, right: Manufacturer) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const manufacturer = record as Manufacturer;

							openNotification(manufacturer);
						},
					};
				}}
			/>

			<Column
				title='Country'
				dataIndex='countryId'
				render={(value, record, index) => {
					const data = countries.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const manufacturer = record as Manufacturer;

							openNotification(manufacturer);
						},
					};
				}}
			/>

			<Column
				title='Created At'
				dataIndex='createdAt'
				sorter={(left: Manufacturer, right: Manufacturer) => {
					return moment(left.createdAt).unix() - moment(right.createdAt).unix();
				}}
				render={(value, record, index) => moment(value).format('DD/MM/YYYY')}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const manufacturer = record as Manufacturer;

							openNotification(manufacturer);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Manufacturer) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this manufacturer?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteManufacturer(record);

								onDelete(result as Manufacturer);
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
							<EditManufacturerModal
								manufacturer={record}
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

export { ManufacturersTable };
