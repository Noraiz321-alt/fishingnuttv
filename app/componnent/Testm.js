import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Upcoming from './Upcoming'
import Previous from './Previous'
import All from './All'


export default function Testm() {
    const Tab = createMaterialTopTabNavigator();
  return (
  
    <Tab.Navigator>
    <Tab.Screen name="All" component={All} />
    <Tab.Screen name="Previous" component={Previous} />
    <Tab.Screen name="Upcoming" component={Upcoming} />
  </Tab.Navigator>
 
  )
}

const styles = StyleSheet.create({})