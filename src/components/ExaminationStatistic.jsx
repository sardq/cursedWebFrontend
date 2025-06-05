import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import CalendarComp from './CalendarComp';

const chartColors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

const ExaminationStatistics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statistics, setStatistics] = useState(null);
  const [selectedView, setSelectedView] = useState('total');

  const formatToLocalDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    useEffect(() => {
    axios.get('api/examination/statistic', {
      params: { 
       startDate:  formatToLocalDate(startDate), 
       endDate: formatToLocalDate(endDate) }
    }).then(response => {
        console.log(response.data);
        console.log(startDate);
        console.log(endDate);
      setStatistics(response.data);
    });
  }, [startDate, endDate]);

  const renderChart = () => {
    if (!statistics) return <p className="text-gray-300">Загрузка...</p>;

    if (selectedView === 'total') {
      return (
        <div className="text-center text-2xl font-semibold text-white mt-4">
          Общее количество обследований: {statistics.totalExaminations}
        </div>
      );
    }

    if (selectedView === 'type') {
      const typeData = Object.entries(statistics.examinationsByType || {}).map(([type, count]) => ({
        name: type,
        value: count
      }));

      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={typeData} cx="50%" cy="50%" outerRadius={100} label>
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb' }} />
            <Legend wrapperStyle={{ color: '#f9fafb' }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (selectedView === 'daily') {
      const dailyData = Object.entries(statistics.examinationsByDate || {}).map(([date, count]) => ({
        date,
        count
      }));

      return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid stroke="#374151" />
              <XAxis dataKey="date" stroke="#f9fafb" />
              <YAxis stroke="#f9fafb" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb' }} />
              <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-dark p-8">
    <div className="p-4 bg-gray-900 text-white rounded shadow">
       <h2 className="text-xl font-bold mb-4">Статистика обследований</h2>
            <div className="d-flex flex-row mb-2">
                <div className="col-6 col-md-4 col-lg-2 me-3">
                        <h6>Начало</h6>
                        <CalendarComp value={startDate} onChange={setStartDate} />
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <h6>Конец</h6>
                        <CalendarComp value={endDate} onChange={setEndDate} />
                      </div>
            </div>
      <div className="mb-4">
        <label className="mr-2 font-medium">Выберите тип отображения:</label>
        <select
          className="bg-dark border border-gray-600 text-white px-2 py-1 rounded"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
        >
          <option value="total">Общее количество</option>
          <option value="type">По типам обследований</option>
          <option value="daily">По дням</option>
        </select>
      </div>

      {renderChart()}
    </div>
    </div>
  );
};

export default ExaminationStatistics;