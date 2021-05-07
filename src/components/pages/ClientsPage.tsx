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

import { CreateClient, GetClients } from '../../api/ClientApi';
import { Client } from '../../models/Client';
import { ClientsTable } from '../../utilities/tables/ClientsTable';
import {
	CreateClientModal,
	Values,
} from '../../utilities/modals/clients/CreateClientModal';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const ClientsPage = () => {
	const [clients, setClients] = useState<Client[]>([]);
	const [filteredData, setFilteredData] = useState<Client[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetClients().then((_clients) => {
			setClients(_clients);

			setSliderMin(Math.min(..._clients.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._clients.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (client: Client) => {
		const key = 'clientAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${client.firstName} ${client.lastName}' from clients`,
				key,
				duration: 1,
			});

			GetClients().then((_clients) => {
				setClients(_clients);

				setSliderMin(Math.min(..._clients.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._clients.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateClient({
			firstName: values.firstName,
			lastName: values.lastName,
			address: values.address,
			ucn: values.ucn,
			license: values.license,
			licenseExpiryDate: values.licenseExpiryDate,
		});

		const key = 'clientAdd';

		message.loading({ content: 'Loading...', key });

		if (clients.some((obj) => obj.ucn === result.ucn)) {
			message.error({
				content: `Failed to add '${values.firstName} ${values.lastName}' as client. His UCN is present in our database!`,
				key,
				duration: 3,
			});
		} else if (result.hasOwnProperty('firstName')) {
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.firstName} ${values.lastName}' as client`,
					key,
					duration: 1,
				});

				GetClients().then((_clients) => {
					setClients(_clients);
					setSliderMin(Math.min(..._clients.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._clients.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Clients | Задание 25`;
		setLoading(true);
		GetClients().then((_clients) => {
			setClients(_clients);
			setSliderMin(Math.min(..._clients.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._clients.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let clientsTable: any;

	if (clients.length === 0) {
		clientsTable = <Skeleton active />;
	} else {
		clientsTable = (
			<ClientsTable
				clients={filteredData.length > 0 ? filteredData : clients}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Clients</Title>
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
						Add Client
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetClients().then((_clients) => {
								setClients(_clients);

								setSliderMin(
									Math.min(..._clients.map((obj) => Number(obj.id))),
								);
								setSliderMax(
									Math.max(..._clients.map((obj) => Number(obj.id))),
								);

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateClientModal
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
					{clientsTable}
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
											const data = clients.filter(
												(obj) =>
													obj.firstName
														.toLowerCase()
														.includes(value.toLowerCase()) ||
													obj.lastName
														.toLowerCase()
														.includes(value.toLowerCase()) ||
													obj.address
														.toLowerCase()
														.includes(value.toLowerCase()) ||
													obj.ucn.toLowerCase().includes(value.toLowerCase()) ||
													obj.license
														.toLowerCase()
														.includes(value.toLowerCase()),
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
											const data = clients.slice(value[0] - 1, value[1]);

											console.log(data);
											setFilteredData(data);
										}}
									/>
								</Card>
							</Col>
							<Col span={24} style={{ marginTop: 16 }}>
								<Card title='Filter by License Expiry Date' bordered={true}>
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
											const data = clients.filter(
												(obj) =>
													moment(obj.licenseExpiryDate).unix() >=
														moment(values?.[0]).unix() &&
													moment(obj.licenseExpiryDate).unix() <=
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

export { ClientsPage };
