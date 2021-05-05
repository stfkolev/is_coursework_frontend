import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreateCountry, GetCountries } from '../../api/CountryApi';
import { Country } from '../../models/Country';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { CountriesTable } from '../../utilities/tables/CountriesTable';
import {
	CreateCountryModal,
	Values,
} from '../../utilities/modals/countries/CreateCountryModal';

const { Title } = Typography;

const CountriesPage = () => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetCountries().then((_countries) => {
			setCountries(_countries);
		});
	};

	const onDelete = async (color: Country) => {
		const key = 'countryAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from countries`,
				key,
				duration: 1,
			});

			GetCountries().then((_countries) => {
				setCountries(_countries);
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
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (countries.length > 0) {
			setTimeout(() => {
				GetCountries().then((_countries) => {
					setCountries(_countries);
				});
			}, 30000);
		} else {
			GetCountries().then((_countries) => {
				setCountries(_countries);
			});
		}
	}, [countries]);

	let countriesTable: any;

	if (countries.length === 0) {
		countriesTable = <Skeleton active />;
	} else {
		countriesTable = (
			<CountriesTable
				countries={countries}
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
						Add Country
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

			<Row align='middle'>
				<Col span={16} offset={4}>
					{countriesTable}
				</Col>
			</Row>
		</>
	);
};

export { CountriesPage };
