import { Header } from './components/common/Header';
import './App.css';

import HomePage from './components/pages/HomePage';
import { PageNotFound } from './components/common/PageNotFound';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import { CarTypesPage } from './components/pages/CarTypesPage';

const { Content } = Layout;

function App() {
	return (
		<>
			<Header />

			<Content className='site-layout'>
				<Switch>
					<Route path='/' exact component={HomePage} />
					<Route path='/carTypes' exact component={CarTypesPage} />
					<Route component={PageNotFound} />
				</Switch>
			</Content>
		</>
	);
}

export default App;
