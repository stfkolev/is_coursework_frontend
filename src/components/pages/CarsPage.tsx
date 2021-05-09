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

import { CreateCar, GetCars } from '../../api/CarApi';
import { Car } from '../../models/Car';
import { CarsTable } from '../../utilities/tables/CarsTable';
import {
	CreateCarModal,
	Values,
} from '../../utilities/modals/cars/CreateCarModal';

const { Title } = Typography;
const { Search } = Input;

const CarsPage = () => {
	const [cars, setCars] = useState<Car[]>([]);
	const [filteredData, setFilteredData] = useState<Car[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetCars().then((_cars) => {
			setCars(_cars);
			setSliderMin(Math.min(..._cars.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._cars.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (car: Car) => {
		const key = 'carAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${car.numberPlate}' from cars`,
				key,
				duration: 1,
			});

			GetCars().then((_cars) => {
				setCars(_cars);
				setSliderMin(Math.min(..._cars.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._cars.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		console.log({values})
		const result = await CreateCar({ 
			numberPlate: values.numberPlate,
			seats: values.seats,
			luggageSpace: values.luggageSpace,
			technicallyApproved: values.technicallyApproved,
			modelId: values.modelId,
			colorId: values.colorId,
			engineId: values.engineId,
		 });

		if (result.hasOwnProperty('numberPlate')) {
			const key = 'carAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.numberPlate}' as car`,
					key,
					duration: 1,
				});

				GetCars().then((_cars) => {
					setCars(_cars);
					setSliderMin(Math.min(..._cars.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._cars.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Cars | Задание 25`;
		setLoading(true);
		GetCars().then((_cars) => {
			setCars(_cars);
			setSliderMin(Math.min(..._cars.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._cars.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let carsTable: any;

	if (cars.length === 0) {
		carsTable = <Skeleton active />;
	} else {
		carsTable = (
			<CarsTable
				cars={filteredData.length > 0 ? filteredData : cars}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Cars</Title>
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
						Add Car
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetCars().then((_cars) => {
								setCars(_cars);

								setSliderMin(Math.min(..._cars.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(..._cars.map((obj) => Number(obj.id))));

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateCarModal
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
					{carsTable}
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
											const data = cars.filter((obj) =>
												obj.numberPlate.toLowerCase().includes(value.toLowerCase()),
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
											const data = cars.slice(value[0] - 1, value[1]);

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

export { CarsPage };
