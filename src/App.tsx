import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, Plus, BarChart2, Table } from 'lucide-react';
import DustbinMap from './components/DustbinMap';
import DustbinTable from './components/DustbinTable';
import Statistics from './components/Statistics';
import AddDustbinModal from './components/AddDustbinModal';
import { Dustbin } from './types';
import NotificationSystem from './components/NotificationSystem';

const initialDustbins: Dustbin[] = [
  { id: 1, serialNumber: 'SRM001', fillPercentage: 75, lat: 12.823084, lng: 80.044794 },
  { id: 2, serialNumber: 'SRM002', fillPercentage: 30, lat: 12.824084, lng: 80.045794 },
  { id: 3, serialNumber: 'SRM003', fillPercentage: 90, lat: 12.822084, lng: 80.043794 },
  { id: 4, serialNumber: 'SRM004', fillPercentage: 50, lat: 12.825084, lng: 80.046794 },
  { id: 5, serialNumber: 'SRM005', fillPercentage: 10, lat: 12.821084, lng: 80.042794 },
];

type Tab = 'map' | 'statistics' | 'table';

function App() {
  const [dustbins, setDustbins] = useState<Dustbin[]>(initialDustbins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDustbins(prevDustbins =>
        prevDustbins.map(dustbin => {
          const newFillPercentage = Math.min(100, dustbin.fillPercentage + Math.floor(Math.random() * 2));
          if (newFillPercentage === 100 && dustbin.fillPercentage !== 100) {
            notifyFullDustbin(dustbin);
          }
          return { ...dustbin, fillPercentage: newFillPercentage };
        })
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const notifyFullDustbin = (dustbin: Dustbin) => {
    const message = `Dustbin ${dustbin.serialNumber} is full!`;
    setNotifications(prev => [...prev, message]);
    // In a real application, you would send an email and SMS here
    console.log(`Sending notification to ayushno413@gmail.com and +91 9081910031: ${message}`);
  };

  const addDustbin = (newDustbin: Omit<Dustbin, 'id'>) => {
    setDustbins(prevDustbins => [
      ...prevDustbins,
      { ...newDustbin, id: Math.max(...prevDustbins.map(d => d.id)) + 1 }
    ]);
  };

  const removeDustbin = (id: number) => {
    setDustbins(prevDustbins => prevDustbins.filter(dustbin => dustbin.id !== id));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'map':
        return <DustbinMap dustbins={dustbins} />;
      case 'statistics':
        return <Statistics dustbins={dustbins} />;
      case 'table':
        return <DustbinTable dustbins={dustbins} onRemove={removeDustbin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Trash2 className="mr-2" /> SRM KTR Automated Dustbin Dashboard
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Plus className="mr-2" /> Add Dustbin
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-4 flex">
          <button
            onClick={() => setActiveTab('map')}
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <MapPin className="inline-block mr-1" /> Map
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <BarChart2 className="inline-block mr-1" /> Statistics
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded ${activeTab === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <Table className="inline-block mr-1" /> Table
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          {renderTabContent()}
        </div>
      </main>

      <AddDustbinModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addDustbin}
      />

      <NotificationSystem notifications={notifications} />
    </div>
  );
}

export default App;