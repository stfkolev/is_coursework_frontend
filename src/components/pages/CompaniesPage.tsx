import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreateCompany, GetCompanies } from '../../api/CompanyApi';
import { Company } from '../../models/Company';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { CompaniesTable } from '../../utilities/tables/CompaniesTable';
import {
	CreateCompanyModal,
	Values,
} from '../../utilities/modals/companies/CreateCompanyModal';

const { Title } = Typography;

const CompaniesPage = () => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetCompanies().then((_companies) => {
			setCompanies(_companies);
		});
	};

	const onDelete = async (color: Company) => {
		const key = 'companyAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from companies`,
				key,
				duration: 1,
			});

			GetCompanies().then((_companies) => {
				setCompanies(_companies);
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateCompany({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'companyAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as company`,
					key,
					duration: 1,
				});

				GetCompanies().then((_companies) => {
					setCompanies(_companies);
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (companies.length > 0) {
			setTimeout(() => {
				GetCompanies().then((_companies) => {
					setCompanies(_companies);
				});
			}, 30000);
		} else {
			GetCompanies().then((_companies) => {
				setCompanies(_companies);
			});
		}
	}, [companies]);

	let companiesTable: any;

	if (companies.length === 0) {
		companiesTable = <Skeleton active />;
	} else {
		companiesTable = (
			<CompaniesTable
				companies={companies}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Companies</Title>
				</Col>
			</Row>
			<Row align='middle'>
				<Col span={16} offset={4}>
					<Button
						type='dashed'
						onClick={() => {
							setVisible(true);
						}}>
						Add Company
					</Button>

					<CreateCompanyModal
						visible={visible}
						onCreate={onCreate}
						onCancel={() => {
							setVisible(false);
						}}
					/>
				</Col>
			</Row>

			<br />

			<Row align='middle'>
				<Col span={16} offset={4}>
					{companiesTable}
				</Col>
			</Row>
		</>
	);
};

export { CompaniesPage };
