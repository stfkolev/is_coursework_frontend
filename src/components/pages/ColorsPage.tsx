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

import { CreateColor, GetColors } from '../../api/ColorApi';
import { Color } from '../../models/Color';
import { ColorsTable } from '../../utilities/tables/ColorsTable';
import {
	CreateColorModal,
	Values,
} from '../../utilities/modals/colors/CreateColorModal';

const { Title } = Typography;
const { Search } = Input;

const ColorsPage = () => {
	const [colors, setColors] = useState<Color[]>([]);
	const [filteredData, setFilteredData] = useState<Color[]>([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);

	const onEdit = async () => {
		GetColors().then((_colors) => {
			setColors(_colors);
			setSliderMin(Math.min(..._colors.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._colors.map((obj) => Number(obj.id))));
		});
	};

	const onDelete = async (color: Color) => {
		const key = 'colorAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from colors`,
				key,
				duration: 1,
			});

			GetColors().then((_colors) => {
				setColors(_colors);
				setSliderMin(Math.min(..._colors.map((obj) => Number(obj.id))));
				setSliderMax(Math.max(..._colors.map((obj) => Number(obj.id))));
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateColor({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'colorAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as color`,
					key,
					duration: 1,
				});

				GetColors().then((_colors) => {
					setColors(_colors);
					setSliderMin(Math.min(..._colors.map((obj) => Number(obj.id))));
					setSliderMax(Math.max(..._colors.map((obj) => Number(obj.id))));
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		document.title = `Colors | Задание 25`;
		setLoading(true);
		GetColors().then((_colors) => {
			setColors(_colors);
			setSliderMin(Math.min(..._colors.map((obj) => Number(obj.id))));
			setSliderMax(Math.max(..._colors.map((obj) => Number(obj.id))));
			setLoading(false);
		});
	}, []);

	let colorsTable: any;

	if (colors.length === 0) {
		colorsTable = <Skeleton active />;
	} else {
		colorsTable = (
			<ColorsTable
				colors={filteredData.length > 0 ? filteredData : colors}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Colors</Title>
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
						Add Color
					</Button>
					<Button
						style={{ marginInlineStart: 16 }}
						type='primary'
						onClick={() => {
							setLoading(true);

							GetColors().then((_colors) => {
								setColors(_colors);

								setSliderMin(Math.min(..._colors.map((obj) => Number(obj.id))));
								setSliderMax(Math.max(..._colors.map((obj) => Number(obj.id))));

								setLoading(false);
							});
						}}>
						<SyncOutlined spin={loading} />
						Refresh
					</Button>

					<CreateColorModal
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
					{colorsTable}
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
											const data = colors.filter((obj) =>
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
											const data = colors.slice(value[0] - 1, value[1]);

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

export { ColorsPage };
