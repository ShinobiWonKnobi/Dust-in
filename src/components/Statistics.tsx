import React from 'react';
import { Dustbin } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StatisticsProps {
  dustbins: Dustbin[];
}

const Statistics: React.FC<StatisticsProps> = ({ dustbins }) => {
  const totalDustbins = dustbins.length;
  const averageFillPercentage = Math.round(
    dustbins.reduce((sum, dustbin) => sum + dustbin.fillPercentage, 0) / totalDustbins
  );

  const fillLevels = [
    { name: 'Low (0-50%)', value: dustbins.filter(d => d.fillPercentage <= 50).length },
    { name: 'Medium (51-75%)', value: dustbins.filter(d => d.fillPercentage > 50 && d.fillPercentage <= 75).length },
    { name: 'High (76-100%)', value: dustbins.filter(d => d.fillPercentage > 75).length },
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  const fillPercentageData = dustbins.map(d => ({
    serialNumber: d.serialNumber,
    fillPercentage: d.fillPercentage
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Overview</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2">Total Dustbins: <span className="font-bold">{totalDustbins}</span></p>
          <p className="mb-2">Average Fill Percentage: <span className="font-bold">{averageFillPercentage}%</span></p>
          <p className="mb-2">Dustbins Needing Attention: <span className="font-bold text-red-500">{dustbins.filter(d => d.fillPercentage > 75).length}</span></p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Fill Level Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={fillLevels}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {fillLevels.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Dustbin Fill Percentages</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fillPercentageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="serialNumber" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="fillPercentage" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;