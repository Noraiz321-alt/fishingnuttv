import React from 'react';
import { View, Image, StyleSheet,TouchableOpacity,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Zoom_image({ route }) {
    const navigation = useNavigation();
    
    // Retrieve the item data from the route params
    const { itemData } = route.params;
    console.log('show data', itemData);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{padding: wp('2%'),}}>
             <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={wp('5%')} color="black" />
            </TouchableOpacity>
            </View>
            <View style={styles.des}>
            <Image
                source={{ uri: itemData.image_url }}
                style={styles.image}
                resizeMode="contain"
            />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:10,
        backgroundColor: 'white',
     
    },
    des:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav: {
        // position: 'absolute',
        // top: 30, 
        // left: 10, 
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 25,
        backgroundColor: '#b9dfab',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        // zIndex: 1,
    },
    image: {
        width: wp('100%'),
        height: wp('100%'),
    },
});
