import React, { useEffect, useState } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, s } from 'react-native-size-matters';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Blog from './Blog';
import News from './News';

const Tab = createMaterialTopTabNavigator();

export default function View_Post({ route }) {
  const navigation = useNavigation();

  // 🔹 notification se tab aa raha hai ya nahi → active tab yahi hoga, dono tabs dikhenge
  const tabFromParam = route?.params?.tab; // 'Blogs' | 'News' | undefined

  // 🔹 default active tab
  const [activeTab, setActiveTab] = useState(tabFromParam || 'Blogs');

  useEffect(() => {
    if (tabFromParam && ['Blogs', 'News'].includes(tabFromParam)) {
      setActiveTab(tabFromParam);
    }
  }, [tabFromParam]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={wp('5%')} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>View Posts</Text>

        <Image
          style={styles.nav1}
          source={require('../image/logooo.png')}
        />
      </View>

      {/* ================= TABS ================= */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName={activeTab}
          lazy
          screenOptions={{
            unmountOnBlur: true,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#a1a19f',
            tabBarLabelStyle: {
              fontSize: s(15),
              fontWeight: 'bold',
            },
            tabBarIndicatorStyle: { height: 0 },
            tabBarStyle: { elevation: 0, shadowOpacity: 0 },
            tabBarItemStyle: {
              paddingTop: s(15),
              paddingBottom: s(15),
            },
          }}
        >
          <Tab.Screen name="Blogs" component={Blog} />
          <Tab.Screen name="News" component={News} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav1: {
    width: '45@s',
    height: '45@s',
    borderRadius: '100@s',
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'black',
  },
});
