import { StyleSheet, Text, View, ImageBackground, SafeAreaView, TouchableOpacity, Image, Animated} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons'
import { useNavigation } from 'expo-router';
import { ScrollView, TextInput } from 'react-native-gesture-handler';


const ManageCities = () => {
    const navigation = useNavigation();
    const borderColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
          Animated.sequence([
            Animated.timing(borderColorAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(borderColorAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        ).start();
    }, [borderColorAnim]);

    const borderColor = borderColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#001833', '#66afff'],
    })

  return (
    <SafeAreaView style={styles.Container}>
    <ImageBackground blurRadius={80} source={require('../../assets/images/bg.png')}
    style={styles.ImgBg}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name='arrow-left-circle' size={40} color='#001833' style={styles.Sawala}/>
         </TouchableOpacity>
         <Image style={styles.Pic2} source={require('../../assets/images/moderaterain.png')}/>
         <Text style={styles.About}>About</Text>


        <ScrollView>
          <Animated.View style={[styles.BoxMessage, {borderColor}]}>
          <Text style={styles.FirstParagraph}>{'\u00A0\u00A0\u00A0\u00A0'}Welcome to Weatherly, a weather-tracking application
             designed to provide you with reliable and up-to-date forecasts
              to help you plan your day with ease. This application was
               developed as the final project for our Application
                Development 1 course and created by the dedicated members
                 of Group 4.
          </Text>
          <Text style={styles.ThirdParagraph}>{'\u00A0\u00A0\u00A0\u00A0'}Thank you for choosing Weatherly, and we hope it makes a
             difference in your daily planning!</Text>
             </Animated.View>
        </ScrollView> 
         





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
    width: 100,
    height: 100,
    alignSelf: 'flex-end',
    right: 20,
    top: 20,
  },
  About: {
    fontFamily: 'Poppins-Bold',
    fontSize: 35,
    color: '#E5F2FF',
    left: 20,
    bottom: 10,
    textShadowColor: '#585858',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  BoxMessage: {
    backgroundColor: 'rgba(0, 49, 102, 0.5)',
    width: '90%',
    height: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
    borderWidth: 3,
  },
  FirstParagraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#cce4ff',
  },
  ThirdParagraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#cce4ff',
  },
})