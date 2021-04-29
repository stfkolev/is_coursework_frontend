import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreateColor, GetColors } from '../../api/ColorApi';
import { Color } from '../../models/Color';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { ColorsTable } from '../../utilities/tables/ColorsTable';
import {
	CreateColorModal,
	Values,
} from '../../utilities/modals/colors/CreateColorModal';

const { Title } = Typography;

const ColorsPage = () => {
	const [colors, setColors] = useState<Color[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetColors().then((_colors) => {
			setColors(_colors);
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
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (colors.length > 0) {
			setTimeout(() => {
				GetColors().then((_colors) => {
					setColors(_colors);
				});
			}, 30000);
		} else {
			GetColors().then((_colors) => {
				setColors(_colors);
			});
		}
	}, [colors]);

	let colorsTable: any;

	if (colors.length === 0) {
		colorsTable = <Skeleton active />;
	} else {
		colorsTable = (
			<ColorsTable colors={colors} onEdit={onEdit} onDelete={onDelete} />
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
						Add Color
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

			<Row align='middle'>
				<Col span={16} offset={4}>
					{colorsTable}
				</Col>
			</Row>
		</>
	);
};

export { ColorsPage };
