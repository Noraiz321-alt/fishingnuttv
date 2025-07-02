import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'react-native-axios';
import Clipboard from '@react-native-clipboard/clipboard';

import Gelery from './Gelery';
import Zoom_image from '../componnent/Zoom_image';

export default function GelleryPic({ route }) {

    const { data } = route.params;
    const memberID = data?.memberID;
    console.log('Member ID:', memberID);
    const [catchData, setCatchData] = useState([]);
    const [apiMessage, setApiMessage] = useState('');
    // console.log('Route params in previous screen:', route.params);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
            return () => {
            };
        }, [])
    );
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/fish-images/${memberID}`);
            const result = response.data;

            if (result.data && Array.isArray(result.data)) {
                setCatchData(result.data);
                setApiMessage(''); // ✅ Clear message if data is present
                console.log('Fetched data:>>>>>> gellery', result.data);
            } else {
                setCatchData([]);
                setApiMessage(result.message); // ✅ Set API message
                console.log('No fish images found:', result.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setCatchData([]);
            setApiMessage('Something went wrong fetching data.'); // Fallback message
        }
    };

    const deleteImage = async (imageUrl) => {
        try {
            const imageName = imageUrl.split('/').pop(); // Get the last part of the URL after the last '/'
            const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/fish-images/${memberID}/${imageName}`, {
                method: 'DELETE'
            });

            // Handle response
            if (response.ok) {
                console.log('Image deleted successfully');
                // Fetch data only if there are more images left
                if (catchData.length > 1) {
                    fetchData();
                } else {
                    // Reset catchData to an empty array if no images left
                    
                    setCatchData([]);
                }
            } else {
                console.error('Error deleting image:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    const renderCard = ({ item }) => {
        const shareContent = async (item) => {
            const options = {
                title: 'Fishing Catch',
                url: item.share_url, // 🔗 Sirf yeh link share hoga
            };

            try {
                await Share.open(options);
            } catch (err) {
                console.log('Share canceled or failed:', err);
            }
        };
        return (

            <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('Zoom_image', { itemData: item })} style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}>
                        <Text style={styles.bold}>Lake:</Text>
                        {item.lake_name.length > 11 ? (
                            <>
                                <Text>{item.lake_name.substring(0, 11)}</Text>
                                <Text> ...</Text>
                            </>
                        ) : (
                            <Text>{item.lake_name}</Text>
                        )}
                    </Text>

                    <Text style={styles.detailText}><Text style={styles.bold}>Peg:</Text> {item.peg_name}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Time:</Text> {item.time}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Bait:</Text> {item.bait}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Weight:</Text> {item.weight_lbs}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                'Delete Picture',
                                'Are you sure you want to delete this picture?',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Delete',
                                        onPress: () => deleteImage(item.image_url)
                                    }
                                ],
                                { cancelable: true }
                            );
                        }}>
                            <AntDesign name="delete" size={20} color={'red'} />
                        </TouchableOpacity>
                        <View style={{}}>

                            <TouchableOpacity onPress={() => shareContent(item)}>
                                <FontAwesome name="share-alt" size={20} color="#000" />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>My Catches</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.nav1} onPress={() => navigation.goBack()}></TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                {
                    catchData.length > 0 ? (
                        <FlatList
                            data={catchData}
                            renderItem={renderCard}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                        />
                    ) : (
                        <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
                            <Text style={{ fontSize: wp('4%'), color: 'gray' }}>{apiMessage}</Text>
                        </View>
                    )
                }
            </View>
            <TouchableOpacity style={styles.cameraIconContainer}
                onPress={() => {

                    navigation.navigate('Gelery', { data: route.params });
                }}
            >
                <MaterialCommunityIcons name="camera-plus-outline" size={wp('15%')} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const { width } = Dimensions.get('window');
const cardWidth = width / 2 - wp('3%');
const imageSize = cardWidth - wp('2%');

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
        height: wp('12%'),
    },
    container: {
        // alignItems: 'center',
        flex: 1,
        // padding: wp('1%'),
    },
    card: {
        margin: wp('2%'),
        backgroundColor: '#ffffff',
        borderRadius: wp('1%'),
        overflow: 'hidden',
        elevation: 6, // Shadow depth
        borderWidth: 0.5,
        borderColor: 'lightgray',

    },
    imageContainer: {
        width: imageSize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: imageSize,
        height: imageSize,
        // borderRadius: wp('2%'),
    },
    detailsContainer: {
        flex: 1,
        padding: wp('2%'),
        justifyContent: 'center',

    },
    bold: {
        fontWeight: 'bold',
    },
    detailText: {
        fontSize: wp('3.5%'),
        marginBottom: wp('1%'),
        color: 'black'
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: wp('3%'),
        right: wp('3%'),
    },
});
