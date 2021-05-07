import { useState, useEffect } from 'react';
import {
	Col,
	Row,
	Typography,
	Skeleton,
	Button,
	message,
	Input,
	Slider,
	Card,
} from 'antd';

import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { CreateCountry, GetCountries } from '../../api/CountryApi';
import { Country } from '../../models/Country';
import { CountriesTable } from '../../utilities/tables/CountriesTable';
import {
	CreateCountryModal,
	Values,
} from '../../utilities/modals/countries/CreateCountryModal';

const { Title } = Typography;
const { Search } = Input;

const CountriesPage = () => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [filteredData, setFilteredData] = useState<Country[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetCountries().then((_countries) => {
			setCountries(_countries);

			setSliderMin(Math.min(..._countries.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._countries.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (country: Country) => {
		const key = 'countryAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${country.name}' from countries`,
				key,
				duration: 1,
			});

			GetCountries().then((_countries) => {
				setCountries(_countries);

				setSliderMin(Math.min(..._countries.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._countries.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateCountry({
			name: values.name,
			code: values.code,
		});

		if (result.hasOwnProperty('name')) {
			const key = 'countryAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as country`,
					key,
					duration: 1,
				});

				GetCountries().then((_countries) => {
					setCountries(_countries);
					setSliderMin(Math.min(..._countries.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._countries.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Countries | Задание 25`;
		setLoading(true);
		GetCountries().then((_countries) => {
			setCountries(_countries);
			setSliderMin(Math.min(..._countries.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._countries.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let countriesTable: any;

	if (countries.length === 0) {
		countriesTable = <Skeleton active />;
	} else {
		countriesTable = (
			<CountriesTable
				countries={filteredData.length > 0 ? filteredData : countries}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Countries</Title>
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
						Add Country
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetCountries().then((_countries) => {
								setCountries(_countries);

								setSliderMin(
									Math.min(..._countries.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(..._countries.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateCountryModal
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
					{countriesTable}
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
											const data = countries.filter(
												(obj) =>
													obj.name
														.toLowerCase()
														.includes(value.toLowerCase()) ||
													obj.code.toLowerCase().includes(value.toLowerCase()),
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
											const data = countries.slice(value[0] - 1, value[1]);

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

export { CountriesPage };
