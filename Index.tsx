import { useState, useEffect } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AQIGauge } from "@/components/AQIGauge";
import { AlertBanner } from "@/components/AlertBanner";
import { HealthTips } from "@/components/HealthTips";
import { PollutantDetails } from "@/components/PollutantDetails";
import { useToast } from "@/hooks/use-toast";

interface AirQualityData {
  aqi: number;
  qualityLevel: string;
  location: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  latitude?: number;
  longitude?: number;
}

const Index = () => {
  const [airQuality, setAirQuality] = useState<AirQualityData>({
    aqi: 85,
    qualityLevel: "Moderate",
    location: "Your Location",
    pm25: 35.4,
    pm10: 50.2,
    no2: 40.5,
    o3: 60.3,
    co: 500.0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getQualityLevel = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getBackgroundClass = (aqi: number): string => {
    if (aqi <= 50) return "bg-gradient-to-br from-emerald-50 to-teal-50";
    if (aqi <= 100) return "bg-gradient-to-br from-amber-50 to-yellow-50";
    if (aqi <= 150) return "bg-gradient-to-br from-orange-50 to-amber-50";
    if (aqi <= 200) return "bg-gradient-to-br from-red-50 to-orange-50";
    if (aqi <= 300) return "bg-gradient-to-br from-purple-50 to-pink-50";
    return "bg-gradient-to-br from-red-100 to-red-50";
  };

  const fetchAirQuality = async (latitude?: number, longitude?: number) => {
    setIsLoading(true);
    try {
      // For demo purposes, simulate API call with random data
      // In production, this would call OpenWeatherMap or similar API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const randomAqi = Math.floor(Math.random() * 300) + 20;
      const newData: AirQualityData = {
        aqi: randomAqi,
        qualityLevel: getQualityLevel(randomAqi),
        location: latitude ? `${latitude.toFixed(2)}°, ${longitude?.toFixed(2)}°` : "Your Location",
        pm25: Math.random() * 100,
        pm10: Math.random() * 150,
        no2: Math.random() * 200,
        o3: Math.random() * 150,
        co: Math.random() * 1000,
        latitude,
        longitude,
      };
      
      setAirQuality(newData);
      
      toast({
        title: "Air quality updated",
        description: `Current AQI: ${randomAqi} - ${getQualityLevel(randomAqi)}`,
      });
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "Could not retrieve air quality information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAirQuality(position.coords.latitude, position.coords.longitude);
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Using default location",
            variant: "destructive",
          });
          fetchAirQuality();
        }
      );
    } else {
      fetchAirQuality();
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass(airQuality.aqi)}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Air Quality Monitor
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{airQuality.location}</span>
            </div>
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={isLoading}
            size="lg"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Alert Banner */}
        <div className="mb-8">
          <AlertBanner aqi={airQuality.aqi} qualityLevel={airQuality.qualityLevel} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Gauge */}
          <div className="flex flex-col items-center justify-center">
            <AQIGauge aqi={airQuality.aqi} qualityLevel={airQuality.qualityLevel} />
          </div>

          {/* Right Column: Tips */}
          <div className="space-y-6">
            <HealthTips aqi={airQuality.aqi} />
            <PollutantDetails
              pm25={airQuality.pm25}
              pm10={airQuality.pm10}
              no2={airQuality.no2}
              o3={airQuality.o3}
              co={airQuality.co}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-slide-up">
          <p>Data updates every 5 minutes. Last updated: {new Date().toLocaleTimeString()}</p>
          <p className="mt-2">Stay safe and breathe easy! 🌱</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
