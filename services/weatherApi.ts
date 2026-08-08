import { WeatherData, WeatherCode, HourlyForecast, DailyForecast } from '../types/weather';
import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from '../constants/config';

// OpenWeather weather condition ID mapper
function mapOpenWeatherCodeToCode(id: number): WeatherCode {
  if (id >= 200 && id < 300) return 'Thunderstorm';
  if (id >= 300 && id < 400) return 'Drizzle';
  if (id >= 500 && id < 510) return 'Rain';
  if (id === 511) return 'Snow';
  if (id >= 520 && id < 600) return 'HeavyRain';
  if (id >= 600 && id < 700) return 'Snow';
  if (id >= 700 && id < 800) {
    if (id === 781) return 'Windy';
    return 'Fog';
  }
  if (id === 800) return 'Clear';
  if (id === 801) return 'MainlyClear';
  if (id === 802) return 'PartlyCloudy';
  if (id >= 803) return 'Overcast';
  return 'Clear';
}

function mapCodeToText(code: WeatherCode): string {
  switch (code) {
    case 'Clear': return 'Clear Sky';
    case 'MainlyClear': return 'Mostly Clear';
    case 'PartlyCloudy': return 'Partly Cloudy';
    case 'Overcast': return 'Overcast';
    case 'Fog': return 'Foggy';
    case 'Drizzle': return 'Light Drizzle';
    case 'Rain': return 'Rainy';
    case 'HeavyRain': return 'Heavy Rain';
    case 'Thunderstorm': return 'Thunderstorm';
    case 'Snow': return 'Snowy';
    case 'Windy': return 'Windy';
    default: return 'Clear';
  }
}

function formatTimeFromEpoch(epochSec: number): string {
  const date = new Date(epochSec * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // hour 0 is 12
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

export function createMockWeatherData(cityName: string, lat: number, lon: number): WeatherData {
  const now = new Date();
  const isNight = now.getHours() < 6 || now.getHours() > 19;
  
  let baseTempC = 28;
  if (cityName.toLowerCase().includes('dhaka')) baseTempC = 31;
  if (cityName.toLowerCase().includes('london')) baseTempC = 21;
  if (cityName.toLowerCase().includes('tokyo')) baseTempC = 26;
  if (cityName.toLowerCase().includes('new york')) baseTempC = 24;

  const tempF = Math.round((baseTempC * 9 / 5) + 32);

  const hourly: HourlyForecast[] = [];
  for (let i = 0; i < 24; i++) {
    const hourDate = new Date(now.getTime() + i * 3600000);
    const hourStr = `${hourDate.getHours().toString().padStart(2, '0')}:00`;
    const tempOffset = Math.sin((i / 24) * Math.PI * 2) * 4;
    const hTempC = Math.round(baseTempC + tempOffset);
    const pop = (i >= 15 && i <= 19) ? 65 : 10;
    const conditionCode: WeatherCode = pop > 50 ? 'Rain' : (i < 6 || i > 19 ? 'Clear' : 'PartlyCloudy');

    hourly.push({
      time: hourStr,
      tempC: hTempC,
      tempF: Math.round((hTempC * 9 / 5) + 32),
      conditionCode,
      conditionText: mapCodeToText(conditionCode),
      pop,
      precipMm: pop > 50 ? 2.4 : 0,
      humidity: Math.min(95, Math.max(45, 65 + Math.round(tempOffset * -2))),
      windSpeedKmh: 14 + (i % 5),
      uvIndex: (i >= 9 && i <= 16) ? Math.min(10, Math.round(Math.sin(((i - 9) / 7) * Math.PI) * 9 + 1)) : 0,
    });
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daily: DailyForecast[] = [];
  for (let d = 0; d < 7; d++) {
    const dayDate = new Date(now.getTime() + d * 86400000);
    const dayName = d === 0 ? 'Today' : daysOfWeek[dayDate.getDay()];
    const dateStr = dayDate.toISOString().split('T')[0];
    const pop = d === 1 || d === 4 ? 70 : 15;
    const conditionCode: WeatherCode = pop > 50 ? 'Rain' : (d % 2 === 0 ? 'PartlyCloudy' : 'Clear');
    const maxTempC = baseTempC + (d % 3) - 1;
    const minTempC = maxTempC - 6;

    daily.push({
      date: dateStr,
      dayName,
      conditionCode,
      conditionText: mapCodeToText(conditionCode),
      maxTempC,
      minTempC,
      maxTempF: Math.round((maxTempC * 9 / 5) + 32),
      minTempF: Math.round((minTempC * 9 / 5) + 32),
      pop,
      uvMax: 8,
      sunrise: '05:34 AM',
      sunset: '06:42 PM',
    });
  }

  return {
    city: cityName,
    country: 'BD',
    lat,
    lon,
    tempC: baseTempC,
    tempF,
    feelsLikeC: baseTempC + 2,
    feelsLikeF: Math.round(((baseTempC + 2) * 9 / 5) + 32),
    tempMinC: baseTempC - 5,
    tempMaxC: baseTempC + 3,
    tempMinF: Math.round(((baseTempC - 5) * 9 / 5) + 32),
    tempMaxF: Math.round(((baseTempC + 3) * 9 / 5) + 32),
    conditionCode: isNight ? 'Clear' : 'PartlyCloudy',
    conditionText: isNight ? 'Clear Night' : 'Partly Cloudy',
    humidity: 68,
    windSpeedKmh: 16,
    windSpeedMph: 10,
    windDirectionDeg: 140,
    pressureHpa: 1012,
    visibilityKm: 10,
    dewPointC: 22,
    uvIndex: isNight ? 0 : 7,
    aqi: {
      aqi: 64,
      label: 'Moderate',
      color: '#FFC107',
      pm25: 18.4,
      pm10: 34.2,
      o3: 45.0,
      no2: 12.1,
    },
    sunrise: '05:34 AM',
    sunset: '06:42 PM',
    daylightHours: '13h 08m',
    hourly,
    daily,
    alert: cityName.toLowerCase().includes('dhaka') ? {
      title: 'Monsoon Rain Advisory',
      description: 'Moderate to heavy rain expected around 5:00 PM with gusty winds.',
      severity: 'advisory'
    } : undefined,
    lastUpdated: Date.now(),
  };
}

export async function fetchWeatherFromApi(cityName: string, lat: number, lon: number): Promise<WeatherData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const weatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const pollutionUrl = `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;

    const [weatherRes, forecastRes, pollutionRes] = await Promise.allSettled([
      fetch(weatherUrl, { signal: controller.signal }),
      fetch(forecastUrl, { signal: controller.signal }),
      fetch(pollutionUrl, { signal: controller.signal }),
    ]);

    clearTimeout(timeoutId);

    if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
      throw new Error(`OpenWeather current weather fetch failed`);
    }

    const currentData = await weatherRes.value.json();

    let forecastData: any = null;
    if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
      forecastData = await forecastRes.value.json();
    }

    let pollutionData: any = null;
    if (pollutionRes.status === 'fulfilled' && pollutionRes.value.ok) {
      pollutionData = await pollutionRes.value.json();
    }

    // Current weather data extraction
    const tempC = Math.round(currentData.main.temp);
    const feelsLikeC = Math.round(currentData.main.feels_like);
    const conditionCode = mapOpenWeatherCodeToCode(currentData.weather[0]?.id || 800);
    const conditionText = currentData.weather[0]?.description
      ? currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1)
      : mapCodeToText(conditionCode);

    const windSpeedKmh = Math.round((currentData.wind?.speed || 0) * 3.6);
    const windSpeedMph = Math.round(windSpeedKmh * 0.621371);
    const humidity = currentData.main?.humidity || 65;
    const pressureHpa = Math.round(currentData.main?.pressure || 1013);
    const visibilityKm = Math.round((currentData.visibility || 10000) / 1000);
    const dewPointC = Math.round(tempC - ((100 - humidity) / 5));

    const sunrise = currentData.sys?.sunrise ? formatTimeFromEpoch(currentData.sys.sunrise) : '05:30 AM';
    const sunset = currentData.sys?.sunset ? formatTimeFromEpoch(currentData.sys.sunset) : '06:30 PM';

    // Calculate daylight hours string
    let daylightHours = '12h 00m';
    if (currentData.sys?.sunrise && currentData.sys?.sunset) {
      const diffSec = currentData.sys.sunset - currentData.sys.sunrise;
      const hrs = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      daylightHours = `${hrs}h ${mins.toString().padStart(2, '0')}m`;
    }

    // Parse Hourly (from 3-hour 5-day forecast)
    const hourly: HourlyForecast[] = [];
    if (forecastData && forecastData.list) {
      const list = forecastData.list.slice(0, 12); // Next ~36 hrs
      list.forEach((item: any) => {
        const timeDate = new Date(item.dt * 1000);
        const hCode = mapOpenWeatherCodeToCode(item.weather[0]?.id || 800);
        const hTemp = Math.round(item.main.temp);
        const pop = Math.round((item.pop || 0) * 100);
        const hourNumber = timeDate.getHours();

        hourly.push({
          time: `${hourNumber.toString().padStart(2, '0')}:00`,
          tempC: hTemp,
          tempF: Math.round((hTemp * 9 / 5) + 32),
          conditionCode: hCode,
          conditionText: mapCodeToText(hCode),
          pop,
          precipMm: item.rain?.['3h'] ? Math.round(item.rain['3h'] * 10) / 10 : (pop > 40 ? 1.2 : 0),
          humidity: item.main.humidity || 60,
          windSpeedKmh: Math.round((item.wind?.speed || 0) * 3.6),
          uvIndex: (hourNumber >= 9 && hourNumber <= 16) ? Math.min(10, Math.round(Math.sin(((hourNumber - 9) / 7) * Math.PI) * 8 + 1)) : 0,
        });
      });
    }

    // Parse Daily (grouped by date)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyMap: { [dateStr: string]: any } = {};

    if (forecastData && forecastData.list) {
      forecastData.list.forEach((item: any) => {
        const dateStr = item.dt_txt.split(' ')[0];
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = {
            tempsMax: [],
            tempsMin: [],
            pops: [],
            codes: [],
            dt: item.dt,
          };
        }
        dailyMap[dateStr].tempsMax.push(item.main.temp_max);
        dailyMap[dateStr].tempsMin.push(item.main.temp_min);
        dailyMap[dateStr].pops.push(item.pop || 0);
        dailyMap[dateStr].codes.push(item.weather[0]?.id || 800);
      });
    }

    const daily: DailyForecast[] = [];
    const dates = Object.keys(dailyMap).slice(0, 7);

    dates.forEach((dateStr, idx) => {
      const dayData = dailyMap[dateStr];
      const dayDate = new Date(dayData.dt * 1000);
      const maxC = Math.round(Math.max(...dayData.tempsMax));
      const minC = Math.round(Math.min(...dayData.tempsMin));
      const popMax = Math.round(Math.max(...dayData.pops) * 100);

      // Take middle weather code of day
      const repCodeId = dayData.codes[Math.floor(dayData.codes.length / 2)] || 800;
      const dCode = mapOpenWeatherCodeToCode(repCodeId);

      daily.push({
        date: dateStr,
        dayName: idx === 0 ? 'Today' : daysOfWeek[dayDate.getDay()],
        conditionCode: dCode,
        conditionText: mapCodeToText(dCode),
        maxTempC: maxC,
        minTempC: minC,
        maxTempF: Math.round((maxC * 9 / 5) + 32),
        minTempF: Math.round((minC * 9 / 5) + 32),
        pop: popMax,
        uvMax: 7,
        sunrise,
        sunset,
      });
    });

    // Parse Air Pollution / AQI
    let aqiObject = {
      aqi: 45,
      label: 'Good',
      color: '#4CAF50',
      pm25: 12.0,
      pm10: 24.0,
      o3: 35.0,
      no2: 8.5,
    };

    if (pollutionData && pollutionData.list && pollutionData.list.length > 0) {
      const pItem = pollutionData.list[0];
      const owAqi = pItem.main?.aqi || 2; // 1 to 5
      const components = pItem.components || {};

      let aqiVal = 45;
      let label = 'Good';
      let color = '#4CAF50';

      if (owAqi === 1) { aqiVal = 25; label = 'Good'; color = '#4CAF50'; }
      else if (owAqi === 2) { aqiVal = 55; label = 'Fair'; color = '#8BC34A'; }
      else if (owAqi === 3) { aqiVal = 85; label = 'Moderate'; color = '#FFC107'; }
      else if (owAqi === 4) { aqiVal = 135; label = 'Poor'; color = '#FF9800'; }
      else if (owAqi === 5) { aqiVal = 185; label = 'Very Poor'; color = '#F44336'; }

      aqiObject = {
        aqi: aqiVal,
        label,
        color,
        pm25: Math.round((components.pm2_5 || 12.0) * 10) / 10,
        pm10: Math.round((components.pm10 || 24.0) * 10) / 10,
        o3: Math.round((components.o3 || 35.0) * 10) / 10,
        no2: Math.round((components.no2 || 8.5) * 10) / 10,
      };
    }

    const currentUv = hourly[0]?.uvIndex || 6;

    const displayCityName = (cityName && cityName !== 'Current Location')
      ? cityName
      : (currentData.name || cityName || 'Current Location');

    return {
      city: displayCityName,
      country: currentData.sys?.country || '',
      lat,
      lon,
      tempC,
      tempF: Math.round((tempC * 9 / 5) + 32),
      feelsLikeC,
      feelsLikeF: Math.round((feelsLikeC * 9 / 5) + 32),
      tempMinC: daily[0]?.minTempC ?? (tempC - 4),
      tempMaxC: daily[0]?.maxTempC ?? (tempC + 4),
      tempMinF: Math.round(((daily[0]?.minTempC ?? (tempC - 4)) * 9 / 5) + 32),
      tempMaxF: Math.round(((daily[0]?.maxTempC ?? (tempC + 4)) * 9 / 5) + 32),
      conditionCode,
      conditionText,
      humidity,
      windSpeedKmh,
      windSpeedMph,
      windDirectionDeg: currentData.wind?.deg || 180,
      pressureHpa,
      visibilityKm,
      dewPointC,
      uvIndex: currentUv,
      aqi: aqiObject,
      sunrise,
      sunset,
      daylightHours,
      hourly: hourly.length > 0 ? hourly : createMockWeatherData(cityName, lat, lon).hourly,
      daily: daily.length > 0 ? daily : createMockWeatherData(cityName, lat, lon).daily,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.warn('OpenWeather API fetch error, falling back to mock weather data:', error);
    return createMockWeatherData(cityName, lat, lon);
  }
}
