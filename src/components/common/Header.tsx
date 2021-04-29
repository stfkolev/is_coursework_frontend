import { useState, useEffect } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

const Header = () => {
	const [current, setCurrent] = useState('');

	const location = useLocation();

	useEffect(() => {
		setCurrent(
			location.pathname === '/' ? 'home' : location.pathname.split('/')[1],
		);
	}, [current, location]);

	return (
		<Menu
			selectedKeys={[current]}
			defaultSelectedKeys={[current]}
			mode='horizontal'>
			<Menu.Item key='home'>
				<RouterLink to='/' exact>
					Home
				</RouterLink>
			</Menu.Item>
			<Menu.Item key='carTypes'>
				<RouterLink to='/carTypes' exact>
					Car Types
				</RouterLink>
			</Menu.Item>
		</Menu>
	);
};

export { Header };
