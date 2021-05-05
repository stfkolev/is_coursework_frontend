import { useState, useEffect } from 'react';
import { Col, Row, Typography, Skeleton, Button, message } from 'antd';

import { CreateCarType, GetCarTypes } from '../../api/CarTypeApi';
import { CarType } from '../../models/CarType';
import { CarTypesTable } from '../../utilities/tables/CarTypesTable';
import {
	CreateCarTypeModal,
	Values,
} from '../../utilities/modals/carTypes/CreateCarTypeModal';

const { Title } = Typography;

const CarTypesPage = () => {
	const [carTypes, setCarTypes] = useState<CarType[]>([]);
	const [visible, setVisible] = useState(false);

	const onEdit = async () => {
		GetCarTypes().then((_carTypes) => {
			setCarTypes(_carTypes);
		});
	};

	const onDelete = async (color: CarType) => {
		const key = 'carTypeAdd';

		message.loading({ content: 'Loading...', key });

		setTimeout(() => {
			message.success({
				content: `Successfully deleted '${color.name}' from car types`,
				key,
				duration: 1,
			});

			GetCarTypes().then((_carTypes) => {
				setCarTypes(_carTypes);
			});
		}, 1000);
	};

	const onCreate = async (values: Values) => {
		const result = await CreateCarType({ name: values.name });

		if (result.hasOwnProperty('name')) {
			const key = 'carTypeAdd';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully added '${values.name}' as car type`,
					key,
					duration: 1,
				});

				GetCarTypes().then((_carTypes) => {
					setCarTypes(_carTypes);
				});
			}, 1000);
		}

		setVisible(false);
	};

	useEffect(() => {
		/*! If there are colors already loaded, refresh the page every 30s */
		if (carTypes.length > 0) {
			setTimeout(() => {
				GetCarTypes().then((_carTypes) => {
					setCarTypes(_carTypes);
				});
			}, 30000);
		} else {
			GetCarTypes().then((_carTypes) => {
				setCarTypes(_carTypes);
			});
		}
	}, [carTypes]);

	let carTypesTable: any;

	if (carTypes.length === 0) {
		carTypesTable = <Skeleton active />;
	} else {
		carTypesTable = (
			<CarTypesTable carTypes={carTypes} onEdit={onEdit} onDelete={onDelete} />
		);
	}

	return (
		<>
			<Row justify='center' align='middle'>
				<Col>
					<Title>Car Types</Title>
				</Col>
			</Row>
			<Row align='middle'>
				<Col span={16} offset={4}>
					<Button
						type='dashed'
						onClick={() => {
							setVisible(true);
						}}>
						Add Car Type
					</Button>

					<CreateCarTypeModal
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
					{carTypesTable}
				</Col>
			</Row>
		</>
	);
};

export { CarTypesPage };
