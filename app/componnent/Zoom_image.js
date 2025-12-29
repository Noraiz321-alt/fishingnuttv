import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Zoom_image({ route }) {
    const navigation = useNavigation();
    const { itemData } = route.params;

    return (
        <SafeAreaView style={styles.container}>

            {/* ABSOLUTE HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
            </View>

            {/* CENTERED IMAGE */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: itemData.image_url }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    /* -------- ABSOLUTE HEADER (NO LAYOUT SPACE) -------- */
    header: {
        position: 'absolute',
        top: wp('10%'),
        left: wp('3%'),
        zIndex: 20,
    },

    nav: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#b9dfab',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    /* -------- IMAGE WRAPPER WITH PERFECT CENTERING -------- */
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: '100%',
    },
});
