import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Country } from '../../models/Country';
import { DeleteCountry, UpdateCountry } from '../../api/CountryApi';
import { EditCountryModal } from '../modals/countries/EditCountryModal';

const { Column } = Table;

interface CountriesTableProps {
	countries: Country[];
	onDelete: (country: Country) => void;
	onEdit: () => void;
}

const openNotification = (country: Country) => {
	notification['info']({
		message: 'Selected Country',
		description: `You have selected ${country?.name} country`,
		duration: 2,
	});
};

const CountriesTable: React.FC<CountriesTableProps> = ({
	countries,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Country) => {
		const result = await UpdateCountry({
			id: values.id,
			name: values.name,
			code: values.code,
		});

		if (result === true) {
			const key = 'countryEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the country name to '${values.name}'`,
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
		<Table dataSource={countries} rowKey='id'>
			<Column
				title='Country ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Country;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Country, right: Country) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const country = record as Country;

							openNotification(country);
						},
					};
				}}
			/>

			<Column
				title='Code'
				dataIndex='code'
				sorter={(left: Country, right: Country) => {
					return left.code.localeCompare(right.code);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const country = record as Country;

							openNotification(country);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Country) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this country?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteCountry(record);

								onDelete(result as Country);
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
							<EditCountryModal
								country={record}
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

export { CountriesTable };
