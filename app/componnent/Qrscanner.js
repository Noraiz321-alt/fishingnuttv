// Qrscanner.js

import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Linking, 
    Alert,
    Platform 
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useEffect } from 'react';

// Custom hook for camera permission
const useCameraPermission = () => {
    const [granted, setGranted] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                let result;
                if (Platform.OS === 'ios') {
                    result = await request(PERMISSIONS.IOS.CAMERA);
                } else {
                    result = await request(PERMISSIONS.ANDROID.CAMERA);
                }

                if (result === RESULTS.GRANTED) {
                    setGranted(true);
                } else if (result === RESULTS.BLOCKED) {
                    Alert.alert(
                        "Camera Permission",
                        "Please enable camera permission in settings."
                    );
                }
            } catch (error) {
                console.error("Permission error:", error);
            }
        };

        checkPermission();
    }, []);

    return granted;
};

export default function Qrscanner() {
    const navigation = useNavigation();
    const [scanStatus, setScanStatus] = useState('Check Availability');
    const cameraGranted = useCameraPermission();

    const handleQRCode = (data) => {
        try {
            const url = new URL(data); // Validate URL
            setScanStatus(url.hostname);
            Linking.openURL(data);
        } catch (err) {
            Alert.alert("Invalid QR Code", "Scanned code is not a valid URL.");
        }
    };

    if (!cameraGranted) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <Text style={styles.permissionText}>
                    Camera permission is required to scan QR codes.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.circleButton, { backgroundColor: '#b9dfab' }]} 
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.statusText}>{scanStatus}</Text>
                <View style={[styles.circleButton, { backgroundColor: '#fff' }]} />
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
                    onRead={(e) => handleQRCode(e.data)}
                    reactivate={true}
                    reactivateTimeout={1000} // 1 second to prevent double scan
                    showMarker={true}
                    markerStyle={styles.marker}
                    cameraStyle={styles.camera}
                />
            </View>

            <Text style={styles.bottomText}>Peg Scanner</Text>
        </SafeAreaView>
    );
}

// Reusable styles
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
    circleButton: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
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
        overflow: 'hidden',
    },
    marker: {
        borderColor: '#FFF',
        borderRadius: 10,
    },
    bottomText: {
        fontSize: 18,
        paddingTop: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    permissionText: {
        fontSize: wp('4%'),
        textAlign: 'center',
        marginTop: hp('50%'),
        color: 'black',
    }
});
