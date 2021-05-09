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

import { CreateModel, GetModels } from '../../api/ModelApi';
import { Model } from '../../models/Model';
import { ModelsTable } from '../../utilities/tables/ModelsTable';
import {
	CreateModelModal,
	Values,
} from '../../utilities/modals/models/CreateModelModal';

const { Title } = Typography;
const { Search } = Input;

const ModelsPage = () => {
	const [models, setModels] = useState<Model[]>([]);
	const [filteredData, setFilteredData] = useState<Model[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetModels().then((_models) => {
			setModels(_models);
			setSliderMin(Math.min(..._models.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._models.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (model: Model) => {
		const key = 'modelAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${model.name}' from models`,
				key,
				duration: 1,
			});

			GetModels().then((_models) => {
				setModels(_models);
				setSliderMin(Math.min(..._models.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._models.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		console.log({values})
		const result = await CreateModel({ name: values.name, manufacturerId: values.manufacturerId, carTypeId: values.carTypeId });

		if (result.hasOwnProperty('name')) {
			const key = 'modelAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as model`,
					key,
					duration: 1,
				});

				GetModels().then((_models) => {
					setModels(_models);
					setSliderMin(Math.min(..._models.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._models.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Models | Задание 25`;
		setLoading(true);
		GetModels().then((_models) => {
			setModels(_models);
			setSliderMin(Math.min(..._models.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._models.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let modelsTable: any;

	if (models.length === 0) {
		modelsTable = <Skeleton active />;
	} else {
		modelsTable = (
			<ModelsTable
				models={filteredData.length > 0 ? filteredData : models}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Models</Title>
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
						Add Model
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetModels().then((_models) => {
								setModels(_models);

								setSliderMin(Math.min(..._models.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(..._models.map((obj) => Number(obj.id))));

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateModelModal
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
					{modelsTable}
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
											const data = models.filter((obj) =>
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
											const data = models.slice(value[0] - 1, value[1]);

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

export { ModelsPage };
