import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';
// import RenderHTML from 'react-native-render-html';
// import image from '../asset/Image';
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { heightPercentageToDP as hp, widthPercentageToDP as wp }
    from 'react-native-responsive-screen'

const NewsPage = ({ route }) => {
    // const stripHtmlTags = (str) => {
    //     return str.replace(/<[^>]*>/g, '');
    // };
    const navigation = useNavigation()
    const { itemData } = route.params;
    console.log('show data', itemData)
    const contentWidth = Dimensions.get('window').width;

    // const extractYouTubeID = (html) => {
    //     const regex = /youtube\.com\/embed\/([^"?]+)/;
    //     const match = html.match(regex);
    //     return match ? match[1] : null;
    // };

    // const youtubeID = extractYouTubeID(itemData.content);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>News</Text>
                </View>
                <View>
                    <Image style={styles.nav1} source={require('../image/logooo.png')} />
                </View>
            </View>
            <ScrollView>


                <ImageBackground
                    source={{ uri: itemData.image_url}}
                    style={{ width: '100%', height: 275 }}
                    resizeMode='cover'
                >
                </ImageBackground>

                <View >
                    <Text style={styles.date}>{itemData.date}</Text>
                    <Text style={styles.title}>{itemData.title}</Text>
                    <Text style={styles.paragraph}>{itemData.content}</Text>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
    },
    date: {
        fontSize: 14,
        color: 'black',
        marginBottom: 8,
    },
    menuIcon: {
        // position: 'absolute',
        // top: 25,
        // left: 20,
        // padding: 20,
        padding: 5,
        marginLeft: 10,
        width: 50,
        height: 50,
        // elevation: 20,
        // shadowOpacity: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        // backgroundColor: 'black'
    },
    menuIcon1: {
        // position: 'absolute',
        // top: 25,
        // left: 20,
        // padding: 20,
        padding: 5,
        marginLeft: 10,
        width: 50,
        height: 50,
        // elevation: 20,
        shadowOpacity: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 100,
        // backgroundColor: 'black'
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#cdb07b'

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '2%',
        justifyContent: 'space-between',
    },
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
    date: {
        margin: 10, // Fixed margin
        fontSize: 12, // Fixed font size
        color: '#666',
        textAlign: 'right'
    },
    title: {
        marginHorizontal: 10, // Fixed horizontal margin
        fontSize: 22, // Fixed font size
        fontWeight: 'bold',
        color: 'black',
    },
    paragraph: {
        margin: 10, // Fixed margin
        fontSize: 14, // Fixed font size
        color: '#333',
    },
});

export default NewsPage;
