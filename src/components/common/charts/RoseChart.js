import React, { useState, useEffect } from 'react';
import { Rose } from '@ant-design/charts';
import { GetCars } from '../../../api/CarApi';
import { GetRents } from '../../../api/RentApi';
import { GetModels } from '../../../api/ModelApi';
import { GetManufacturers } from '../../../api/ManufacturerApi';

const RoseChart = () => {
	const [rents, setRents] = useState([]);
	const [cars, setCars] = useState([]);
	const [carModels, setCarModels] = useState([]);
	const [manufacturers, setManufacturers] = useState([]);

	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		GetRents().then((values) => {
			setRents(values);
			GetCars().then((vals) => {
				setCars(vals);
			});
		});
	}, []);

	var data = [
		{
			type: 'BMW',
			value: 27,
		},
		{
			type: 'Mitsubishi',
			value: 25,
		},
		{
			type: 'Mercedes-Benz',
			value: 18,
		},
		{
			type: 'Subaru',
			value: 15,
		},
		{
			type: '',
			value: 10,
		},
		{
			type: '',
			value: 5,
		},
	];
	return (
		<Rose
			{...{
				data: data,
				xField: 'type',
				yField: 'value',
				seriesField: 'type',
				radius: 0.9,
				legend: { position: 'bottom' },
			}}
		/>
	);
};

export default RoseChart;
