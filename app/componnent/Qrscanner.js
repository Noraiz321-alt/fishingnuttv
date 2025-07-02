// import { StyleSheet, Text, View, TouchableOpacity,Linking } from 'react-native'
// import React, { useState } from 'react'
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { useNavigation } from '@react-navigation/native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { RNCamera } from 'react-native-camera'
// import QRCodeScanner from 'react-native-qrcode-scanner'

// export default function Qrscanner() {
//     const navigation = useNavigation();
//     const [scanStatus, setScanStatus] = useState('Check Availability');

//     const onRead = (e) => {
//     console.log(e.data); // Scanned QR code data
//     // Extract domain from the scanned URL
//     const domain = e.data.split('/')[2]; // Split the URL by '/' and get the third part
//     // Handle the scanned data as per your requirement
//     setScanStatus(domain); // Update scanStatus state with the domain
//     // Redirect to the URL
//     Linking.openURL(e.data);
// };

//     return (
//         <View style={styles.container}>
//             <QRCodeScanner
//                 onRead={(e) => onRead(e)}
//                 reactivate={true}
//                 reactivateTimeout={500}
//                 showMarker={true}
//                 markerStyle={styles.marker}
//                 cameraStyle={styles.camera}
//                 topContent={
//                     <View>
//                         <View>
//                             <Text style={{ position:'relative',color: 'black',top:-25,fontWeight:'bold',textAlign:'center'}}>{scanStatus}</Text>
//                         </View>
//                         <View>
//                             <Text style={{ position:'relative',color: 'black',top:-20,textAlign:'center'}}>Simply scan the QR code of the peg to check if it is available for fishing today.</Text>
//                         </View>
//                     </View>
//                 }
//                 bottomContent={
//                     <View>
//                         <Text style={styles.bottomText}>Peg Scanner</Text>
//                     </View>
//                 }
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     icon: {
//         // marginRight: 10,
//         width: wp('12%'),
//         height: wp('12%'),
//         borderRadius: 25,
//         backgroundColor: '#b9dfab',
//         overflow: 'hidden',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     marker: {
//         borderColor: '#FFF',
//         borderRadius:10,
//     },
//     bottomText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: 'black',
//         fontWeight: 'bold',
//     },
// });

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function Qrscanner() {
    const navigation = useNavigation();
    const [scanStatus, setScanStatus] = useState('Check Availability');

    const onRead = (e) => {
        console.log(e.data);
        const domain = e.data.split('/')[2];
        setScanStatus(domain);
        Linking.openURL(e.data);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.statusText}>{scanStatus}</Text>
                <View style={styles.nav2} >
                    {/* <AntDesign name="left" size={wp('5%')} color="black" /> */}
                </View>
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Simply scan the QR code of the peg to check if it is available for fishing today.
                </Text>
            </View>

            {/* QR Scanner */}
            <View style={styles.scannerContainer}>
                <QRCodeScanner
                    onRead={onRead}
                    reactivate={true}
                    reactivateTimeout={500}
                    showMarker={true}
                    markerStyle={styles.marker}
                    cameraStyle={styles.camera}

                />
            </View>
             <View>
                    <Text style={styles.bottomText}>Peg Scanner</Text>
                </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('5%'),
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    nav: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#b9dfab',
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: wp('3%'),
    },
    nav2: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: wp('3%'),
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: wp('4.2%'),
        color: 'black',
    },
    infoContainer: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('5%'),
    },
    infoText: {
        color: 'black',
        textAlign: 'center',
        fontSize: wp('4%'),
    },
    scannerContainer: {
        height: hp('60%'),
        width: wp('100%'),
        alignSelf: 'center',
        marginTop: hp('3%'),
    },
    camera: {
        height: '100%',
        width: '100%',
        // borderRadius: 15,
        overflow: 'hidden',
    },
    marker: {
        borderColor: '#FFF',
        borderRadius: 10,
    },
    bottomText: {
        //   marginTop: 20,
        fontSize: 18,
        //   color: 'black',
        paddingTop: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


