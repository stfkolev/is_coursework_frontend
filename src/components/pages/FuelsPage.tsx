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

import { CreateFuel, GetFuels } from '../../api/FuelApi';
import { Fuel } from '../../models/Fuel';
import { FuelsTable } from '../../utilities/tables/FuelsTable';
import {
	CreateFuelModal,
	Values,
} from '../../utilities/modals/fuels/CreateFuelModal';

const { Title } = Typography;
const { Search } = Input;

const FuelsPage = () => {
	const [fuels, setFuels] = useState<Fuel[]>([]);
	const [filteredData, setFilteredData] = useState<Fuel[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetFuels().then((_fuels) => {
			setFuels(_fuels);

			setSliderMin(Math.min(...fuels.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(...fuels.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (color: Fuel) => {
		const key = 'fuelAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from fuels`,
				key,
				duration: 1,
			});

			GetFuels().then((_fuels) => {
				setFuels(_fuels);
				setSliderMin(Math.min(...fuels.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(...fuels.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateFuel({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'fuelAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as fuel`,
					key,
					duration: 1,
				});

				GetFuels().then((_fuels) => {
					setFuels(_fuels);
					setSliderMin(Math.min(...fuels.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(...fuels.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Fuels | Задание 25`;

		setLoading(true);
		GetFuels().then((_fuels) => {
			setFuels(_fuels);
			setSliderMin(Math.min(..._fuels.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._fuels.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let fuelsTable: any;

	if (fuels.length === 0) {
		fuelsTable = <Skeleton active />;
	} else {
		fuelsTable = (
			<FuelsTable
				fuels={filteredData.length > 0 ? filteredData : fuels}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Fuels</Title>
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
						Add Fuel
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetFuels().then((_fuels) => {
								setFuels(_fuels);

								setSliderMin(Math.min(...fuels.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(...fuels.map((obj) => Number(obj.id))));

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateFuelModal
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
					{fuelsTable}
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
											const data = fuels.filter((obj) =>
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
											const data = fuels.slice(value[0] - 1, value[1]);

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

export { FuelsPage };
