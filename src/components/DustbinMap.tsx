import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface DustbinMapProps {
  dustbins: Dustbin[];
}

const DustbinMap: React.FC<DustbinMapProps> = ({ dustbins }) => {
  return (
    <MapContainer
      center={[12.823084, 80.044794]}
      zoom={16}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {dustbins.map((dustbin) => (
        <Marker key={dustbin.id} position={[dustbin.lat, dustbin.lng]}>
          <Popup>
            <div>
              <h3 className="font-semibold">Dustbin {dustbin.serialNumber}</h3>
              <p>Fill Level: {dustbin.fillPercentage}%</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DustbinMap;