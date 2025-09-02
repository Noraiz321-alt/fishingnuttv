
import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList, Image,  StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Blog from './Blog';
import News from './News';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import axios from 'axios';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function View_Post() {
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator();
  return (
 <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={wp('5%')} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>View Posts</Text>
        </View>
        <View>
          <Image style={styles.nav1} source={require('../image/logooo.png')} />
        </View>
      </View>
      <View style={{flex:1}}>
      <Tab.Navigator
      initialRouteName="All"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#a1a19f',
        tabBarLabelStyle: {
          fontSize: s(15),
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
          paddingTop: s(15),
          paddingBottom: s(15),
          // width: 'auto',
        },
      }}>
        <Tab.Screen name="Blogs" component={Blog} />
        <Tab.Screen name="News" component={News} />
      </Tab.Navigator>
      </View>
 </SafeAreaView>
  )
}
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
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
nav1: {
    width: '45@s',
    height: '45@s',
    borderRadius: '100@s',
},
}) 