import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import 'fast-text-encoding'; // 👈 this will polyfill TextEncoder and
import AppWrapper from './app/componnent/AppWrapper';


const App = () => {
  return <AppWrapper />;
};

export default App;
