import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { CallLog } from '@/types';
import { format } from 'date-fns';
import { MapPin, Phone, Calendar, TrendingUp } from 'lucide-react';
import Card from '@/components/common/Card';

// Fix for default markers in React Leaflet
import 'leaflet/dist/leaflet.css';

// Import Leaflet's default icon assets
import L from 'leaflet';

// Fix the default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Define custom icons for different call outcomes
const successIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#10B981"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M10 12.5L11.5 14L15 10.5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const followUpIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#3B82F6"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M12.5 8V12.5L15 15" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const nurtureIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#F59E0B"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M12.5 8C10 8 8 10 8 12.5C8 15 12.5 17 12.5 17S17 15 17 12.5C17 10 15 8 12.5 8Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const disqualifiedIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64=' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#EF4444"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M15 10L10 15M10 10L15 15" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const noResponseIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64=' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#6B7280"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M10 12.5H15M12.5 10V15" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const currentClientIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64=' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="#1E40AF"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <path d="M8 12.5L11 15.5L17 9.5" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface CallMapProps {
  callLogs: CallLog[];
}

interface CallLocation {
  callLog: CallLog;
  coordinates: LatLngExpression;
  address: string;
}

// Component to fit map bounds to markers
const FitBounds: React.FC<{ locations: CallLocation[] }> = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(loc => loc.coordinates as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  return null;
};

const CallMap: React.FC<CallMapProps> = ({ callLogs }) => {
  const [callLocations, setCallLocations] = useState<CallLocation[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Mock geocoding function - in production, this would use a real geocoding API
  const geocodeAddress = (_companyName: string, index: number): { coordinates: LatLngExpression; address: string } => {
    // Mock locations across different US regions
    const mockLocations = [
      { coordinates: [40.7128, -74.0060] as LatLngExpression, address: '123 Wall St, New York, NY 10005' }, // NYC
      { coordinates: [41.8781, -87.6298] as LatLngExpression, address: '456 Michigan Ave, Chicago, IL 60601' }, // Chicago
      { coordinates: [34.0522, -118.2437] as LatLngExpression, address: '789 Wilshire Blvd, Los Angeles, CA 90017' }, // LA
      { coordinates: [37.7749, -122.4194] as LatLngExpression, address: '321 Market St, San Francisco, CA 94105' }, // SF
      { coordinates: [42.3601, -71.0589] as LatLngExpression, address: '654 State St, Boston, MA 02109' }, // Boston
      { coordinates: [47.6062, -122.3321] as LatLngExpression, address: '987 Pike St, Seattle, WA 98101' }, // Seattle
      { coordinates: [32.7157, -117.1611] as LatLngExpression, address: '147 Harbor Dr, San Diego, CA 92101' }, // San Diego
      { coordinates: [39.9526, -75.1652] as LatLngExpression, address: '258 Market St, Philadelphia, PA 19103' }, // Philly
      { coordinates: [30.2672, -97.7431] as LatLngExpression, address: '369 Congress Ave, Austin, TX 78701' }, // Austin
      { coordinates: [33.4484, -112.0740] as LatLngExpression, address: '741 Central Ave, Phoenix, AZ 85004' }, // Phoenix
    ];
    
    // Use modulo to cycle through locations
    return mockLocations[index % mockLocations.length];
  };
  
  useEffect(() => {
    // Convert call logs to locations with mock coordinates
    const locations = callLogs.map((log, index) => {
      const { coordinates, address } = geocodeAddress(log.leadId, index);
      return {
        callLog: log,
        coordinates,
        address
      };
    });

    // Add some mock additional pins to demonstrate the new types
    const mockAdditionalPins: CallLocation[] = [
      {
        callLog: {
          id: 'mock-no-response-1',
          leadId: 'TechStart Solutions',
          outcome: 'no-response' as any,
          intel: 'No answer on multiple attempts',
          bestTalkingPoint: '',
          keyTakeaway: 'Try different time slots',
          createdAt: new Date(2024, 5, 18),
          callDuration: 0
        },
        coordinates: [41.2524, -95.9980], // Omaha
        address: '123 Business Park, Omaha, NE 68102'
      },
      {
        callLog: {
          id: 'mock-current-client-1',
          leadId: 'GlobalCorp Industries',
          outcome: 'current-client' as any,
          intel: 'Existing client - quarterly check-in',
          bestTalkingPoint: 'Renewal discussion',
          keyTakeaway: 'Very satisfied with services',
          createdAt: new Date(2024, 5, 15),
          callDuration: 25
        },
        coordinates: [35.2271, -80.8431], // Charlotte
        address: '456 Corporate Blvd, Charlotte, NC 28202'
      },
      {
        callLog: {
          id: 'mock-no-response-2',
          leadId: 'Mountain View LLC',
          outcome: 'no-response' as any,
          intel: 'Gatekeeper screening calls',
          bestTalkingPoint: '',
          keyTakeaway: 'Need better approach to reach decision maker',
          createdAt: new Date(2024, 5, 17),
          callDuration: 0
        },
        coordinates: [39.7392, -104.9903], // Denver
        address: '789 Mountain Dr, Denver, CO 80202'
      }
    ];

    setCallLocations([...locations, ...mockAdditionalPins]);
  }, [callLogs]);
  
  // Calculate regional statistics
  const calculateRegionalStats = () => {
    const regions: Record<string, { total: number; successful: number }> = {
      'Northeast': { total: 0, successful: 0 },
      'Midwest': { total: 0, successful: 0 },
      'West': { total: 0, successful: 0 },
      'South': { total: 0, successful: 0 }
    };
    
    callLocations.forEach((location) => {
      const [lat] = location.coordinates as [number, number];
      let region = 'Northeast';
      
      if (lat < 35) region = 'South';
      else if (lat < 40) region = 'Midwest';
      else if (lat > 42) region = 'West';
      
      regions[region].total++;
      if (location.callLog.outcome === 'meeting-booked' || location.callLog.outcome === 'follow-up') {
        regions[region].successful++;
      }
    });
    
    return regions;
  };
  
  const getMarkerIcon = (outcome: string) => {
    switch (outcome) {
      case 'meeting-booked':
        return successIcon;
      case 'follow-up':
        return followUpIcon;
      case 'nurture':
        return nurtureIcon;
      case 'disqualified':
        return disqualifiedIcon;
      case 'no-response':
        return noResponseIcon;
      case 'current-client':
        return currentClientIcon;
      default:
        return noResponseIcon; // Default to gray for unknown statuses
    }
  };
  
  const filteredLocations = selectedRegion === 'all' 
    ? callLocations 
    : callLocations.filter(loc => {
        const [lat] = loc.coordinates as [number, number];
        if (selectedRegion === 'Northeast' && lat >= 40 && lat <= 42) return true;
        if (selectedRegion === 'Midwest' && lat >= 35 && lat < 40) return true;
        if (selectedRegion === 'West' && lat > 42) return true;
        if (selectedRegion === 'South' && lat < 35) return true;
        return false;
      });
  
  const regionalStats = calculateRegionalStats();
  
  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 space-y-2">
          <h4 className="font-semibold text-gray-900">Filter by Region</h4>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Regions</option>
            <option value="Northeast">Northeast</option>
            <option value="Midwest">Midwest</option>
            <option value="West">West</option>
            <option value="South">South</option>
          </select>
        </div>
        
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={[39.8283, -98.5795]} // Center of USA
            zoom={4}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <FitBounds locations={filteredLocations} />
            
            {filteredLocations.map((location, index) => (
              <Marker
                key={`${location.callLog.id}-${index}`}
                position={location.coordinates}
                icon={getMarkerIcon(location.callLog.outcome)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-semibold text-gray-900 mb-2">{location.callLog.leadId}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium capitalize">{location.callLog.outcome.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{format(location.callLog.createdAt, 'MMM d, yyyy')}</span>
                      </div>
                      {location.callLog.intel && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
                          <p className="text-xs">{location.callLog.intel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      
      {/* Regional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(regionalStats).map(([region, stats]) => {
          const successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;
          return (
            <Card key={region} className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">{region}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Calls:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Successful:</span>
                  <span className="font-medium text-green-600">{stats.successful}</span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${successRate >= 50 ? 'text-green-600' : 'text-orange-600'}`} />
                    <span className={`font-bold ${successRate >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                      {successRate.toFixed(0)}% Success
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Map Legend */}
      <Card title="Map Legend">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <span className="text-sm">Meeting Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Follow-up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Nurture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            <span className="text-sm">Disqualified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
            <span className="text-sm">No Response</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-800 rounded-full"></div>
            <span className="text-sm">Current Client</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CallMap;