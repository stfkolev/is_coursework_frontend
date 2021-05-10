import { useState, useEffect } from 'react';
import {
	Col,
	Row,
	Typography,
	Skeleton,
	Button,
	message,
	Slider,
	Card,
	DatePicker,
} from 'antd';

import moment from 'moment';

import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import { CreateRent, GetRents } from '../../api/RentApi';
import { Rent } from '../../models/Rent';
import { RentsTable } from '../../utilities/tables/RentsTable';
import {
	CreateRentModal,
	Values,
} from '../../utilities/modals/rents/CreateRentModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RentsPage = () => {
	const [rents, setRents] = useState<Rent[]>([]);
	const [filteredData, setFilteredData] = useState<Rent[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const [priceSliderMin, setPriceSliderMin] = useState(0);
	const [priceSliderMax, setPriceSliderMax] = useState(0);

	const onEdit = async () => {
		GetRents().then((_rents) => {
			setRents(_rents);

			setSliderMin(Math.min(..._rents.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._rents.map((obj) => Number(obj.id))));

			setPriceSliderMin(Math.min(..._rents.map((obj) => Number(obj.price))));
			setPriceSliderMax(Math.max(..._rents.map((obj) => Number(obj.price))));
		});
	};

	const onDelete = async (rent: Rent) => {
		const key = 'rentAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${rent.id}' from rents`,
				key,
				duration: 1,
			});

			GetRents().then((_rents) => {
				setRents(_rents);
				setSliderMin(Math.min(..._rents.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._rents.map((obj) => Number(obj.id))));

				setPriceSliderMin(Math.min(..._rents.map((obj) => Number(obj.price))));
				setPriceSliderMax(Math.max(..._rents.map((obj) => Number(obj.price))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		console.log({ values });
		const result = await CreateRent({
			price: values.price,
			pickUpDate: moment(values.pickUpDate).toJSON(),
			dropOffDate: moment(values.dropOffDate).toJSON(),
			clientId: values.clientId,
			carId: values.carId,
			companyId: values.companyId,
		});

		if (result.hasOwnProperty('id')) {
			const key = 'rentAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added rent`,
					key,
					duration: 1,
				});

				GetRents().then((_rents) => {
					setRents(_rents);

					setSliderMin(Math.min(..._rents.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._rents.map((obj) => Number(obj.id))));

					setPriceSliderMin(
						Math.min(..._rents.map((obj) => Number(obj.price))),
					);
					setPriceSliderMax(
						Math.max(..._rents.map((obj) => Number(obj.price))),
					);
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Rents | Задание 25`;
		setLoading(true);
		GetRents().then((_rents) => {
			setRents(_rents);
			setSliderMin(Math.min(..._rents.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._rents.map((obj) => Number(obj.id))));

			setPriceSliderMin(Math.min(..._rents.map((obj) => Number(obj.price))));
			setPriceSliderMax(Math.max(..._rents.map((obj) => Number(obj.price))));
			setLoading(false);
		});
	}, []);

	let rentsTable: any;

	if (rents.length === 0) {
		rentsTable = <Skeleton active />;
	} else {
		rentsTable = (
			<RentsTable
				rents={filteredData.length > 0 ? filteredData : rents}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Rents</Title>
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
						Add Rent
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetRents().then((_rents) => {
								setRents(_rents);

								setSliderMin(Math.min(..._rents.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(..._rents.map((obj) => Number(obj.id))));

								setPriceSliderMin(
									Math.min(..._rents.map((obj) => Number(obj.price))),
								);
								setPriceSliderMax(
									Math.max(..._rents.map((obj) => Number(obj.price))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateRentModal
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
					{rentsTable}
				</Col>
				{!loading ? (
					<Col span={6} offset={1}>
						<Row align='top'>
							{/* <Col span={24}>
								<Card title='Search' bordered={true}>
									<Search
										placeholder='Enter keyword...'
										onSearch={(value) => {
											const key = 'updateable';
											const data = rents.filter((obj) =>
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
							</Col> */}
							<Col span={24}>
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
											const data = rents.slice(value[0] - 1, value[1]);

											console.log(data);
											setFilteredData(data);
										}}
									/>
								</Card>
							</Col>
							<Col span={24} style={{ marginTop: 16 }}>
								<Card title='Filter by price' bordered={true}>
									<Slider
										range
										tooltipVisible
										step={0.01}
										min={priceSliderMin}
										max={priceSliderMax}
										defaultValue={[priceSliderMin, priceSliderMax]}
										marks={{
											[priceSliderMin]: priceSliderMin,
											[priceSliderMax]: priceSliderMax,
										}}
										onAfterChange={(value) => {
											console.log({ value });
											const data = rents.filter(
												(obj) => obj.price >= value[0] && obj.price <= value[1],
											);

											console.log(data);
											setFilteredData(data);
										}}
									/>
								</Card>
							</Col>
							<Col span={24} style={{ marginTop: 16 }}>
								<Card title='Filter by date' bordered={true}>
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
										}}
										size='large'
										onChange={(values) => {
											const data = rents.filter(
												(obj) =>
													moment(obj.pickUpDate).unix() >=
														moment(values?.[0]).unix() &&
													moment(obj.dropOffDate).unix() <=
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

export { RentsPage };
