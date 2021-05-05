import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import {
	CreateTransmission,
	GetTransmissions,
} from '../../api/TransmissionApi';
import { Transmission } from '../../models/Transmission';
// import { CreateColorModal, Values } from '../utilities/modals/CreateColorModal';
import { TransmissionsTable } from '../../utilities/tables/TransmissionsTable';
import {
	CreateTransmissionModal,
	Values,
} from '../../utilities/modals/transmissions/CreateTransmissionModal';

const { Title } = Typography;

const TransmissionsPage = () => {
	const [transmissions, setTransmissions] = useState<Transmission[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetTransmissions().then((_transmissions) => {
			setTransmissions(_transmissions);
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
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (transmissions.length > 0) {
			setTimeout(() => {
				GetTransmissions().then((_transmissions) => {
					setTransmissions(_transmissions);
				});
			}, 30000);
		} else {
			GetTransmissions().then((_transmissions) => {
				setTransmissions(_transmissions);
			});
		}
	}, [transmissions]);

	let transmissionsTable: any;

	if (transmissions.length === 0) {
		transmissionsTable = <Skeleton active />;
	} else {
		transmissionsTable = (
			<TransmissionsTable
				transmissions={transmissions}
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
						Add Transmission
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
				<Col span={16} offset={4}>
					{transmissionsTable}
				</Col>
			</Row>
		</>
	);
};

export { TransmissionsPage };
