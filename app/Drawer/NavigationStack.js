import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screen/Login';
import Main from '../screen/ Main';
import NavigationDrawer from './NavigationDrawer';
import DraweContant from './DraweContant';
import SignUp from '../screen/SignUp';
import Fpass from '../screen/Fpass';
import Sscreen from '../screen/Sscreen';
import BottomTabs from './BottomTabs';
import Booking from '../screen/Booking';
import Bcalender from '../componnent/Bcalender';
import Testm from '../componnent/Testm';
import Gelery from '../screen/Gelery';
import Qrscanner from '../componnent/Qrscanner';
import GelleryPic from '../screen/GelleryPic';
import Code_field from '../screen/Code_field';
import Update_password from '../screen/Update_password';
import Zoom_image from '../componnent/Zoom_image';
import PaypalButton from '../screen/PaypalButton';
import Video from '../screen/Video';
import VideoPlayerScreen from '../screen/VideoPlayerScreen';
import View_Post from '../screen/View_Post';
import News from '../screen/News';
import NewsPage from '../screen/NewsPage';
import NewsUpload from '../screen/NewsUpload';
import Blog from '../screen/Blog';
import League from '../screen/League';
import Match_Days from '../screen/Match_Days';
import LeagueWebView from '../screen/LeagueWebView';
import Match_result from '../screen/Match_result';
import Header from '../componnent/Header';
import LeaguesTabs from '../screen/LeaguesTabs';
import LeaderBoard from '../screen/LeaderBoard';


export default function NavigationStack() {

  const Stack = createNativeStackNavigator();
  const [saplash, setSaplash] = useState(true)

  //   useEffect(()=>{
  // setTimeout(()=>{
  //   setSaplash(false);
  // },2000)
  //   },[])

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {
          saplash ? (
            <Stack.Screen name="Sscreen" component={Sscreen} />
          ) : null
        }   */}

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NavigationDrawer" component={NavigationDrawer} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="DraweContant" component={DraweContant} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Fpass" component={Fpass} />
        <Stack.Screen name="Booking" component={Booking} />
        <Stack.Screen name="Bcalender" component={Bcalender} />
        <Stack.Screen name="Testm" component={Testm} />
        <Stack.Screen name="Gelery" component={Gelery} />
        <Stack.Screen name="Qrscanner" component={Qrscanner} />
        <Stack.Screen name="GelleryPic" component={GelleryPic} />
        <Stack.Screen name="Code_field" component={Code_field} />
        <Stack.Screen name="Update_password" component={Update_password} />
        <Stack.Screen name="Zoom_image" component={Zoom_image} />
        <Stack.Screen name="PaypalButton" component={PaypalButton} />
        <Stack.Screen name="Video" component={Video} />
        <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} />
        <Stack.Screen name="View_Post" component={View_Post} />
        <Stack.Screen name="Blog" component={Blog} />
        <Stack.Screen name="News" component={News} />
        <Stack.Screen name="NewsPage" component={NewsPage} />
        <Stack.Screen name="NewsUpload" component={NewsUpload} />
        <Stack.Screen name="League" component={League} />
        <Stack.Screen name="Match_Days" component={Match_Days} />
        <Stack.Screen name="Match_result" component={Match_result} />
        <Stack.Screen name="Header" component={Header} />
        <Stack.Screen name="LeaguesTabs" component={LeaguesTabs} />
        <Stack.Screen name="LeaderBoard" component={LeaderBoard} />

        <Stack.Screen
          name="LeagueWebView"
          component={LeagueWebView}
          options={{ headerShown: false }} // ❌ Hide default
        />
      </Stack.Navigator>
    </NavigationContainer>
  )


};

const styles = StyleSheet.create({})