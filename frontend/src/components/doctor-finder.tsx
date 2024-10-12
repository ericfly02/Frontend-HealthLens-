'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Cards"
import { Badge } from "./ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"
import { MapPin, User, Phone, Globe, Loader2 } from 'lucide-react'
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
  { value: "all", label: "All Specialties" },
  { value: "eye_care", label: "Eye Specialist" },
  { value: "dermatologist", label: "Skin Specialist" },
  { value: "nail_specialist", label: "Nail Specialist" },
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
    console.log('Fetching nearby doctors:', { lat, lng, specialty });
  
    try {
      const response = await fetch(`http://localhost:3001/map/nearby-doctors?lat=${lat}&lng=${lng}&specialty=${encodeURIComponent(specialty)}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
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
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1.5,
        projection: 'globe'
      })

      newMap.once('load', () => {
        const mapContainer = newMap.getContainer()
        mapContainer.style.height = '400px'
        newMap.resize()
      })

      newMap.on('style.load', () => {
        newMap.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        })
      })

      setMap(newMap)
    }

    if (map) {
      const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat
        fetchNearbyDoctors(lat, lng, selectedSpecialty)
        map.flyTo({ center: [lng, lat], zoom: 12, duration: 2000 })
        
        if (markerRef.current) {
          markerRef.current.remove()
        }
        
        const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)
        markerRef.current = newMarker
      }

      map.on('click', handleMapClick)

      return () => {
        map.off('click', handleMapClick)
      }
    }
  }, [map, fetchNearbyDoctors, selectedSpecialty])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Find a Doctor Near You</CardTitle>
          <CardDescription>Click on the map or select a specialty to find doctors in your area</CardDescription>
        </CardHeader>
        <CardContent>
          <div id="map" className="w-full h-[400px] rounded-lg overflow-hidden mb-4"></div>
          <div className="relative z-50">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full bg-background border border-input">
                <SelectValue placeholder="Select a specialty" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-input">
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value} className="cursor-pointer hover:bg-accent">
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Nearby Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : doctors.length > 0 ? (
            <ul className="space-y-4">
              {doctors.map((doctor) => (
                <li key={doctor.place_id} className="bg-secondary p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">{doctor.formatted_address}</span>
                      </div>
                    </div>
                    {doctor.rating && (
                      <Badge variant="secondary" className="ml-auto">
                        {doctor.rating.toFixed(1)} ★ ({doctor.user_ratings_total})
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {doctor.formatted_phone_number && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`tel:${doctor.formatted_phone_number}`} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                              <Phone className="h-4 w-4" />
                              <span className="sr-only">Call {doctor.name}</span>
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
                            <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                              <Globe className="h-4 w-4" />
                              <span className="sr-only">Visit {doctor.name}'s website</span>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visit website</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-primary">No doctors found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clicking on the map or selecting a different specialty.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DoctorFinder