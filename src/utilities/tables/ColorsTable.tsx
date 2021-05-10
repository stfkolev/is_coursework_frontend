import React, { useState } from 'react';
import { Table, Space, notification, Popconfirm, Button, message } from 'antd';
import { Color } from '../../models/Color';
import { DeleteColor, UpdateColor } from '../../api/ColorApi';
import { EditColorModal } from '../modals/colors/EditColorModal';

const { Column } = Table;

interface ColorsTableProps {
	colors: Color[];
	onDelete: (color: Color) => void;
	onEdit: () => void;
}

const openNotification = (color: Color) => {
	notification['info']({
		message: 'Selected Color',
		description: `You have selected ${color?.name} color`,
		duration: 2,
	});
};

const ColorsTable: React.FC<ColorsTableProps> = ({
	colors,
	onEdit,
	onDelete,
}) => {
	const [pageSize, setPageSize] = useState(5);
	const [visible, setVisible] = useState(false);
	const [activeModalId, setActiveModalId] = useState(BigInt(0));

	const onEditInternal = async (values: Color) => {
		const result = await UpdateColor({
			id: values.id,
			name: values.name,
		});

		if (result === true) {
			const key = 'colorEdit';

			message.loading({ content: 'Loading...', key });
			setTimeout(() => {
				message.success({
					content: `Successfully edited the color name to '${values.name}'`,
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
		<Table
			dataSource={colors}
			rowKey='id'
			pagination={{
				showSizeChanger: true,
				onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
				pageSize: pageSize,
			}}>
			<Column
				title='Color ID'
				dataIndex='id'
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Color;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Name'
				dataIndex='name'
				sorter={(left: Color, right: Color) => {
					return left.name.localeCompare(right.name);
				}}
				onCell={(record, rowIndex) => {
					return {
						onClick: (event) => {
							const color = record as Color;

							openNotification(color);
						},
					};
				}}
			/>

			<Column
				title='Actions'
				key='actions'
				render={(text: any, record: Color) => (
					<Space size='middle'>
						<Popconfirm
							title='Are you sure delete this color?'
							okType='danger'
							onConfirm={async (event) => {
								const result = await DeleteColor(record);

								onDelete(result as Color);
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
							style={{ borderColor: '#e67e22', color: '#e67e22' }}>
							Edit
						</Button>

						{activeModalId === record.id && (
							<EditColorModal
								color={record}
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

export { ColorsTable };
