import React, { useEffect, useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Engine } from '../../models/Engine';
import {
	DeleteEngine,
	UpdateEngine,
} from '../../api/EngineApi';
import { EditEngineModal } from '../modals/engines/EditEngineModal';
import { Powertrain } from '../../models/Powertrain';
import { Fuel } from '../../models/Fuel';
import { Transmission } from '../../models/Transmission';
import { GetPowertrains } from '../../api/PowertrainApi';
import { GetTransmissions } from '../../api/TransmissionApi';
import { GetFuels } from '../../api/FuelApi';


const { Column } = Table;

interface EnginesTableProps {
	engines: Engine[];
	onDelete: (engine: Engine) => void;
	onEdit: () => void;
}

const openNotification = (engine: Engine) => {
	notification['info']({
		message: 'Selected Engine',
		description: `You have selected ${engine?.name} engine`,
		duration: 2,
	});
};

const EnginesTable: React.FC<EnginesTableProps> = ({
	engines,
	onEdit,
	onDelete,
}) => {
	const [powertrains, setPowertrains] = useState<Powertrain[]>([]);
	const [transmissions, setTransmissions] = useState<Transmission[]>([]);
	const [fuels, setFuels] = useState<Fuel[]>([]);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	useEffect(() => {
		GetPowertrains().then((values) => {
			setPowertrains(values);
		});
		GetTransmissions().then((values) => {
			setTransmissions(values);
		});
		GetFuels().then((values) => {
			setFuels(values);
		});
	}, []);

	const onEditInternal = async (values: Engine) => {
		const result = await UpdateEngine({
			id: values.id,
			name: values.name,
			
			displacement: values.displacement,
			power: values.power,
			torque: values.torque,
			cyllinders: values.cyllinders,

			powertrainId: values.powertrainId,
			fuelId: values.fuelId,
			transmissionId: values.transmissionId,
		});

		if (result === true) {
			const key = 'engineEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the engine name to '${values.name}'`,
					key,
					duration: 1,
				});

				onEdit();
			}, 1000);
		}

		setVisible(false);
		setActiveModalId(BigInt(0));
	};
	return (
		<Table dataSource={engines} rowKey='id'>
			<Column
				title='Engine ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Engine, right: Engine) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Displacement'
				dataIndex='displacement'
				sorter={(left: Engine, right: Engine) => {
					return left.displacement - right.displacement;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Power'
				dataIndex='power'
				sorter={(left: Engine, right: Engine) => {
					return left.power - right.power;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Torque'
				dataIndex='torque'
				sorter={(left: Engine, right: Engine) => {
					return left.torque - right.torque;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Cyllinders'
				dataIndex='cyllinders'
				sorter={(left: Engine, right: Engine) => {
					return left.cyllinders - right.cyllinders;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Powertrain'
				dataIndex='powertrainId'
				render={(value, record, index) => {
					const data = powertrains.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>
			
			<Column
				title='Fuel'
				dataIndex='fuelId'
				render={(value, record, index) => {
					const data = fuels.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Transmission'
				dataIndex='transmissionId'
				render={(value, record, index) => {
					const data = transmissions.find((obj) => obj.id === value);

					return data === undefined ? value : data.name;
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const engine = record as Engine;

							openNotification(engine);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Engine) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this engine?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteEngine(record);

								onDelete(result as Engine);
							}}
							onCancel={(event) => {
								console.log(text);
							}}
							okText='Yes, Delete'
							cancelText='No, Cancel'>
							<Button type='dashed' danger>
								Delete
							</Button>
						</Popconfirm>

						<Button
							type='dashed'
							danger
							onClick={() => {
								setActiveModalId(record.id);
								setVisible(true);
							}}
							style={{
								borderColor: '#e67e22',
								color: '#e67e22',
							}}>
							Edit
						</Button>

						{activeModalId === record.id && (
							<EditEngineModal
								engine={record}
								visible={visible}
								onEdit={onEditInternal}
								onCancel={() => {
									setVisible(false);
								}}
							/>
						)}
					</Space>
				)}
			/>
		</Table>
	);
};

export { EnginesTable };
