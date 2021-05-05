import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreateFuel, GetFuels } from '../../api/FuelApi';
import { Fuel } from '../../models/Fuel';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { FuelsTable } from '../../utilities/tables/FuelsTable';
import {
	CreateFuelModal,
	Values,
} from '../../utilities/modals/fuels/CreateFuelModal';

const { Title } = Typography;

const FuelsPage = () => {
	const [fuels, setFuels] = useState<Fuel[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetFuels().then((_fuels) => {
			setFuels(_fuels);
		});
	};

	const onDelete = async (color: Fuel) => {
		const key = 'fuelAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from fuels`,
				key,
				duration: 1,
			});

			GetFuels().then((_fuels) => {
				setFuels(_fuels);
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateFuel({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'fuelAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as fuel`,
					key,
					duration: 1,
				});

				GetFuels().then((_fuels) => {
					setFuels(_fuels);
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (fuels.length > 0) {
			setTimeout(() => {
				GetFuels().then((_fuels) => {
					setFuels(_fuels);
				});
			}, 30000);
		} else {
			GetFuels().then((_fuels) => {
				setFuels(_fuels);
			});
		}
	}, [fuels]);

	let fuelsTable: any;

	if (fuels.length === 0) {
		fuelsTable = <Skeleton active />;
	} else {
		fuelsTable = (
			<FuelsTable fuels={fuels} onEdit={onEdit} onDelete={onDelete} />
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Fuels</Title>
				</Col>
			</Row>
			<Row align='middle'>
				<Col span={16} offset={4}>
					<Button
						type='dashed'
						onClick={() => {
							setVisible(true);
						}}>
						Add Fuel
					</Button>

					<CreateFuelModal
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
					{fuelsTable}
				</Col>
			</Row>
		</>
	);
};

export { FuelsPage };
