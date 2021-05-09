import { HeaderLine } from './components/common/Header';
import './App.css';

import HomePage from './components/pages/HomePage';
import { PageNotFound } from './components/common/PageNotFound';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import { CarTypesPage } from './components/pages/CarTypesPage';
import { PowertrainsPage } from './components/pages/PowertrainsPage';
import { TransmissionsPage } from './components/pages/TransmissionsPage';
import { FuelsPage } from './components/pages/FuelsPage';
import { CountriesPage } from './components/pages/CountriesPage';
import { ColorsPage } from './components/pages/ColorsPage';
import { CompaniesPage } from './components/pages/CompaniesPage';
import { ClientsPage } from './components/pages/ClientsPage';
import { ManufacturersPage } from './components/pages/ManufacturersPage';
import { ModelsPage } from './components/pages/ModelsPage';
import { EnginesPage } from './components/pages/EnginesPage';
import { CarsPage } from './components/pages/CarsPage';

const { Content } = Layout;

function App() {
	return (
		<>
			<head>
				<title>asd</title>
			</head>
			<HeaderLine />

			<Content
				className='site-layout'
				style={{ padding: '0 50px', marginTop: 64 }}>
				<Switch>
					<Route path='/' exact component={HomePage} />
					<Route path='/carTypes' exact component={CarTypesPage} />
					<Route path='/powertrains' exact component={PowertrainsPage} />
					<Route path='/transmissions' exact component={TransmissionsPage} />
					<Route path='/fuels' exact component={FuelsPage} />
					<Route path='/countries' exact component={CountriesPage} />
					<Route path='/colors' exact component={ColorsPage} />
					<Route path='/companies' exact component={CompaniesPage} />
					<Route path='/clients' exact component={ClientsPage} />
					<Route path='/manufacturers' exact component={ManufacturersPage} />
					<Route path='/models' exact component={ModelsPage} />
					<Route path='/engines' exact component={EnginesPage} />
					<Route path='/cars' exact component={CarsPage} />
					<Route component={PageNotFound} />
				</Switch>
			</Content>
		</>
	);
}

export default App;
