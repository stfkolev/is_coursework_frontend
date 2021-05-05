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
} from 'antd';
import { ClearOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { CreatePowertrain, GetPowertrains } from '../../api/PowertrainApi';
import { Powertrain } from '../../models/Powertrain';
import { PowertrainsTable } from '../../utilities/tables/PowertrainsTable';
import {
	CreatePowertrainModal,
	Values,
} from '../../utilities/modals/powertrains/CreatePowertrainModal';

const { Title } = Typography;

const PowertrainsPage = () => {
	const [powertrains, setPowertrains] = useState<Powertrain[]>([]);
	const [filteredData, setFilteredData] = useState<Powertrain[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderValues, setSliderValues] = useState<[number, number]>([0, 0]);
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
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		setLoading(true);

		GetPowertrains().then((_powertrains) => {
			setPowertrains(_powertrains);
			setSliderMin(Math.min(..._powertrains.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._powertrains.map((obj) => Number(obj.id))));
			setSliderValues([sliderMin, sliderMax]);
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
						<Card title='Filter by id' bordered={true}>
							<Slider
								range
								tooltipVisible
								min={sliderMin}
								max={sliderMax}
								value={sliderValues}
								defaultValue={[sliderMin, sliderMax]}
								marks={{
									[sliderMin]: sliderMin,
									[sliderMax]: sliderMax,
								}}
								onAfterChange={(value) => {
									setSliderValues([value[0] - 1, value[1]]);
									const data = powertrains.slice(
										sliderValues[0],
										sliderValues[1],
									);

									console.log({ sliderValues });
									console.log(data);
									setFilteredData(data);
								}}
							/>
							<Button
								style={{ float: 'right' }}
								type='default'
								onClick={() => {
									setFilteredData([]);
									setSliderValues([sliderMin, sliderMax]);
								}}>
								<ClearOutlined />
								Reset
							</Button>
						</Card>
					</Col>
				) : null}
			</Row>
		</>
	);
};

export { PowertrainsPage };
