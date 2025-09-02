import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,

    TouchableOpacity,
    Image,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import League from './League';
import LeaderBoard from './LeaderBoard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaguesTabs() {
    const navigation = useNavigation()
    const Tab = createMaterialTopTabNavigator();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>
                    Leagues
                </Text>
                <Image style={styles.nav1} source={require('../image/logooo.png')} />
            </View>

            {/* Tabs should take full available space */}
            <View style={{ flex: 1 }}>
                <Tab.Navigator
                    initialRouteName="LeaderBoard"
                    screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarActiveTintColor: 'black',
                        tabBarInactiveTintColor: '#a1a19f',
                        tabBarLabelStyle: {
                            fontSize: s(12.5),
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
                            width: 'auto',
                        },
                    }}
                >

                    <Tab.Screen
                        name="LeaderBoard"
                        component={LeaderBoard}
                        options={{
                            tabBarLabel: ({ color }) => {
                                const year = new Date().getFullYear();
                                return (
                                    <Text style={{ fontSize: s(12.5), fontWeight: 'bold', color }}>
                                        LEADER BOARDS {year}
                                    </Text>
                                );
                            },
                        }}
                    />
                    
                    <Tab.Screen
                        name="Fixtures"
                        component={League}
                        initialParams={{ filterType: 'ongoing' }}
                    />
                    <Tab.Screen
                        name="Join Leagues"
                        component={League}
                        initialParams={{ filterType: 'combined' }} // changed from 'upcoming'
                    />


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

