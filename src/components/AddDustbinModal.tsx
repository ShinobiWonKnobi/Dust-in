import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Dustbin } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AddDustbinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (dustbin: Omit<Dustbin, 'id'>) => void;
}

const AddDustbinModal: React.FC<AddDustbinModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (position) {
      onAdd({
        serialNumber,
        fillPercentage: 0,
        lat: position[0],
        lng: position[1],
      });
      setSerialNumber('');
      setPosition(null);
      onClose();
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Dustbin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Click on the map to set)
            </label>
            <MapContainer
              center={[12.823084, 80.044794]} // SRM KTR campus coordinates
              zoom={16}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEvents />
              {position && <Marker position={position} />}
            </MapContainer>
          </div>
          {position && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Selected coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={!position}
            >
              Add Dustbin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDustbinModal;