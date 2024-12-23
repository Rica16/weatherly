import { StyleSheet, Text, View, ImageBackground, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';



interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}


const NextDayForecast = () => {
const navigation = useNavigation();
const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
const [loading, setLoading] = useState(true);

const apiKey = '39f3c03f378b4df0b9180249242110';

 useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Sibalom&days=14`
        );
        setForecastData(response.data.forecast.forecastday);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);


  
 
  return (
    <SafeAreaView style={styles.Container}>
      <ImageBackground blurRadius={80} source={require('../../assets/images/bg.png')} style={styles.ImgBg}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name='arrow-left-circle' size={40} color='#001833' style={styles.Sawala}/>
        </TouchableOpacity>

        <Image style={styles.Pic2} source={require('../../assets/images/w2.png')}/>

        <View style={styles.Box2}>
          <AntDesign name='calendar' size={30} color='#003166'/>
          <Text style={styles.Text2}>3-Days Forecast</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#e5f2ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.ScrollView}>
            {forecastData.map((day, index) => (
              <View key={index} style={styles.PuroStyle2}>
                <View>
                  <Text style={styles.Textpgd}>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                  <Text style={styles.IsapgdngaText}>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </View>
                <View style={styles.Boxdaman}>
                  <Image style={styles.Nyawa} source={{ uri: `https:${day.day.condition.icon}` }}/>
                  <Text style={styles.IsapgdkaText}>{day.day.condition.text}</Text>
                </View>
                <Text style={styles.PuroText}>{Math.round(day.day.avgtemp_c)}°C</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NextDayForecast;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    position: 'relative',
  },
  ImgBg: {
    position: 'absolute',
    height: '120%',
    width: '100%',
  },
  ScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 20,
  },
  Sawala: {
    top: 80,
    left: 20,
  },
  Pic2: {
    width: 120,
    height: 120,
    alignSelf: 'flex-end',
    top: 10,
    right: 20,
  },
  Box2: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5,
    left: 20,
  },
  Text2: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#e5f2ff',
    top: 1,
    textShadowColor: '#585858',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  Nyawa: {
    width: 40,
    height: 40,
  },
  PuroStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 20,
    bottom: 20,
    backgroundColor: 'rgba(0, 49, 102, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    height: 100,
  },
  Textpgd: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    top: 7,
    color: '#e5f2ff',
  },
  IsapgdngaText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    bottom: 1,
    color: '#e5f2ff',
  },
  Boxdaman: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  IsapgdkaText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    top: 3,
    color: '#99caff',
  },
  PuroText: {
    fontSize: 35,
    fontFamily: 'Poppins-SemiBold',
    top: 5,
    color: '#e5f2ff',
  }
});
