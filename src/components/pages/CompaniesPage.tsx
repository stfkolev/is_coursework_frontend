import { useState, useEffect } from 'react';
import {
	Col,
	Row,
	Typography,
	Skeleton,
	Button,
	message,
	Card,
	Slider,
	Input,
} from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { CreateCompany, GetCompanies } from '../../api/CompanyApi';
import { Company } from '../../models/Company';
import { CompaniesTable } from '../../utilities/tables/CompaniesTable';
import {
	CreateCompanyModal,
	Values,
} from '../../utilities/modals/companies/CreateCompanyModal';

const { Title } = Typography;
const { Search } = Input;

const CompaniesPage = () => {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [filteredData, setFilteredData] = useState<Company[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetCompanies().then((_companies) => {
			setCompanies(_companies);
			setSliderMin(Math.min(..._companies.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._companies.map((obj) => Number(obj.id))));
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
				setSliderMin(Math.min(..._companies.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._companies.map((obj) => Number(obj.id))));
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
					setSliderMin(Math.min(..._companies.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._companies.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Companies | Задание 25`;
		setLoading(true);
		GetCompanies().then((_companies) => {
			setCompanies(_companies);
			setSliderMin(Math.min(..._companies.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._companies.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let companiesTable: any;

	if (companies.length === 0) {
		companiesTable = <Skeleton active />;
	} else {
		companiesTable = (
			<CompaniesTable
				companies={filteredData.length > 0 ? filteredData : companies}
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
						<PlusOutlined />
						Add Company
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetCompanies().then((_companies) => {
								setCompanies(_companies);

								setSliderMin(
									Math.min(..._companies.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(..._companies.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
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

			<Row align='top'>
				<Col span={10} offset={4}>
					{companiesTable}
				</Col>
				{!loading ? (
					<Col span={6} offset={1}>
						<Row align='top'>
							<Col span={24}>
								<Card title='Search' bordered={true}>
									<Search
										placeholder='Enter keyword...'
										onSearch={(value) => {
											const key = 'updateable';
											const data = companies.filter((obj) =>
												obj.name.toLowerCase().includes(value.toLowerCase()),
											);

											message.loading({
												content: ' Searching in records...',
												key,
											});

											if (data.length === 0) {
												setTimeout(() => {
													message.error({
														content: 'No data found!',
														key: key,
														duration: 2,
													});
												}, 1000);
											} else {
												setTimeout(() => {
													message.success({
														content: 'Successfully filtered records!',
														key: key,
														duration: 2,
													});

													setFilteredData(data);
												}, 1000);
											}
										}}
										allowClear
										enterButton
									/>
								</Card>
							</Col>
							<Col span={24} style={{ marginTop: 16 }}>
								<Card title='Filter by id' bordered={true}>
									<Slider
										range
										tooltipVisible
										min={sliderMin}
										max={sliderMax}
										defaultValue={[sliderMin, sliderMax]}
										marks={{
											[sliderMin]: sliderMin,
											[sliderMax]: sliderMax,
										}}
										onAfterChange={(value) => {
											const data = companies.slice(value[0] - 1, value[1]);

											console.log(data);
											setFilteredData(data);
										}}
									/>
								</Card>
							</Col>
						</Row>
					</Col>
				) : null}
			</Row>
		</>
	);
};

export { CompaniesPage };
