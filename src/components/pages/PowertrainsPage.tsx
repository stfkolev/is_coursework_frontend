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

import { CreatePowertrain, GetPowertrains } from '../../api/PowertrainApi';
import { Powertrain } from '../../models/Powertrain';
import { PowertrainsTable } from '../../utilities/tables/PowertrainsTable';
import {
	CreatePowertrainModal,
	Values,
} from '../../utilities/modals/powertrains/CreatePowertrainModal';

const { Title } = Typography;
const { Search } = Input;

const PowertrainsPage = () => {
	const [powertrains, setPowertrains] = useState<Powertrain[]>([]);
	const [filteredData, setFilteredData] = useState<Powertrain[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetPowertrains().then((_powertrains) => {
			setPowertrains(_powertrains);
			setSliderMin(Math.min(...powertrains.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(...powertrains.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (color: Powertrain) => {
		const key = 'powertrainAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from powertrains`,
				key,
				duration: 1,
			});

			GetPowertrains().then((_powertrains) => {
				setPowertrains(_powertrains);
				setSliderMin(Math.min(...powertrains.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(...powertrains.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreatePowertrain({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'powertrainAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as powertrain`,
					key,
					duration: 1,
				});

				GetPowertrains().then((_powertrains) => {
					setPowertrains(_powertrains);
					setSliderMin(Math.min(...powertrains.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(...powertrains.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Powertrains | Задание 25`;
		setLoading(true);

		GetPowertrains().then((_powertrains) => {
			setPowertrains(_powertrains);
			setSliderMin(Math.min(..._powertrains.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._powertrains.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let powertrainsTable: any;

	if (powertrains.length === 0) {
		powertrainsTable = <Skeleton active />;
	} else {
		powertrainsTable = (
			<PowertrainsTable
				powertrains={filteredData.length > 0 ? filteredData : powertrains}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Powertrains</Title>
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
						Add Powertrain
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetPowertrains().then((_powertrains) => {
								setPowertrains(_powertrains);

								setSliderMin(
									Math.min(...powertrains.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(...powertrains.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreatePowertrainModal
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
					{powertrainsTable}
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
											const data = powertrains.filter((obj) =>
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
											const data = powertrains.slice(value[0] - 1, value[1]);

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

export { PowertrainsPage };
