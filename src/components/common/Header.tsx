import { useState, useEffect } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import {
	CarFilled,
	HomeFilled,
	DisconnectOutlined,
	BranchesOutlined,
	FireFilled,
	FlagFilled,
	BgColorsOutlined,
	UserOutlined,
	BankOutlined,
	ToolFilled,
	StarFilled,
	DeploymentUnitOutlined,
	DollarCircleFilled,
	RocketFilled,
} from '@ant-design/icons';

const { Header } = Layout;

const HeaderLine = () => {
	const [current, setCurrent] = useState('');

	const location = useLocation();

	useEffect(() => {
		setCurrent(
			location.pathname === '/' ? 'home' : location.pathname.split('/')[1],
		);
	}, [current, location]);

	return (
		<>
			<Header>
				<Menu
					theme='dark'
					selectedKeys={[current]}
					defaultSelectedKeys={[current]}
					mode='horizontal'>
					<Menu.Item key='home'>
						<RouterLink to='/' exact>
							<HomeFilled />
							Home
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='carTypes'>
						<RouterLink to='/carTypes' exact>
							<DeploymentUnitOutlined />
							Car Types
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='powertrains'>
						<RouterLink to='/powertrains' exact>
							<DisconnectOutlined />
							Powertrains
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='transmissions'>
						<RouterLink to='/transmissions' exact>
							<BranchesOutlined />
							Transmissions
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='fuels'>
						<RouterLink to='/fuels' exact>
							<FireFilled />
							Fuels
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='countries'>
						<RouterLink to='/countries' exact>
							<FlagFilled />
							Countries
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='colors'>
						<RouterLink to='/colors' exact>
							<BgColorsOutlined />
							Colors
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='companies'>
						<RouterLink to='/companies' exact>
							<BankOutlined />
							Companies
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='clients'>
						<RouterLink to='/clients' exact>
							<UserOutlined />
							Clients
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='manufacturers'>
						<RouterLink to='/manufacturers' exact>
							<ToolFilled />
							Manufacturers
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='models'>
						<RouterLink to='/models' exact>
							<StarFilled />
							Models
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='cars'>
						<RouterLink to='/cars' exact>
							<CarFilled />
							Cars
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='engines'>
						<RouterLink to='/engines' exact>
							<RocketFilled />
							Engines
						</RouterLink>
					</Menu.Item>
					<Menu.Item key='rents'>
						<RouterLink to='/rents' exact>
							<DollarCircleFilled />
							Rents
						</RouterLink>
					</Menu.Item>
				</Menu>
			</Header>
		</>
	);
};

export { HeaderLine };
