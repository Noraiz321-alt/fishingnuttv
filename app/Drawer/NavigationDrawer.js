import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createDrawerNavigator, } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import DraweContant from './DraweContant';
import image from '../Utilis/image';
import { DrawerActions } from '@react-navigation/native'


export default function NavigationDrawer({route}) {
  // const responseData = route?.params?.responseData || null;
  // console.log('show data drawer', route);
  const Drawer = createDrawerNavigator();
  
  
  return (
    <Drawer.Navigator
   
    drawerType="back"
    screenOptions={{
      swipeEnabled: false,
      headerShown: false,
    }}
      drawerContent={(props) => <DraweContant {...props} route={route} />}
      drawerPosition="left"
    >
      <Drawer.Screen name="BottomTabs">
        {() => <BottomTabs route={route} />}
      </Drawer.Screen>
  
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerIcon: {
    width: 50,
    height: 30,
    marginLeft: 10,
  },
})