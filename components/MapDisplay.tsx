
import React from 'react';
import type { Coordinates } from '../types';

interface MapDisplayProps {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ location, loading, error }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg flex items-center justify-center h-64 md:h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-700 opacity-50"></div>
      <div className="absolute inset-0" style={{ backgroundImage: "url('https://picsum.photos/800/600?grayscale&blur=2')" }}></div>
      <div className="relative z-10 text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">GeoChat AI</h2>
        {loading && <p className="text-gray-300">Fetching your location...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {location && (
          <div className="text-green-400 bg-black bg-opacity-50 px-3 py-1 rounded-md">
            <p>Location Acquired</p>
            <p className="text-xs">
              Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
            </p>
          </div>
        )}
         {!loading && !location && !error && (
            <p className="text-yellow-400">Could not acquire location. Using a generic context.</p>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
