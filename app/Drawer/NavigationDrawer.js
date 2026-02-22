import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import DraweContant from './DraweContant';
import { DrawerActions } from '@react-navigation/native';
import { ScaledSheet, s, vs } from 'react-native-size-matters';

// export default function NavigationDrawer({ route }) {
//   const Drawer = createDrawerNavigator();

//   return (
//     <Drawer.Navigator
//       drawerType="back"
//       screenOptions={{
//         swipeEnabled: false,
//         headerShown: false,
//         drawerStyle: {
//           width: s(260), // Responsive width
//         },
//       }}
//       drawerContent={(props) => <DraweContant {...props} route={route} />}
//       drawerPosition="left"
//     >
//       <Drawer.Screen name="BottomTabs">
//         {() => <BottomTabs route={route} />}
//       </Drawer.Screen>
//     </Drawer.Navigator>
//   );
// }
export default function NavigationDrawer({ route }) {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerType="back"
      screenOptions={{
        swipeEnabled: false,
        headerShown: false,
        drawerStyle: {
          width: s(260),
        },
      }}
      drawerContent={(props) => <DraweContant {...props} route={route} />}
      drawerPosition="left"
    >
      <Drawer.Screen
        name="BottomTabs"
        component={BottomTabs}
        initialParams={route?.params}   // login ka responseData pehli dafa
      />
    </Drawer.Navigator>
  );
}

const styles = ScaledSheet.create({
  drawerIcon: {
    width: s(50),
    height: vs(30),
    marginLeft: s(10),
  },
});
