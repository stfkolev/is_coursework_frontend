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

import { CreateEngine, GetEngines } from '../../api/EngineApi';
import { Engine } from '../../models/Engine';
import { EnginesTable } from '../../utilities/tables/EnginesTable';
import {
	CreateEngineModal,
	Values,
} from '../../utilities/modals/engines/CreateEngineModal';

const { Title } = Typography;
const { Search } = Input;

const EnginesPage = () => {
	const [engines, setEngines] = useState<Engine[]>([]);
	const [filteredData, setFilteredData] = useState<Engine[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetEngines().then((_engines) => {
			setEngines(_engines);
			setSliderMin(Math.min(..._engines.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._engines.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (engine: Engine) => {
		const key = 'engineAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${engine.name}' from engines`,
				key,
				duration: 1,
			});

			GetEngines().then((_engines) => {
				setEngines(_engines);
				setSliderMin(Math.min(..._engines.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._engines.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		console.log({values})
		const result = await CreateEngine({ 
			name: values.name,
			displacement: values.displacement,
			power: values.power,
			torque: values.torque,
			cyllinders: values.cyllinders,
			powertrainId: values.powerTrainId,
			fuelId: values.fuelId,
			transmissionId: values.transmissionId,
		 });

		if (result.hasOwnProperty('name')) {
			const key = 'engineAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as engine`,
					key,
					duration: 1,
				});

				GetEngines().then((_engines) => {
					setEngines(_engines);
					setSliderMin(Math.min(..._engines.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._engines.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Engines | Задание 25`;
		setLoading(true);
		GetEngines().then((_engines) => {
			setEngines(_engines);
			setSliderMin(Math.min(..._engines.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._engines.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let enginesTable: any;

	if (engines.length === 0) {
		enginesTable = <Skeleton active />;
	} else {
		enginesTable = (
			<EnginesTable
				engines={filteredData.length > 0 ? filteredData : engines}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Engines</Title>
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
						Add Engine
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetEngines().then((_engines) => {
								setEngines(_engines);

								setSliderMin(Math.min(..._engines.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(..._engines.map((obj) => Number(obj.id))));

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateEngineModal
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
					{enginesTable}
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
											const data = engines.filter((obj) =>
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
											const data = engines.slice(value[0] - 1, value[1]);

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

export { EnginesPage };
