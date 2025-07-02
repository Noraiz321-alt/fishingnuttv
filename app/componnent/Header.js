import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
    RefreshControl
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Header() {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={wp('5%')} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Match Result</Text>
            <Image style={styles.logo} source={require('../image/logooo.png')} />
        </View>


    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%'),
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: 'black',
    },
    nav: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#b9dfab',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: wp('12%'),
        height: wp('14%'),
        borderRadius: wp('6%'),
    },
})