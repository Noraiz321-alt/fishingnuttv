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
import { ScaledSheet, s, vs, ms } from 'react-native-size-matters';


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
            console.log("📦 Scanned QR Raw Data:", data);
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

            <Text style={styles.bottomText} allowFontScaling={false}>Peg Scanner</Text>
        </SafeAreaView>
    );
}

// Reusable styles
const styles = ScaledSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        marginTop: '20@vs',
        paddingHorizontal: '15@s',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },

    circleButton: {
        width: '45@s',
        height: '45@s',
        borderRadius: '25@s',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statusText: {
        fontWeight: 'bold',
        fontSize: '16@s',
        color: 'black',
    },

    infoContainer: {
        marginTop: '20@vs',
        paddingHorizontal: '20@s',
    },

    infoText: {
        color: 'black',
        textAlign: 'center',
        fontSize: '15@s',
    },

    scannerContainer: {
        height: '400@vs',
        width: '100%',
        alignSelf: 'center',
        marginTop: '25@vs',
    },

    camera: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    },

    marker: {
        borderColor: '#FFF',
        borderRadius: '10@s',
        borderWidth: '2@s',
    },

    bottomText: {
        fontSize: '18@s',
        paddingTop: '35@vs',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },

    permissionText: {
        fontSize: '15@s',
        textAlign: 'center',
        marginTop: '250@vs',
        color: 'black',
    },
});

