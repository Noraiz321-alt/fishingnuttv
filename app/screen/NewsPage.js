import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewsPage = ({ route }) => {
    const navigation = useNavigation();
    const { itemData } = route.params;
    const contentWidth = Dimensions.get('window').width;

    console.log('Share URL:', itemData.share_url);

    const shareContent = async () => {
        if (!itemData.share_url) {
            console.warn('Share URL is missing!');
            return;
        }

        const options = {
            title: itemData.category,
            url: itemData.share_url,
            message: `Check out this fishing post: ${itemData.title}`,
        };

        try {
            await Share.open(options);
        } catch (err) {
            console.log('Share canceled or failed:', err);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>
                        {itemData.category.charAt(0).toUpperCase() + itemData.category.slice(1)}
                    </Text>
                </View>
                <View>
                    <Image style={styles.nav1} source={require('../image/logooo.png')} />
                </View>
            </View>

            <ScrollView>
                <ImageBackground
                    source={{ uri: itemData.image_url }}
                    style={{ width: '100%', height: 275 }}
                    resizeMode='cover'
                />
                <View style={styles.flexcontainer}>
                    <Text style={styles.date}>{itemData.date}</Text>
                    <View >
                        <TouchableOpacity onPress={shareContent}>
                            <FontAwesome name="share-alt" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.title}>{itemData.title}</Text>
                <Text style={styles.paragraph}>{itemData.content}</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        marginHorizontal: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
    },
    flexcontainer: {
        margin: 20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    date: {
        // margin: 10,
        fontSize: 15,
        color: '#666',
        textAlign: 'right'
    },
    paragraph: {
        margin: 10,
        fontSize: 14,
        color: '#333',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav1: {
        width: wp('12%'),
        height: wp('14%'),
    },
});

export default NewsPage;
