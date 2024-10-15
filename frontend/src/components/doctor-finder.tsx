'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Cards"
import { Badge } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"
import { MapPin, User, Phone, Globe, Loader2, Stethoscope } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiZWdkMDIiLCJhIjoiY2x6enc2MDhuMWhnZTJqczJxZnRuaTBuMyJ9.uZI1DjOoxYv5HKIBxxpYwA'

interface Doctor {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  formatted_phone_number?: string
  website?: string
}

const specialties = [
  { value: "all", label: "All Specialties", icon: "🏥" },
  { value: "eye_care", label: "Eye Specialist", icon: "👁️" },
  { value: "dermatologist", label: "Skin Specialist", icon: "🧴" },
  { value: "nail_specialist", label: "Nail Specialist", icon: "💅" },
]

const DoctorFinder: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  const fetchNearbyDoctors = useCallback(async (lat: number, lng: number, specialty: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://backend-health-lens.vercel.app/map/nearby-doctors?lat=${lat}&lng=${lng}&specialty=${encodeURIComponent(specialty)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDoctors(data.results || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!map) {
      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [0, 0],
        zoom: 1,
        projection: 'globe'
      });

      newMap.once('load', () => {
        const mapContainer = newMap.getContainer()
        mapContainer.style.height = '400px'
        newMap.resize()
      });

      newMap.on('style.load', () => {
        newMap.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });
      });

      setMap(newMap);
    }

    if (map) {
      const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        fetchNearbyDoctors(lat, lng, selectedSpecialty);
        map.flyTo({ center: [lng, lat], zoom: 12, duration: 2000 });

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        markerRef.current = newMarker;
      }

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      }
    }
  }, [map, fetchNearbyDoctors, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-8 text-center">Find Your Healthcare Specialist</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center">
                <MapPin className="mr-2 h-6 w-6" />
                Locate Doctors
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Click on the map to find specialists in that area
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div id="map" className="w-full h-[400px] rounded-lg overflow-hidden mb-6 shadow-inner"></div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full bg-white border-2 border-indigo-300 rounded-lg hover:border-indigo-500 transition-colors">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto bg-white rounded-lg border-2 border-indigo-300">
                  {specialties.map((specialty) => (
                    <SelectItem
                      key={specialty.value}
                      value={specialty.value}
                      className="cursor-pointer hover:bg-indigo-100 transition-colors py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{specialty.icon}</span>
                        <span className="text-indigo-800">{specialty.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Stethoscope className="mr-2 h-6 w-6" />
                Nearby Doctors
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Discover healthcare professionals in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center py-20"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20 text-red-500"
                  >
                    {error}
                  </motion.div>
                ) : doctors.length > 0 ? (
                  <motion.ul
                    key="doctors-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 max-h-[600px] overflow-y-auto pr-4"
                  >
                    {doctors.map((doctor) => (
                      <motion.li
                        key={doctor.place_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-indigo-800">{doctor.name}</h3>
                            <div className="flex items-center mt-2 text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{doctor.formatted_address}</span>
                            </div>
                          </div>
                          {doctor.rating && (
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                              {doctor.rating.toFixed(1)} ★ ({doctor.user_ratings_total})
                            </Badge>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-2">
                          {doctor.formatted_phone_number && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a href={`tel:${doctor.formatted_phone_number}`} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                    <Phone className="h-5 w-5" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Call: {doctor.formatted_phone_number}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {doctor.website && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                    <Globe className="h-5 w-5" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Visit website</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.div
                    key="no-doctors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20"
                  >
                    <User className="mx-auto h-16 w-16 text-indigo-300" />
                    <h3 className="mt-4 text-xl font-semibold text-indigo-800">No doctors found</h3>
                    <p className="mt-2 text-gray-600">Try selecting a different location or specialty.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default DoctorFinder