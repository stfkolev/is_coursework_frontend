import { Row, Col, Typography, Statistic, Card } from 'antd';
import {
	BranchesOutlined,
	CarFilled,
	DisconnectOutlined,
	FireFilled,
	FlagFilled,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { GetCarTypes } from '../../api/CarTypeApi';
import { GetPowertrains } from '../../api/PowertrainApi';
import { GetTransmissions } from '../../api/TransmissionApi';
import { GetFuels } from '../../api/FuelApi';
import { GetCountries } from '../../api/CountryApi';
import Text from 'antd/lib/typography/Text';
import { GetColors } from '../../api/ColorApi';
import { GetCompanies } from '../../api/CompanyApi';
import { GetClients } from '../../api/ClientApi';

const { Title } = Typography;

function HomePage() {
	const [carTypesCount, setCarTypesCount] = useState(0);
	const [powertrainsCount, setPowertrainsCount] = useState(0);
	const [transmissionsCount, setTransmissionsCount] = useState(0);
	const [fuelsCount, setFuelsCount] = useState(0);
	const [countriesCount, setCountriesCount] = useState(0);
	const [colorsCount, setColorsCount] = useState(0);
	const [companiesCount, setCompaniesCount] = useState(0);
	const [clientsCount, setClientsCount] = useState(0);

	useEffect(() => {
		document.title = `Home | Задание 25`;

		GetCarTypes().then((values) => setCarTypesCount(values.length));
		GetPowertrains().then((values) => setPowertrainsCount(values.length));
		GetTransmissions().then((values) => setTransmissionsCount(values.length));
		GetFuels().then((values) => setFuelsCount(values.length));
		GetCountries().then((values) => setCountriesCount(values.length));
		GetColors().then((values) => setColorsCount(values.length));
		GetCompanies().then((values) => setCompaniesCount(values.length));
		GetClients().then((values) => setClientsCount(values.length));
	}, []);
	return (
		<>
			<Row justify='start' align='middle'>
				<Col span={16} offset={11}>
					<Title>Summary</Title>
				</Col>
			</Row>

			<Row justify='start' align='middle'>
				<Col span={16} offset={1}>
					<Title level={2} style={{ marginBottom: 0 }}>
						Basic Statistics
					</Title>
					<Text type='secondary' style={{ marginTop: 0 }}>
						Here you can see summary number of records for each type
					</Text>
				</Col>
			</Row>

			<Row justify='center' align='middle' style={{ marginTop: 32 }}>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#ffc53d',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Car Types'
							value={carTypesCount}
							prefix={<CarFilled />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#40a9ff',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Powertrains'
							value={powertrainsCount}
							prefix={<DisconnectOutlined />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#73d13d',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Transmissions'
							value={transmissionsCount}
							prefix={<BranchesOutlined />}
						/>
					</Card>
				</Col>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#ff4d4f',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Fuels'
							value={fuelsCount}
							prefix={<FireFilled />}
						/>
					</Card>
				</Col>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#ff7a45',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Countries'
							value={countriesCount}
							prefix={<FlagFilled />}
						/>
					</Card>
				</Col>
			</Row>

			<Row justify='center' align='middle' style={{ marginTop: 32 }}>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#bae637',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Colors'
							value={colorsCount}
							prefix={<CarFilled />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#ffa940',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Companies'
							value={companiesCount}
							prefix={<DisconnectOutlined />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#36cfc9',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Clients'
							value={clientsCount}
							prefix={<BranchesOutlined />}
						/>
					</Card>
				</Col>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#fadb14',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Fuels'
							value={fuelsCount}
							prefix={<FireFilled />}
						/>
					</Card>
				</Col>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#b37feb',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Countries'
							value={countriesCount}
							prefix={<FlagFilled />}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default HomePage;
