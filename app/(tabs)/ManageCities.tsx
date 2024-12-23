import { TextInput, StyleSheet, Text, View, ImageBackground, SafeAreaView, TouchableOpacity, Image, Animated, FlatList, Modal} from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import { Ionicons, Feather, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Location = {
  name: string;
};



const ManageCities = () => {
    const navigation = useNavigation();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [addedCities, setAddedCities] = useState<Array<{ name: string; date: string; time: string; weather: string; icon: any; temp: string }>>([]);
    const searchWidth = useRef(new Animated.Value(0)).current;
    const searchIconPosition = useRef(new Animated.Value(0)).current;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const apiKey = '39f3c03f378b4df0b9180249242110';

   useEffect(() => {
    const loadCities = async () => {
      try {
        const savedCities = await AsyncStorage.getItem('addedCities');
        if (savedCities) {
          setAddedCities(JSON.parse(savedCities));
        }
      } catch (error) {
        console.error('Error loading cities from storage:', error);
      }
    };

    loadCities();

    const updateDateTime = () => {
      setAddedCities((prevCities) =>
        prevCities.map((city) => {
          const now = new Date();
          const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' });
          const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          return {
            ...city,
            date: dateFormatter.format(now),
            time: timeFormatter.format(now),
          };
        })
      );
    };
    
    const timerId = setInterval(updateDateTime, 60000);

    return () => clearInterval(timerId);
   }, []);

   const saveCities = async (cities: Array<{ name: string; date: string; time: string; weather: string; icon: any; temp: string }>) => {
    try {
      await AsyncStorage.setItem('addedCities', JSON.stringify(cities));
    } catch (error) {
      console.error('Error saving cities to storage:', error);
    }
   };

    const toggleSearchBar = () => {
      if (isSearchVisible) {
        Animated.parallel([
        Animated.timing(searchWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }), 
        Animated.timing(searchIconPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => setIsSearchVisible(false));
      } else {
        setIsSearchVisible(true);
        Animated.parallel([
        Animated.timing(searchWidth, {
          toValue: 330,
          duration: 300,
          useNativeDriver: false,
        }), 
        Animated.timing(searchIconPosition, {
          toValue: 2,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
          setSearch('');
          setFilteredCities([]);
        });
      }
    };



    const handleSearch = async (text: string) => {
      setSearch(text);

      if (text.trim() === '') {
        setFilteredCities([]);
      } else {
       try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${text}`);
        

        if (!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Location[] = await response.json();

        if (!data || data.length === 0) {
          setFilteredCities([]);
          return;
        }

        setFilteredCities(data.map((location: Location) => location.name));
       } catch (error) {
        console.error('Error fetching location data:', error);
       }
      }
    };


    const handleCityPress = (cityName: string) => {
      setSelectedCity(cityName);
      setIsModalVisible(true);
      setSearch('');
      setFilteredCities([]);
    };


    const handleAddCity = async () => {
      if (selectedCity) {
        const cityExists = addedCities.some(city => city.name === selectedCity);
        if (cityExists) {
          console.log(`Duplicate city detected: ${selectedCity}`);
          setFeedbackMessage(`"${selectedCity}" is already added!`);
          setTimeout(() => {
            setFeedbackMessage(null);
            console.log("Feedback message cleared");
          }, 3000);
          setSelectedCity(null);
          setIsModalVisible(false);
          return;
        }
    
        try {
        
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}`
          );
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          
          
          const now = new Date();
          const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' });
          const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
          const formattedDate = dateFormatter.format(now);
          const formattedTime = timeFormatter.format(now);
    
          const newCity = {
            name: selectedCity,
            date: formattedDate,
            time: formattedTime,
            weather: data.current.condition.text,         
            icon: { uri: `https:${data.current.condition.icon}` }, 
            temp: `${data.current.temp_c}°C`,           
          };

          const updatedCities = [...addedCities, newCity];
          setAddedCities(updatedCities);
          saveCities(updatedCities);

            
    
          setFeedbackMessage(null);
          setSelectedCity(null);
          setIsModalVisible(false);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setFeedbackMessage('Error fetching weather data. Please try again.');
          setTimeout(() => {
            setFeedbackMessage(null);
          }, 3000);
        }
      }
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
      setSelectedCity(null);
    };

    const handleDeleteCity = (cityName: string) => {
      const updatedCities = addedCities.filter(city => city.name !== cityName);
      setAddedCities(updatedCities);
      saveCities(updatedCities);
    };

  return (
    <SafeAreaView style={styles.Container}>
    <ImageBackground blurRadius={80} source={require('../../assets/images/bg.png')}
    style={styles.ImgBg}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name='arrow-left-circle' size={40} color='#001833' style={styles.Sawala}/>
         </TouchableOpacity>
         <Image style={styles.Pic2} source={require('../../assets/images/thunderstorm.png')}/>
         <Text style={styles.Cities}>Cities</Text>





<View style={styles.SearchRow}>
<Animated.View style={[styles.SearchIconContainer, { transform: [{ translateX: searchIconPosition }] }]}>
    <TouchableOpacity onPress={toggleSearchBar}>
      <AntDesign name="search1" size={25} color="#e5f2ff" style={styles.SearchIcon}/>
    </TouchableOpacity>
  </Animated.View>

  <Animated.View style={[styles.SearchContainer, { width: searchWidth }]}>
    {isSearchVisible && (
      <TouchableOpacity onPress={() => setIsSearchVisible(true)} style={{ flex: 1 }}>
      <TextInput
        style={styles.SearchInput}
        placeholder='Search City...'
        placeholderTextColor='rgba(120, 157, 188, 0.3)'
        value={search}
        onChangeText={handleSearch}
      />
      </TouchableOpacity>
    )}
  </Animated.View>

  {isSearchVisible && search ? (
    <TouchableOpacity onPress={() => setSearch('')} style={styles.CloseIcon}>
      <AntDesign name="close" size={25} color="#e5f2ff" />
    </TouchableOpacity>
  ) : null}
</View>








      {search.trim() !== '' && (
        <FlatList 
        data={filteredCities}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCityPress(item)}>
          <View style={styles.CityItem}>
            <Text style={styles.CityText}>{item}</Text>
          </View>
          </TouchableOpacity>
        )}
        style={styles.CityList}
        />
      )}

      <FlatList
          data={addedCities}
          keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
            <View style={styles.CityCard}>
              <View>
              <Text style={styles.CityName}>{item.name}</Text>
              <Text style={styles.CityWeather}>{item.weather}</Text>
              <Text style={styles.CityDate}>{item.date} . {item.time}</Text>
              </View>
              <View>
              <Image source={item.icon} style={styles.WeatherIcon} />
              </View>
              <View>
              <Text style={styles.CityTemp}>{item.temp}</Text>
              </View>

              <TouchableOpacity onPress={() => handleDeleteCity(item.name)} style={styles.DeleteButton}>
                <MaterialCommunityIcons name='delete-outline' size={25} color="#003166"/>
              </TouchableOpacity>
            </View>
          )}
          style={styles.AddedCitiesList}
      />

      <Modal
         visible={isModalVisible}
         transparent
         animationType="slide"
         onRequestClose={handleCancel}
      >
        <View style={styles.ModalContainer}>
          <View style={styles.ModalContent}>
            <Text style={styles.ModalText}>Do you want to add {selectedCity}?</Text>
            <View style={styles.ButtonRow}> 
            <TouchableOpacity onPress={handleCancel} style={styles.ModalButton}>
                <Text style={styles.ButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCity} style={styles.ModalButton}>
                <Text style={styles.ButtonText}>Add</Text>
              </TouchableOpacity>
             
            </View>
          </View>
        </View>
      </Modal>

    
      {feedbackMessage && (
          <View style={styles.FeedbackContainer}>
            <Text style={styles.FeedbackText}>{feedbackMessage}</Text>
          </View>
        )}
   
       

    </ImageBackground>
    </SafeAreaView>
  )
}

export default ManageCities

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
  Sawala: {
    top: 80,
    left: 20,
  },
  Pic2: {
    width: 150,
    height: 150,
    alignSelf: 'flex-end',
  },
  Cities: {
    fontFamily: 'Poppins-Bold',
    fontSize: 35,
    color: '#E5F2FF',
    left: 20,
    bottom: 60,
    textShadowColor: '#585858',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  SearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 180,
    right: 20,
    backgroundColor: 'rgba(0, 49, 102, 0.8)',
    borderRadius: 70,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  SearchContainer: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  SearchInput: {
    fontSize: 20,
    color: '#99caff',
    fontFamily: 'Poppins-Medium',
    left: 10,
    top: 5,
  },
  SearchIcon: {
    left: 10,
  },
  CityList: {
    marginTop: 1,
    paddingHorizontal: 20,
    width: 300,
    height: 'auto',
    alignSelf: 'center',
    borderRadius: 10,
  },
  CityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#001833',
  },
  CityText: {
    fontSize: 20,
    color: '#001833',
    fontFamily: 'Poppins-Regular',
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 100,
  },
  ModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'rgba(153, 202, 255, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  ModalText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#001833',
    fontFamily: 'Poppins-Medium',
  },
  ButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ModalButton: {
    marginHorizontal: 10,
    backgroundColor: '#001833',
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
  },
  ButtonText: {
    color: '#99caff',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  CityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0, 49, 102, 0.5)',
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
},
CityName: { 
  fontSize: 25, 
  fontFamily: 'Poppins-Bold', 
  color: '#E5F2FF'
 },
CityDate: { 
  fontSize: 15, 
  color: '#99caff',
   marginBottom: 5 
  },
CityWeather: { 
  fontSize: 16, 
  color: '#E5F2FF',
  marginBottom: 5,
  fontFamily: 'Poppins-Medium',
  },
WeatherIcon: { 
  width: 50, 
  height: 50,
  left: 25,
},
CityTemp: { 
  fontSize: 30,
  left: 40,
   color: '#E5F2FF', 
   fontFamily: 'Poppins-SemiBold'
   },
AddedCitiesList: { 
  paddingHorizontal: 20,
   marginTop: 20
   },
DeleteButton: {
  alignSelf: 'flex-end',
  bottom: 65,
  left: 10,
},
SearchIconMoved: {
  position: 'absolute',
  left: 10,
},
SearchIconContainer: {
 
},
CloseIcon: {
  position: 'absolute',
  right: 20, 
},
FeedbackContainer: {
  position: 'absolute',
  bottom: 500,
  alignSelf: 'center',
  backgroundColor: 'rgba(0, 49, 102, 1)',
  borderRadius: 10,
  alignItems: 'center',
  zIndex: 1, 
},
FeedbackText: {
  fontSize: 16,
  color: '#e5f2ff', 
  fontFamily: 'Poppins-Bold',
  paddingHorizontal: 10,
  paddingVertical: 10,
},

})