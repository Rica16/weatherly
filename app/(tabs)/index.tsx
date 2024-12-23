import { FlatList, Image, StyleSheet, Platform, View, Text,TouchableOpacity, SafeAreaView, ImageBackground, ActivityIndicator, ScrollView, Button, Alert,  BackHandler, Linking} from 'react-native';
import { FontAwesome6, Fontisto, Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';





interface WeatherData {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    vis_km: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast?: {
    forecastday: {
      hour: {
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      }[];
    }[];
  };
}




export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [cities, setCities] = useState([]); 
  const [activeSlide, setActiveSlide] = useState(0); 
  const [addedCities, setAddedCities] = useState([]);



  const handleOpenURL = () => {
    Linking.openURL('https://www.msn.com/en-ph/weather/forecast/in-Cebu,Central-Visayas?loc=eyJsIjoiQ2VidSIsInIiOiJDZW50cmFsIFZpc2F5YXMiLCJjIjoiUGhpbGlwcGluZXMiLCJpIjoiUEgiLCJnIjoiZW4tdXMiLCJ4IjoiMTIzLjg3MzEwNzkxMDE1NjI1IiwieSI6IjEwLjMxNjU5MTI2MjgxNzM4MyIsIm0iOiJTaWJhbG9tIiwibyI6dHJ1ZX0%3D&weadegreetype=F&ocid=winp2fptaskbar&cvid=434e0c8469574ce38957958488c79967').catch(err =>
    console.error("Failed to open URL:", err)
  );
};


useEffect(() => {
  const loadCities = async () => {
    try {
      const savedCities = await AsyncStorage.getItem('ManageCities');
      if (savedCities) {
        setAddedCities(JSON.parse(savedCities));
      }
    } catch (error) {
      console.error('Error loading cities from storage:', error);
    }
  };

  loadCities();
}, []);


const handleExit = () => {
  if (Platform.OS === 'android') {
    BackHandler.exitApp(); 
  } else {
   
    Alert.alert(
      "Exit App",
      "Exiting is not supported on iOS. You can manually close the app from the App Switcher.",
      [
        {
          text: "OK",
        },
      ]
    );
  }
};


  const apiKey = '39f3c03f378b4df0b9180249242110';
  const city = 'Sibalom';

  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    const getWeatherData = async () => {
      const data = await fetchWeather();
      if (data) {
        setWeatherData(data);
        setLoading(false);
      } else {
        setError('Could not fetch weather data');
        setLoading(false);
      }
    };

    getWeatherData();
    loadCities();
  }, []);

  const fetchWeather = async (): Promise<WeatherData | null> => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };
  

  const loadCities = async () => {
    const savedCities = await AsyncStorage.getItem('cities');
    if (savedCities) {
      setCities(JSON.parse(savedCities));
    }
  };

const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit'});
  return `${date} . ${time}`;
}

useEffect(() => {
  fetchWeather();
  setDateTime(getFormattedDateTime());

  const interval = setInterval(() => {
    setDateTime(getFormattedDateTime());
  }, 60000);

  return () => clearInterval(interval);
}, []);

const toggleMenu = () => {
  setMenuVisible(!menuVisible);
};



  if (loading) {
    return (
      <View style={styles.Cont}>
        <ActivityIndicator size="large" color="#004999"/>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.Cont}>
        <Text style={styles.error}>{error}</Text>
      </View>
    )
  }
  
  const weatherIconUrl = weatherData ? `https:${weatherData.current.condition.icon}` : '';

  return (
   <SafeAreaView style={styles.Container}>
    <ImageBackground blurRadius={80} source={require('../../assets/images/bg.png')}
    style={styles.ImgBg}>

    <View style={styles.TopBar}>
    <TouchableOpacity onPress={toggleMenu}>
      <Ionicons style={styles.Menu_icon} name='menu' size={40} color={'#001833'}/>
    </TouchableOpacity>
    </View>

    {menuVisible && (
      <View style={styles.DropdownMenu}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageCities')}>
          <Text style={styles.MenuItem}>Manage Cities</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.MenuItem}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleExit}>
          <Text style={styles.MenuItem}>Exit</Text>
        </TouchableOpacity>
      </View>
    )}
    

  
  <View>
    <View style={styles.Box}>
      <Ionicons style={styles.LocationIcon} name='location' size={35} color={'#001833'}/> 
      {weatherData && (
      <Text style={styles.TextLocation}>{weatherData.location.name}</Text>
      )}
    </View>
  </View >

    <View style={styles.ImgContainer}>
    {weatherData && (
      <>
         <Image source={{ uri: weatherIconUrl }} style={styles.WeatherIcon} />
      </>
    )}
    <View style={styles.TempDes}>
    {weatherData && (
           <Text style={styles.Temp}>{weatherData.current.temp_c}°C</Text>
    )} 
    {weatherData && (
            <Text style={styles.Description}>{weatherData.current.condition.text}</Text>
          )}
    </View>

   <View>
     <Text style={styles.Date}>{dateTime}</Text>
   </View>
    </View>

<View>
  <TouchableOpacity
    style={styles.Button}
    onPress={() => navigation.navigate('NextDayForecast')}>
    <Text style={styles.NDtext}>Next Days</Text>
    <Ionicons style={styles.Arrow} name='arrow-forward' size={20} color="#001833"/>
  </TouchableOpacity>
</View>


   <View>
  <View style={styles.ForecastContainer}>
  <View>
    <Text style={styles.ForecastTitle}>Today's Forecast</Text>
  </View >

  <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/moderaterain.png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>12:56 PM</Text>
  </View>

  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/heavyrain.png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>1:56 PM</Text>
  </View>

  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/mist.png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>2:56 PM</Text>
  </View>

  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/Storm (2).png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>3:56 PM</Text>
  </View>

  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/sun.png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>4:56 PM</Text>
  </View>

  <View style={styles.HourlyCard}>
  {weatherData && (
           <Text style={styles.HourTemp}>{weatherData.current.temp_c}°C</Text>
    )} 
    <Image source={require('../../assets/images/moderaterain.png')} style={styles.HourlyIcon}/>
    <Text style={styles.HourText}>5:56 PM</Text>
  </View>
  </ScrollView>
</View>
   </View>


<View>
  <TouchableOpacity
    style={styles.ExtendedCont}
    onPress={handleOpenURL}>
    <Text style={styles.EFText}>Extended Forecast</Text>
    <Ionicons style={styles.Arrow} name='arrow-forward' size={20} color="#001833"/>
  </TouchableOpacity>
</View>


<View style={styles.AdditionalInfo}>
  {weatherData && (
    <>
    <View style={styles.Box1}>
    <View style={styles.Boxdaman}>
      <View style={styles.Boxlang3}>
      <Fontisto name='wind' size={25} color='#003166'/>
      <Text style={styles.Textlang}>Wind</Text>
      </View>
      <Text style={styles.InfoText}>{weatherData.current.wind_kph} kph</Text>
    </View>

    <View style={styles.Boxdaman}>
      <View style={styles.Boxlang2}>
      <FontAwesome name='tint' size={25} color='#003166'/>
      <Text style={styles.Textlang2}>Humidity</Text>
      </View>
      <Text style={styles.InfoText}>{weatherData.current.humidity} %</Text>
    </View>
    </View>


  <View style={styles.Box2}>
    <View style={styles.Boxdaman}>
      <View style={styles.Boxlang}> 
      <FontAwesome name='thermometer-half' size={25} color='#003166'/>
      <Text style={styles.Textlang1}>Pressure</Text>
      </View>
      <Text style={styles.InfoText}>{weatherData.current.pressure_mb} hPa</Text>
    </View>

    <View style={styles.Boxdaman}>
        <View style={styles.Boxlang4}>
          <FontAwesome5 name='eye' size={25} color='#003166'/>
          <Text style={styles.Textlang1}>Visibility</Text>
        </View>
        <Text style={styles.InfoText}>{weatherData.current.vis_km} km</Text>
      </View>
  </View>
    </>
  )}
</View>



  </ImageBackground>
</SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    position: 'relative',
   },
  ImgBg: {
    position: 'absolute',
    height: '130%',
    width: '100%',
  },
  Menu_icon: {
   paddingTop:10,
   alignSelf:'flex-end',
   top: 10,
  },
  LocationIcon: {
    marginLeft:20,
  },
  TextLocation: {
    fontSize: 35,
    fontFamily: 'Poppins-Bold',
    color: '#001833', 
  },
  Box: {
    flexDirection: 'row', 
    alignItems: 'center', 
    bottom: 20,
  },
 ImgContainer: {
  alignItems: 'center',
  flex: 1,
 },
 Cont: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#cce4ff',
 },
 error: {
  fontSize: 18,
  color: 'red',
 },
 Temp: {
  fontSize: 35,
  color: '#001833',
  fontFamily: 'Poppins-SemiBold',
 },
 Date: {
  fontSize: 20,
  color: '#001833',
  bottom: 40,
  fontFamily: 'Poppins-SemiBold',
},
Description: {
  fontSize: 20,
  color: '#001833',
  fontFamily: 'Poppins-Medium',
},
TempDes: {
  flexDirection: 'row', 
  alignItems: 'center', 
  marginLeft: 10,
  gap: 10,
  bottom: 30,
},
NDtext: {
  fontSize: 20,
  fontFamily: 'Poppins-SemiBold',
  color: '#001833',
},
Button: {
  alignItems: 'center',
  alignSelf: 'center',
  width: 200,
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 10,
  backgroundColor: 'rgba(102, 175, 255, 1)',
  paddingVertical: 4,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 8,
  bottom: 120,
  position: 'absolute',
  height: 50,
},
Arrow: {
alignSelf: 'center',
},
ForecastContainer: {
  margin: 20,
  bottom: 140,
},
ForecastTitle: {
  fontSize: 25,
  fontFamily: 'Poppins-Bold',
  color: '#001833',
  marginBottom: 10,
  top: 10,
},
HourlyCard: {
  backgroundColor: 'rgba(0, 49, 102, 0.3)',
  borderRadius: 10,
  padding: 10,
  marginRight: 15,
  bottom: 10,
  alignItems: 'center',
  width: 150,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
},
HourText: {
  fontSize: 20,
  fontFamily: 'Poppins-Medium',
  color: '#cce4ff',
},
HourlyIcon: {
  width: 50,
  height: 50,
},
HourTemp: {
  fontSize: 20,
  fontFamily: 'Poppins-Medium',
  color: '#cce4ff',
  marginBottom: 5,
},
ExtendedCont: {
  alignItems: 'center',
  width: 250, 
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 10,
  backgroundColor: 'rgba(102, 175, 255, 1)',
  paddingVertical: 4,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 12,
  marginLeft: 80,
  bottom: 115,
  position: 'absolute',
  height: 50,
},
EFText: {
  fontSize: 20,
  color: '#001833',
  fontFamily: 'Poppins-SemiBold',
},
AdditionalInfo: {
  gap: 10,
  alignSelf: 'center',
},
InfoBox: {
  alignItems: 'center',
},
InfoText: {
  fontSize: 20,
  color: '#e5f2ff',
  fontFamily: 'Poppins-Medium',
},
Boxlang: {
  flexDirection: 'row', 
  right: 30,
},
Boxlang2: {
  flexDirection: 'row', 
  right: 25,
},
Boxlang3: {
  flexDirection: 'row', 
  gap: 10,
  right: 30,
},
Boxlang4: {
  flexDirection: 'row', 
  right: 25,
},
Textlang: {
  fontSize: 20,
  color: '#cce4ff',
  fontFamily: 'Poppins-SemiBold',
},
Textlang2: {
  fontSize: 20,
  color: '#cce4ff',
  fontFamily: 'Poppins-SemiBold',
  left: 5,
},
Textlang1: {
  fontSize: 20,
  color: '#cce4ff',
  fontFamily: 'Poppins-SemiBold',
  left: 7
},
Boxdaman: {
  alignItems: 'center', 
  gap: 10,
  backgroundColor: 'rgba(0, 49, 102, 0.3)',
  width: 180,
  height: 90,
  borderRadius: 10,
  shadowColor: '#001833',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 3,
  paddingHorizontal: 10,
  paddingVertical: 10,
  bottom: 100,
},
Box1: {
 gap: 5,
 flexDirection: 'row',
},
Box2: {
  gap: 5,
  flexDirection: 'row',
 },
TopBar: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  right: 20,
  marginTop: 20,
},
DropdownMenu: {
  position: 'absolute',
  top: 80,
  right: 30,
  zIndex: 9999,
  backgroundColor: 'rgba(102, 175, 255, 0.8)',
  padding: 10,
  borderRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
},
MenuItem: {
  padding: 10,
  fontSize: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#cce4ff',
  fontFamily: 'Poppins-Medium',
},
MenuOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  justifyContent: 'flex-start',  
  alignItems: 'flex-end', 
},      
modal: {
  margin: 0,
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
},
WeatherIcon: {
  width: 150,
  height: 150,
  resizeMode: 'contain',
  bottom: 20,
},
});
