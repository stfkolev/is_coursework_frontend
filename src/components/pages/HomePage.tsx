import { Link } from 'react-router-dom';
import { Row, Col, Button, Carousel, Typography } from 'antd';
import { useEffect } from 'react';

const { Title } = Typography;

function HomePage() {
	useEffect(() => {
		document.title = `Home | Задание 25`;
	}, []);
	return (
		<>
			<Row justify='center' align='middle'>
				<Col span={16} offset={4}>
					<Title></Title>
				</Col>
			</Row>

			<Row justify='center' align='middle'>
				<Col span={16} offset={4}>
					<Carousel autoplay>
						<div>
							<Title>Check out the car types!</Title>
							<Link to='/carTypes'>
								<Button type='primary'>Go to page</Button>
							</Link>
						</div>
						<div>
							<Title>Check out the colors!</Title>
							<Link to='/colors'>
								<Button type='primary'>Go to page</Button>
							</Link>
						</div>
					</Carousel>
				</Col>
			</Row>
		</>
	);
}

export default HomePage;
