import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Company } from '../../models/Company';
import { DeleteCompany, UpdateCompany } from '../../api/CompanyApi';
import { EditCompanyModal } from '../modals/companies/EditCompanyModal';

const { Column } = Table;

interface CompaniesTableProps {
	companies: Company[];
	onDelete: (company: Company) => void;
	onEdit: () => void;
}

const openNotification = (company: Company) => {
	notification['info']({
		message: 'Selected Company',
		description: `You have selected ${company?.name} company`,
		duration: 2,
	});
};

const CompaniesTable: React.FC<CompaniesTableProps> = ({
	companies,
	onEdit,
	onDelete,
}) => {
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Company) => {
		const result = await UpdateCompany({
			id: values.id,
			name: values.name,
		});

		if (result === true) {
			const key = 'companyEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the company name to '${values.name}'`,
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
		<Table dataSource={companies} rowKey='id'>
			<Column
				title='Company ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Company;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Company, right: Company) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const company = record as Company;

							openNotification(company);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Company) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this company?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteCompany(record);

								onDelete(result as Company);
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
							<EditCompanyModal
								company={record}
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

export { CompaniesTable };
