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
	DatePicker,
} from 'antd';

import moment from 'moment';

import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import {
	CreateManufacturer,
	GetManufacturers,
} from '../../api/ManufacturerApi';
import { Manufacturer } from '../../models/Manufacturer';
import { ManufacturersTable } from '../../utilities/tables/ManufacturersTable';
import {
	CreateManufacturerModal,
	Values,
} from '../../utilities/modals/manufacturers/CreateManufacturerModal';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManufacturersPage = () => {
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [filteredData, setFilteredData] = useState<Manufacturer[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetManufacturers().then((_manufacturers) => {
			setManufacturers(_manufacturers);
			setSliderMin(Math.min(..._manufacturers.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._manufacturers.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (manufacturer: Manufacturer) => {
		const key = 'manufacturerAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${manufacturer.name}' from manufacturers`,
				key,
				duration: 1,
			});

			GetManufacturers().then((_manufacturers) => {
				setManufacturers(_manufacturers);
				setSliderMin(Math.min(..._manufacturers.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._manufacturers.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		console.log({ values });
		const result = await CreateManufacturer({
			name: values.name,
			createdAt: moment(values.createdAt).toJSON(),
			countryId: values.countryId,
		});

		if (result.hasOwnProperty('name')) {
			const key = 'manufacturerAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as manufacturer`,
					key,
					duration: 1,
				});

				GetManufacturers().then((_manufacturers) => {
					setManufacturers(_manufacturers);
					setSliderMin(
						Math.min(..._manufacturers.map((obj) => Number(obj.id))),
					);
					setSliderMax(
						Math.max(..._manufacturers.map((obj) => Number(obj.id))),
					);
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Manufacturers | ?????????????? 25`;
		setLoading(true);
		GetManufacturers().then((_manufacturers) => {
			setManufacturers(_manufacturers);
			setSliderMin(Math.min(..._manufacturers.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._manufacturers.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let manufacturersTable: any;

	if (manufacturers.length === 0) {
		manufacturersTable = <Skeleton active />;
	} else {
		manufacturersTable = (
			<ManufacturersTable
				manufacturers={filteredData.length > 0 ? filteredData : manufacturers}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Manufacturers</Title>
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
						Add Manufacturer
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetManufacturers().then((_manufacturers) => {
								setManufacturers(_manufacturers);

								setSliderMin(
									Math.min(..._manufacturers.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(..._manufacturers.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateManufacturerModal
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
					{manufacturersTable}
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
											const data = manufacturers.filter((obj) =>
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
											const data = manufacturers.slice(value[0] - 1, value[1]);

											console.log(data);
											setFilteredData(data);
										}}
									/>
								</Card>
							</Col>
							<Col span={24} style={{ marginTop: 16 }}>
								<Card title='Filter by Creation Date' bordered={true}>
									<RangePicker
										style={{ width: '100%' }}
										ranges={{
											Today: [moment(), moment()],
											'This Week': [
												moment().startOf('week'),
												moment().endOf('week'),
											],
											'This Month': [
												moment().startOf('month'),
												moment().endOf('month'),
											],
											'This Year': [
												moment().startOf('year'),
												moment().endOf('year'),
											],
											'This Millenia': [
												moment('2000').startOf('year'),
												moment('2099').endOf('year'),
											],
										}}
										size='large'
										onChange={(values) => {
											const data = manufacturers.filter(
												(obj) =>
													moment(obj.createdAt).unix() >=
														moment(values?.[0]).unix() &&
													moment(obj.createdAt).unix() <=
														moment(values?.[1]).unix(),
											);

											if (data.length === 0) {
												message.error({
													content: 'No data found! Showing all records...',
													duration: 2,
												});
											}

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

export { ManufacturersPage };
