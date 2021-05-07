import { useState, useEffect } from 'react';
import {
	Col,
	Row,
	Typography,
	Skeleton,
	Button,
	message,
	Card,
	Slider,
	Input,
} from 'antd';

import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { CreateCarType, GetCarTypes } from '../../api/CarTypeApi';
import { CarType } from '../../models/CarType';
import { CarTypesTable } from '../../utilities/tables/CarTypesTable';
import {
	CreateCarTypeModal,
	Values,
} from '../../utilities/modals/carTypes/CreateCarTypeModal';

const { Title } = Typography;
const { Search } = Input;

const CarTypesPage = () => {
	const [carTypes, setCarTypes] = useState<CarType[]>([]);
	const [filteredData, setFilteredData] = useState<CarType[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetCarTypes().then((_carTypes) => {
			setCarTypes(_carTypes);
			setSliderMin(Math.min(...carTypes.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(...carTypes.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (color: CarType) => {
		const key = 'carTypeAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from car types`,
				key,
				duration: 1,
			});

			GetCarTypes().then((_carTypes) => {
				setCarTypes(_carTypes);
				setSliderMin(Math.min(...carTypes.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(...carTypes.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateCarType({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'carTypeAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as car type`,
					key,
					duration: 1,
				});

				GetCarTypes().then((_carTypes) => {
					setCarTypes(_carTypes);
					setSliderMin(Math.min(..._carTypes.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._carTypes.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Car Types | Задание 25`;
		setLoading(true);
		GetCarTypes().then((_carTypes) => {
			setCarTypes(_carTypes);
			setSliderMin(Math.min(..._carTypes.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._carTypes.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let carTypesTable: any;

	if (carTypes.length === 0) {
		carTypesTable = <Skeleton active />;
	} else {
		carTypesTable = (
			<CarTypesTable
				carTypes={filteredData.length > 0 ? filteredData : carTypes}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Car Types</Title>
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
						Add Car Type
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetCarTypes().then((_carTypes) => {
								setCarTypes(_carTypes);

								setSliderMin(
									Math.min(..._carTypes.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(..._carTypes.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateCarTypeModal
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
					{carTypesTable}
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
											const data = carTypes.filter((obj) =>
												obj.name.toLowerCase().includes(value.toLowerCase()),
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
											const data = carTypes.slice(value[0] - 1, value[1]);

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

export { CarTypesPage };
