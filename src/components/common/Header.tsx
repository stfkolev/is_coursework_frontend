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
							<CarFilled />
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
							<BgColorsOutlined />
							Companies
						</RouterLink>
					</Menu.Item>
				</Menu>
			</Header>
		</>
	);
};

export { HeaderLine };
