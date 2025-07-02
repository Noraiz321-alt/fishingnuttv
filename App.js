import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import 'fast-text-encoding'; // 👈 this will polyfill TextEncoder and
import NavigationStack from './app/Drawer/NavigationStack';



const App = () => {
7


  return (
   <NavigationStack/>
  )
}

export default App;
