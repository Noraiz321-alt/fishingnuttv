import { StyleSheet, Text, View,Keyboard, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React,{useState,useEffect} from 'react'
import Main from '../screen/ Main';
import Booking from '../screen/Booking';
import BookingDetails from '../screen/BookingDetails';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome6'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons'






const Tab = createBottomTabNavigator();

export default function BottomTabs({ route }) {
  const responseData = route.params?.responseData || null;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1b6001',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#b9dfab',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            display: isKeyboardVisible ? 'none' : 'flex',
            paddingTop: vs(8), 
            paddingBottom: vs(12), // Adjust padding based on vertical scale
            height: vs(65), 
          },
          tabBarIndicatorStyle: {
            height: 0,
          },
        }}
      >
        <Tab.Screen
          name="Booking"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="home" size={s(25)} color="#1b6001" />
            ),
          }}
        >
          {() => <Booking route={route} />}
        </Tab.Screen>
        <Tab.Screen
          name="B-Details"
          options={{
            tabBarLabel: 'Bookings',
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome6 name="box-open" size={s(25)} color="#1b6001" />
            ),
          }}
        >
          {() => <BookingDetails route={route} />}
        </Tab.Screen>
        <Tab.Screen
          name="Main"
          options={{
            tabBarLabel: 'Membership Card',
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome6 name="id-card-clip" size={s(20)} color="#1b6001" />
            ),
          }}
        >
          {() => <Main route={route} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = ScaledSheet.create({});