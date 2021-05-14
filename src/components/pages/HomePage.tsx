import { Row, Col, Typography, Statistic, Card } from 'antd';
import {
	BankOutlined,
	BgColorsOutlined,
	BranchesOutlined,
	CarFilled,
	DeploymentUnitOutlined,
	DisconnectOutlined,
	DollarCircleFilled,
	FireFilled,
	FlagFilled,
	RocketFilled,
	StarFilled,
	ToolFilled,
	UserOutlined,
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
import { GetManufacturers } from '../../api/ManufacturerApi';
import { GetModels } from '../../api/ModelApi';
import { GetEngines } from '../../api/EngineApi';
import { GetRents } from '../../api/RentApi';
import { GetCars } from '../../api/CarApi';

import RoseChart from '../common/charts/RoseChart';

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
	const [manufacturersCount, setManufacturersCount] = useState(0);
	const [modelsCount, setModelsCount] = useState(0);
	const [enginesCount, setEnginesCount] = useState(0);
	const [rentsCount, setRentsCount] = useState(0);
	const [carsCount, setCarsCount] = useState(0);

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
		GetManufacturers().then((values) => setManufacturersCount(values.length));
		GetModels().then((values) => setModelsCount(values.length));
		GetEngines().then((values) => setEnginesCount(values.length));
		GetRents().then((values) => setRentsCount(values.length));
		GetCars().then((values) => setCarsCount(values.length));
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
							prefix={<DeploymentUnitOutlined />}
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
							prefix={<BgColorsOutlined />}
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
							prefix={<BankOutlined />}
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
							prefix={<UserOutlined />}
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
							title='Number of Models'
							value={modelsCount}
							prefix={<StarFilled />}
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
							title='Number of Manufacturers'
							value={manufacturersCount}
							prefix={<ToolFilled />}
						/>
					</Card>
				</Col>
			</Row>

			<Row justify='center' align='middle' style={{ marginTop: 32 }}>
				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#597ef7',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Cars'
							value={carsCount}
							prefix={<CarFilled />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#f759ab',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Engines'
							value={enginesCount}
							prefix={<RocketFilled />}
						/>
					</Card>
				</Col>

				<Col span={3} offset={1}>
					<Card
						style={{
							background: '#d9d9d9',
							boxShadow: '0pt 0pt 15pt rgba(0, 0, 0, 0.15)',
							border: 0,
						}}>
						<Statistic
							title='Number of Rents'
							value={rentsCount}
							prefix={<DollarCircleFilled />}
						/>
					</Card>
				</Col>
			</Row>

			<Row justify='start' align='middle' style={{ marginTop: 32 }}>
				<Col span={16} offset={1}>
					<Title level={2} style={{ marginBottom: 0 }}>
						Advanced Statistics
					</Title>
					<Text type='secondary' style={{ marginTop: 0 }}>
						Here you can see more advanced reports using visualization
					</Text>
				</Col>
			</Row>

			<Row justify='center' align='middle' style={{ marginTop: 32 }}>
				<Col span={8} offset={1}>
					<RoseChart />
				</Col>
			</Row>
		</>
	);
}

export default HomePage;
