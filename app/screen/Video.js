import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


export default function Video() {
    const navigation = useNavigation();
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            'https://fishingnuttv.com//youtube_links_api.php?api_key=@@Sec_pass987654&channel_id=UC9LW_RVliXGAyMiiuk2ESfg'
        )
            .then((response) => response.json())
            .then((data) => {
                setVideos(data.videos);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching videos:', error);
                setLoading(false);
            });
    }, []);
    const renderVideoItem = ({ item }) => (
        <TouchableOpacity
            style={styles.videoCard}
            onPress={() =>
                navigation.navigate('VideoPlayerScreen', {
                    videoId: item.video_id, // Pass the video ID here
                })
            }
        >
               <ImageBackground
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover" // Ensures the image covers the View
            >
                 <View style={{flex:1, alignItems: 'center',justifyContent:'center' }}>
                    {/* <Image source={image.playbutton} style={styles.logo_image1} resizeMode="contain" /> */}
                    <FontAwesome style={styles.logo_image1} name="play" size={80} color="rgba(255, 255, 255, 0.8)" />
                </View>
               
            </ImageBackground>
            
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDate}>
                    Published: {new Date(item.published_at).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}edges={['top', 'left', 'right']}>

           <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>Videos</Text>
                </View>
                <View>
                        <Image style={styles.nav1} source={require('../image/logooo.png')} />
                </View>
            </View>
             

           
            {loading ? (
                <View style={{paddingTop:300}}>
                <ActivityIndicator size="small" color="#b9dfab" style={{ marginTop: 20 }} />
                </View>
            ) : (
                <FlatList
                    data={videos}
                    renderItem={renderVideoItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
             
    </SafeAreaView>

  )
}

const styles = ScaledSheet.create({
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
            borderRadius: '100@s', // Scaled border radius
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '50@s',
        height: '50@s',
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#cdb07b',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    titleText: {
        fontSize: '35@s',
        fontWeight: '600',
        color: '#cdb07b',
        marginVertical:5,
    },
    imageBackground: {
        width: '100%',
        height: '175@vs',
        // justifyContent: 'center',
    },
    menuIcon: {
        padding: 20,
    },
    logo_image1: {
        width: '70@s',
        height: '70@vs',
        tintColor: 'rgba(255, 255, 255, 0.6)', // Light gray with transparency
    },
    videoCard: {
        marginHorizontal: '10@s',
        marginVertical: '10@vs',
        backgroundColor: '#f3f3f3',
        borderRadius: '10@s',
        overflow: 'hidden',
        elevation: 3,
    },
    thumbnail: {
        width: '100%',
        height: '200@vs',
    },
    videoInfo: {
        flex: 1,
        padding: '10@s',
        justifyContent: 'center',
    },
    videoTitle: {
        fontSize: '16@s',
        fontWeight: 'bold',
        color: '#333',
    },
    videoDate: {
        fontSize: '12@s',
        color: '#666',
        marginTop: '5@vs',
    },
});


