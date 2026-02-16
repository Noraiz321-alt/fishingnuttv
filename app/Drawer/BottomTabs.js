import { StyleSheet, Text, View, Keyboard, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react'
import Main from '../screen/ Main';
import Booking from '../screen/Booking';
import BookingDetails from '../screen/BookingDetails';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome6'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const AppText = ({ children, style }) => <Text style={style} allowFontScaling={false}>{children}</Text>;
const Tab = createBottomTabNavigator();


// export default function BottomTabs({ route, navigation }) {
//   console.log('show data notification display ',route)
//   const insets = useSafeAreaInsets();
//   const [isKeyboardVisible, setKeyboardVisible] = useState(false);
//   const [selectedTab, setSelectedTab] = useState('Booking'); // default tab

//   const responseData = route?.params?.responseData;
//   const memberStatus = responseData?.memberStatus; // ✅ FIX

//   const tabBgColor =
//   memberStatus === 'pending' && selectedTab === 'Main'
//     ? '#FFA500'
//     : '#b9dfab';

//   useEffect(() => {
//     console.log('🟢 useEffect → route.params: ', route?.params);
//     const targetTab = route?.params?.tab;
//     console.log('🔹 BottomTabs route params:', route?.params);
    

//     if (targetTab && ['Booking', 'B-Details', 'Main'].includes(targetTab)) {
//       console.log('✅ BottomTabs selecting tab from params:', targetTab);
//       setSelectedTab(targetTab); // update state
//     }

//     const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
//     const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

//     return () => {
//       showListener.remove();
//       hideListener.remove();
//     };
//   }, [route?.params?.tab]);

//   return (
//     <View style={{ flex: 1 }}>
//       <Tab.Navigator
      
//         screenOptions={{
//           headerShown: false,
//           tabBarActiveTintColor: '#1b6001',
//           tabBarInactiveTintColor: '#999999',
        
//           tabBarStyle: {
//             backgroundColor: tabBgColor,
//             borderTopWidth: 1,
//             borderTopColor: '#ccc',
//             height: vs(46.5) + insets.bottom,
//             paddingBottom: insets.bottom,
//           },
        
//           tabBarItemStyle: {
//             justifyContent: 'center',
//             alignItems: 'center',
//           },
        
//           tabBarIconStyle: {
//             marginTop: 4,
//           },
        
//           tabBarLabelStyle: {
//             fontSize: s(10),
//             marginBottom: 0,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="Booking"
//           listeners={{
//             tabPress: () => setSelectedTab('Booking'),
//           }}
//           options={{
//             tabBarLabel: ({ focused }) => <AppText style={{ fontSize: s(10), fontWeight: '500', color: focused ? '#1b6001' : '#999' }}>Home</AppText>,
//             tabBarIcon: () => <Ionicons name="home" size={s(23)} color='#1b6001' />
//           }}
//         >
//           {() => <Booking route={route} />}
//         </Tab.Screen>

//         <Tab.Screen
//           name="B-Details"
//           listeners={{
//             tabPress: () => setSelectedTab('B-Details'),
//           }}
//           options={{
//             tabBarLabel: ({ focused }) => <AppText style={{ fontSize: s(10), fontWeight: '500', color: focused ? '#1b6001' : '#999' }}>Bookings</AppText>,
//             tabBarIcon: () => <FontAwesome5 name="box-open" size={s(20)} color='#1b6001' />
//           }}
//         >
//           {() => <BookingDetails route={route} />}
//         </Tab.Screen>

//         <Tab.Screen
//           name="Main"
//           listeners={{
//             tabPress: () => setSelectedTab('Main'),
//           }}
//           options={{
//             tabBarLabel: ({ focused }) => <AppText style={{ fontSize: s(10), fontWeight: '500', color: focused ? '#1b6001' : '#999' }}>Membership Card</AppText>,
//             tabBarIcon: () => <FontAwesome6 name="id-card-clip" size={s(20)} color='#1b6001' />
//           }}
//         >
//           {() => <Main route={route} />}
//         </Tab.Screen>
//       </Tab.Navigator>
//     </View>
//   );
// }
export default function BottomTabs({ route, navigation }) {
  console.log('🔥 BottomTabs route.params: ', route?.params);

  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Booking');

  const responseData = route?.params?.responseData;
  const memberStatus = responseData?.memberStatus;

  const tabBgColor =
    memberStatus === 'pending' && selectedTab === 'Main'
      ? '#FFA500'
      : '#b9dfab';

  useEffect(() => {
    console.log('🟢 useEffect → route.params: ', route?.params);
    const targetTab = route?.params?.tab;
    console.log('🔹 BottomTabs route params:', route?.params);

    // Sirf apni local state (background color waghera) update karni hai
    if (targetTab && ['Booking', 'B-Details', 'Main'].includes(targetTab)) {
      console.log('✅ BottomTabs selecting tab from params (state only):', targetTab);
      setSelectedTab(targetTab);
    }

    const showListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [route?.params?.tab]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1b6001',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: tabBgColor,
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            height: vs(46.5) + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarIconStyle: { marginTop: 4 },
          tabBarLabelStyle: { fontSize: s(10), marginBottom: 0 },
        }}
      >
        <Tab.Screen
          name="Booking"
          component={Booking}
          initialParams={route?.params}
          listeners={{
            tabPress: () => setSelectedTab('Booking'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <AppText
                style={{
                  fontSize: s(10),
                  fontWeight: '500',
                  color: focused ? '#1b6001' : '#999',
                }}>
                Home
              </AppText>
            ),
            tabBarIcon: () => (
              <Ionicons name="home" size={s(23)} color="#1b6001" />
            ),
          }}
        />

        <Tab.Screen
          name="B-Details"
          component={BookingDetails}
          initialParams={route?.params}
          listeners={{
            tabPress: () => setSelectedTab('B-Details'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <AppText
                style={{
                  fontSize: s(10),
                  fontWeight: '500',
                  color: focused ? '#1b6001' : '#999',
                }}>
                Bookings
              </AppText>
            ),
            tabBarIcon: () => (
              <FontAwesome5 name="box-open" size={s(20)} color="#1b6001" />
            ),
          }}
        />

        <Tab.Screen
          name="Main"
          component={Main}
          initialParams={route?.params}
          listeners={{
            tabPress: () => setSelectedTab('Main'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <AppText
                style={{
                  fontSize: s(10),
                  fontWeight: '500',
                  color: focused ? '#1b6001' : '#999',
                }}>
                Membership Card
              </AppText>
            ),
            tabBarIcon: () => (
              <FontAwesome6
                name="id-card-clip"
                size={s(20)}
                color="#1b6001"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = ScaledSheet.create({});
