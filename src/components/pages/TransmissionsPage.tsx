import { useState, useEffect } from 'react';
import {
	Col,
	Row,
	Typography,
	Skeleton,
	Button,
	message,
	Card,
	Input,
	Slider,
} from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import {
	CreateTransmission,
	GetTransmissions,
} from '../../api/TransmissionApi';
import { Transmission } from '../../models/Transmission';
import { TransmissionsTable } from '../../utilities/tables/TransmissionsTable';
import {
	CreateTransmissionModal,
	Values,
} from '../../utilities/modals/transmissions/CreateTransmissionModal';

const { Title } = Typography;
const { Search } = Input;

const TransmissionsPage = () => {
	const [transmissions, setTransmissions] = useState<Transmission[]>([]);
	const [filteredData, setFilteredData] = useState<Transmission[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetTransmissions().then((_transmissions) => {
			setTransmissions(_transmissions);
			setSliderMin(Math.min(...transmissions.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(...transmissions.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (color: Transmission) => {
		const key = 'transmissionAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from transmissions`,
				key,
				duration: 1,
			});

			GetTransmissions().then((_transmissions) => {
				setTransmissions(_transmissions);
				setSliderMin(Math.min(...transmissions.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(...transmissions.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateTransmission({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'transmissionAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as transmission`,
					key,
					duration: 1,
				});

				GetTransmissions().then((_transmissions) => {
					setTransmissions(_transmissions);
					setSliderMin(Math.min(...transmissions.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(...transmissions.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Transmissions | Задание 25`;
		setLoading(true);

		GetTransmissions().then((_transmissions) => {
			setTransmissions(_transmissions);
			setSliderMin(Math.min(..._transmissions.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._transmissions.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let transmissionsTable: any;

	if (transmissions.length === 0) {
		transmissionsTable = <Skeleton active />;
	} else {
		transmissionsTable = (
			<TransmissionsTable
				transmissions={filteredData.length > 0 ? filteredData : transmissions}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Transmissions</Title>
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
						Add Transmission
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetTransmissions().then((_transmissions) => {
								setTransmissions(_transmissions);

								setSliderMin(
									Math.min(...transmissions.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(...transmissions.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateTransmissionModal
						visible={visible}
						onCreate={onCreate}
						onCancel={() => {
							setVisible(false);
						}}
					/>
				</Col>
			</Row>

			<br />

			<Row align='middle'>
				<Col span={10} offset={4}>
					{transmissionsTable}
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
											const data = transmissions.filter((obj) =>
												obj.name.toLowerCase().includes(value.toLowerCase()),
											);

											console.log({ data });

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
											const data = transmissions.slice(value[0] - 1, value[1]);

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

export { TransmissionsPage };
