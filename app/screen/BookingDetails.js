import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
// import Bcalender from '../componnent/Bcalender'
import { useNavigation, DrawerActions,useFocusEffect } from '@react-navigation/native'
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import All from '../componnent/All'
import Previous from '../componnent/Previous'
import Upcoming from '../componnent/Upcoming'
import Testm from '../componnent/Testm'
import axios from 'react-native-axios';
import { ScaledSheet, s, vs } from 'react-native-size-matters';


export default function BookingDetails({ route }) {
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();
  const responseData = route.params?.responseData || null;
  const memberID = responseData?.memberID || null;

  useFocusEffect(
    React.useCallback(() => {
      fetchDataAndFilter();
      getUserProfile();
      return () => {};
    }, [])
  );

  const [apiData, setApiData] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [profileImage, setProfileImage] = useState(responseData.prof_image);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/profile/${memberID}`);
      const imageUrl = response.data.data.image_url;
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const fetchDataAndFilter = async () => {
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-booking-pegs/${memberID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const currentDate = moment().format('YYYY-MM-DD');
      setApiData(data);
      setPreviousBookings(data.filter((booking) => moment(booking.booking_date).isBefore(currentDate)));
      setUpcomingBookings(data.filter((booking) => moment(booking.booking_date).isAfter(currentDate)));
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.nav} onPress={toggleDrawer}>
            <EvilIcons name="navicon" size={s(35)} color='black' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}>My Booking</Text>
          </TouchableOpacity>
          <Image source={{ uri: profileImage }} style={styles.mainImg} resizeMode='stretch' />
        </View>
      </View>

      <Tab.Navigator
        initialRouteName="All"
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: '#a1a19f',
          tabBarLabelStyle: {
            fontSize: s(14),
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            height: 0,
          },
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarItemStyle: {
            paddingBottom: s(15),
            width: 'auto',
          },
        }}
      >
        <Tab.Screen name="Upcoming">
          {() => <Upcoming data={upcomingBookings} memberID={memberID} />}
        </Tab.Screen>
        <Tab.Screen name="Previous">
          {() => <Previous data={previousBookings} memberID={memberID} />}
        </Tab.Screen>
        <Tab.Screen name="All">
          {() => <All data={apiData} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    paddingTop: '15@vs',
    paddingBottom:'10@vs',

  },
  header: {
    paddingHorizontal: '10@s',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nav: {
    width: '45@s',
    height: '45@s',
    borderRadius: '25@s',
    backgroundColor: '#b9dfab',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '20@s',
    fontWeight: 'bold',
    color: 'black',
  },
  mainImg: {
    width: '45@s',
    height: '45@s',
    borderRadius: '100@s',
    borderWidth: '3@s',
    borderColor: '#b9dfab',
  },
});