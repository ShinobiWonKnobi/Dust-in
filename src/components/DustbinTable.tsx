import React, { useState } from 'react';
import { Dustbin } from '../types';
import { Trash2, ArrowUpDown } from 'lucide-react';

interface DustbinTableProps {
  dustbins: Dustbin[];
  onRemove: (id: number) => void;
}

const DustbinTable: React.FC<DustbinTableProps> = ({ dustbins, onRemove }) => {
  const [sortField, setSortField] = useState<keyof Dustbin>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  const sortedDustbins = [...dustbins].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredDustbins = sortedDustbins.filter(
    (dustbin) =>
      dustbin.serialNumber.toLowerCase().includes(filter.toLowerCase()) ||
      dustbin.fillPercentage.toString().includes(filter)
  );

  const handleSort = (field: keyof Dustbin) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFillLevelColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-200 text-green-800';
    if (percentage < 75) return 'bg-yellow-200 text-yellow-800';
    return 'bg-red-200 text-red-800';
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter dustbins..."
          className="w-full p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('id')}>
                Dustbin ID <ArrowUpDown className="inline-block ml-1" size={16} />
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('serialNumber')}>
                Serial Number <ArrowUpDown className="inline-block ml-1" size={16} />
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('fillPercentage')}>
                Fill Percentage <ArrowUpDown className="inline-block ml-1" size={16} />
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredDustbins.map((dustbin) => (
              <tr key={dustbin.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{dustbin.id}</td>
                <td className="py-3 px-6 text-left">{dustbin.serialNumber}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${getFillLevelColor(dustbin.fillPercentage)}`}>
                    {dustbin.fillPercentage}%
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => onRemove(dustbin.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DustbinTable;