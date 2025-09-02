import React,{useState} from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { heightPercentageToDP as hp, widthPercentageToDP as wp }
from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VideoPlayerScreen({ route }) {

    const navigation = useNavigation();
    const { videoId } = route.params;
    console.log('video link', videoId)
    const [isLoading, setIsLoading] = useState(true);
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'white' }} >

            <View style={{flex:1}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>Video</Text>
                </View>
                <View>
                        <Image style={styles.nav1} source={require('../image/logooo.png')} />
                </View>
            </View>
            </View >
            <View style={{flex:1}}>
            <View style={{position: 'relative', top: 80,   }}>
                {isLoading && (
                    <ActivityIndicator
                        size="large"
                        color="#b9dfab" // Customize the loader color
                        style={styles.loader}
                    />
                )}
                </View>
            <YoutubePlayer
                    height={350}
                    play={true}
                    videoId={videoId}
                    onReady={() => setIsLoading(false)} // Hide loader when video is ready
                    onError={(e) => console.log('Error:', e)}
                />
            </View >
            <View style={{flex:0.9}}>
                {/* <Text>123</Text> */}
            </View >
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('2%'),
        justifyContent: 'space-between'
    },
    nav: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 25,
        backgroundColor: '#b9dfab',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav1: {
        width: wp('12%'),
        height: wp('14%'),
            // borderRadius: '100@s', // Scaled border radius
    },
    container: {
        justifyContent: 'center',
    },
    menuIcon: {
        padding: 5,
        marginLeft: 10,
        width: 50,
        height: 50,
      
    },
    menuIcon1: {
        padding: 5,
        marginRight: 10,
        width: 50,
        height: 50,
      
    },
    icon: {
        width: 35,
        height: 40,
        tintColor: '#cdb07b'

    },
});