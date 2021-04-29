import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreatePowertrain, GetPowertrains } from '../../api/PowertrainApi';
import { Powertrain } from '../../models/Powertrain';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { PowertrainsTable } from '../../utilities/tables/PowertrainsTable';
import {
	CreatePowertrainModal,
	Values,
} from '../../utilities/modals/powertrains/CreatePowertrainModal';

const { Title } = Typography;

const PowertrainsPage = () => {
	const [powertrains, setPowertrains] = useState<Powertrain[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetPowertrains().then((_powertrains) => {
			setPowertrains(_powertrains);
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
		/*! If there are colors already loaded, refresh the page every 30s */
		if (powertrains.length > 0) {
			setTimeout(() => {
				GetPowertrains().then((_powertrains) => {
					setPowertrains(_powertrains);
				});
			}, 30000);
		} else {
			GetPowertrains().then((_powertrains) => {
				setPowertrains(_powertrains);
			});
		}
	}, [powertrains]);

	let colorsTable: any;

	if (powertrains.length === 0) {
		colorsTable = <Skeleton active />;
	} else {
		colorsTable = (
			<PowertrainsTable
				powertrains={powertrains}
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
						Add Powertrain
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

			<Row align='middle'>
				<Col span={16} offset={4}>
					{colorsTable}
				</Col>
			</Row>
		</>
	);
};

export { PowertrainsPage };
