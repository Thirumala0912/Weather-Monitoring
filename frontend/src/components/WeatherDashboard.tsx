import api from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherDetails } from "./WeatherDetails";
import { DailySummary } from "./DailySummary";
import { OtherCities } from "./OtherCities";
import { WeatherVisualization } from "./Visualization";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import AlertForm from "./AlertForm";

import moment from "moment";
import { CITIES } from "@/utils/weatherUtils";

import { WeatherData } from "@/types/weather";


export default function WeatherDashboard() {
  const [city, setCity] = useState("Mumbai");
  const [tmp, setTmp] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [dailySummary, setDailySummary] = useState(null);
  const [otherCitiesData, setOtherCitiesData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
 const [currentLocationWeather, setCurrentLocationWeather] = useState<WeatherData | null>(null);
  const [isAutoLocation, setIsAutoLocation] = useState(false);
// 🔥 ADD THESE STATES AT TOP
const [savedCities, setSavedCities] = useState<string[]>([]);
const [newCity, setNewCity] = useState("");

const [showProfile, setShowProfile] = useState(false);

const userEmail = localStorage.getItem("email") || "user@gmail.com";
const userName = userEmail.split("@")[0];
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);
  useEffect(() => {
  detectLocation();
}, []);
useEffect(() => {
  fetchUserCities();
}, []);

const fetchUserCities = async () => {
  try {
    const res = await api.get("/auth/getCities");
    setSavedCities(res.data);
  } catch (err) {
    console.error(err);
  }
};

const addCity = async () => {
  if (!newCity) return;

  try {
    const res = await api.post("/auth/addCity", { city: newCity });
    setSavedCities(res.data);
    setNewCity("");
  } catch (err) {
    console.error(err);
  }
};

const removeCity = async (city: string) => {
  try {
    const res = await api.post("/auth/removeCity", { city });
    setSavedCities(res.data);
  } catch (err) {
    console.error(err);
  }
};
  const fetchWeatherData = async (city: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get(`/weather/${city}`);
      const data = res.data;
      setWeatherData(data);

      fetchDailySummary(city);
      fetchOtherCitiesData();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailySummary = async (city: string) => {
  try {
    const res = await api.get(`/summaries/${city}`); // ✅ FIXED
    setDailySummary(res.data[0]); // ✅ VERY IMPORTANT
  } catch (error) {
    console.error("Error fetching daily summary:", error);
  }
};

  const fetchOtherCitiesData = async () => {
    try {
      const promises = CITIES.map((city) =>
        api.get(`/weather/${city}`).then((res) => res.data)
          
        
      );
      const data: WeatherData[] = await Promise.all(promises);
      setOtherCitiesData(data);
    } catch (error) {
      console.error("Error fetching other cities data:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (tmp) {
    setCity(tmp);
    setIsAutoLocation(false); // 🔥 important
  }
};
const detectLocation = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        console.log("📍 Lat:", lat, "Lon:", lon);

        const weatherRes = await api.get(
          `/weather/coords?lat=${lat}&lon=${lon}`
        );

        console.log("✅ Exact Location Weather:", weatherRes.data);

        setCurrentLocationWeather(weatherRes.data);
        setIsAutoLocation(true);
      } catch (err) {
        console.log("Location error", err);
      }
    },

    (error) => {
      console.error("Geolocation error:", error);
    },

    {
      enableHighAccuracy: true,   // ✅ THIS IS THE FIX
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };


  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No weather data available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-100 to-purple-100">
      <nav className="flex justify-between items-center mb-4">
        <div style={{ marginBottom: "20px", background: "#fff", padding: "10px", borderRadius: "8px" }}>
  <h3>My Cities ⭐</h3>

  <input
    placeholder="Add city"
    value={newCity}
    onChange={(e) => setNewCity(e.target.value)}
  />
  <button onClick={addCity}>Add</button>

  <ul style={{ marginTop: "10px" }}>
  {savedCities.map((city, index) => (
    <li
      key={index}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        background: "#f5f5f5",
        padding: "6px 10px",
        borderRadius: "6px",
      }}
    >
      <span>{city}</span>

      <div>
        <button
          onClick={() => setCity(city)}
          style={{
            marginRight: "5px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View
        </button>

        <button
          onClick={() => removeCity(city)}
          style={{
            background: "#f44336",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>
</div>
        <h1 className="text-2xl font-bold">Weather Dashboard</h1>
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="flex mr-4">
            <Input
              name="searchCity"
              type="text"
              placeholder="Search city"
              className="rounded-r-none"
              onChange={(e) => setTmp(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              className="rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              {isPopoverOpen ? (
                <Button
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsPopoverOpen(true)}
                >
                  Set Alert
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <AlertForm />
            </PopoverContent>
          </Popover>

          <Switch
            className="ml-4"
            checked={isCelsius}
            onCheckedChange={toggleTemperatureUnit}
          />
          <span className="ml-2">{isCelsius ? "°C" : "°F"}</span>
      <div className="relative ml-4">

  {/* Profile Icon */}
  <div
    onClick={() => setShowProfile(!showProfile)}
    className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer"
  >
    {userName.charAt(0).toUpperCase()}
  </div>

  {/* Dropdown */}
  {showProfile && (
    <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl p-4 z-50">

      {/* User Info */}
      <div className="mb-3">
        <p className="font-semibold text-lg">{userName}</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
      </div>

      <hr className="mb-3" />

      

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
window.dispatchEvent(new Event("storage"));
        }}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>

    </div>
  )}
</div>
        </div>
      </nav>
      
      <main className="grid grid-cols-3 gap-4">
        {currentLocationWeather && (
  <Card className="col-span-3 bg-gradient-to-r from-yellow-100 to-red-100">
    <CardHeader>
      <CardTitle>
        📍 Current Location — Udupi  
{/* 📍 Current Location — {currentLocationWeather.name} */}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4">
  
  <CurrentWeather
    weatherData={currentLocationWeather}
    isCelsius={isCelsius}
  />

  <WeatherDetails weatherData={currentLocationWeather} />

  {/* ✅ ADD THIS BLOCK */}
  <Card className="col-span-1 bg-yellow-100">
    <CardContent className="p-4">
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span>🌅 Sunrise</span>
        </div>
        <div className="text-xl font-semibold">
          {moment
            .unix(currentLocationWeather.sys.sunrise)
            .utcOffset(currentLocationWeather.timezone / 60)
            .format("h:mm A")}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span>🌇 Sunset</span>
        </div>
        <div className="text-xl font-semibold">
          {moment
            .unix(currentLocationWeather.sys.sunset)
            .utcOffset(currentLocationWeather.timezone / 60)
            .format("h:mm A")}
        </div>
      </div>

    </CardContent>
  </Card>

</div>
    </CardContent>
  </Card>
)}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
 
  Forecast in {weatherData.name}, {weatherData.sys.country}
</CardTitle>
            <p>
              {moment
                .unix(Math.floor(Date.now() / 1000))
                .utcOffset(weatherData.timezone / 60)
                .format("YYYY-MM-DD h:mm A")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <CurrentWeather weatherData={weatherData} isCelsius={isCelsius} />
              <WeatherDetails weatherData={weatherData} />
              <Card className="col-span-1 bg-yellow-100">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span>🌅 Sunrise</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {moment
                        .unix(weatherData.sys.sunrise)
                        .utcOffset(weatherData.timezone / 60)
                        .format("h:mm A")}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span>🌇 Sunset</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {moment
                        .unix(weatherData.sys.sunset)
                        .utcOffset(weatherData.timezone / 60)
                        .format("h:mm A")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {dailySummary ? (
              <DailySummary dailySummary={dailySummary} isCelsius={isCelsius} />
            ) : (
              "No summary for this city"
            )}
            
          </CardContent>
        </Card>
        
        <OtherCities
          otherCitiesData={otherCitiesData}
          isCelsius={isCelsius}
          setCity={setCity}
        />
        
      </main>
      <WeatherVisualization city={city} isCelsius={isCelsius} />
    </div>

    
  );
}
