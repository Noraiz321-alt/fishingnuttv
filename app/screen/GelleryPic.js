import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import axios from 'react-native-axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';

import Gelery from './Gelery';
import Zoom_image from '../componnent/Zoom_image';

export default function GelleryPic({ route }) {
    const { data } = route.params;
    const memberID = data?.memberID;
    const [catchData, setCatchData] = useState([]);
    const [apiMessage, setApiMessage] = useState('');
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
            return () => {};
        }, [])
    );

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/fish-images/${memberID}`);
            const result = response.data;

            if (result.data && Array.isArray(result.data)) {
                setCatchData(result.data);
                setApiMessage('');
            } else {
                setCatchData([]);
                setApiMessage(result.message || 'No data found');
            }
        } catch (error) {
            setCatchData([]);
            setApiMessage('Something went wrong fetching data.');
        }
    };

    const deleteImage = async (imageUrl) => {
        try {
            const imageName = imageUrl.split('/').pop();
            const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/fish-images/${memberID}/${imageName}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const renderCard = ({ item }) => {
        const shareContent = async (item) => {
            try {
                await Share.open({ title: 'Fishing Catch', url: item.share_url });
            } catch (err) {
                console.log('Share failed:', err);
            }
        };

        return (
            <View style={styles.card}>
                {/* IMAGE FULL CARD FRAME */}
                <TouchableOpacity onPress={() => navigation.navigate('Zoom_image', { itemData: item })}>
                    <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
                </TouchableOpacity>

                {/* DETAILS BELOW IMAGE */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}><Text style={styles.bold}>Lake:</Text> {item.lake_name.length > 11 ? item.lake_name.substring(0,11)+'...' : item.lake_name}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Peg:</Text> {item.peg_name}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Time:</Text> {item.time}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Bait:</Text> {item.bait}</Text>
                    <Text style={styles.detailText}><Text style={styles.bold}>Weight:</Text> {item.weight_lbs}</Text>

                    <View style={styles.cardActions}>
                        <TouchableOpacity onPress={() => {
                            Alert.alert('Delete Picture', 'Are you sure?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', onPress: () => deleteImage(item.image_url) }
                            ]);
                        }}>
                            <AntDesign name="delete" size={wp('5%')} color={'red'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => shareContent(item)}>
                            <FontAwesome name="share-alt" size={wp('5%')} color="#000" />
                        </TouchableOpacity>
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
                <Text style={styles.headerText}>My Catches</Text>
                <View style={styles.nav1} />
            </View>

            <View style={styles.container}>
                {catchData.length > 0 ? (
                    <FlatList
                        data={catchData}
                        renderItem={renderCard}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{apiMessage}</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity style={styles.cameraIconContainer} onPress={() => navigation.navigate('Gelery', { data: route.params })}>
                <MaterialCommunityIcons name="camera-plus-outline" size={wp('8%')} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = ScaledSheet.create({
    header: { flexDirection:'row', alignItems:'center', padding:'10@s', justifyContent:'space-between' },
    nav: { width:'45@s', height:'45@s', borderRadius:'25@s', backgroundColor:'#b9dfab', justifyContent:'center', alignItems:'center' },
    nav1: { width:'45@s', height:'45@s' },
    headerText: { fontSize:'16@s', fontWeight:'bold', color:'black' },
    container: { flex:1 },
    card: { flex:1, margin:'5@s', backgroundColor:'#fff', borderRadius:'8@s', overflow:'hidden', elevation:6, borderWidth:'0.5@s', borderColor:'lightgray' },
    
    // IMAGE FULL CARD FRAME
    image: { width:'100%', height:wp('45%'), borderTopLeftRadius:'8@s', borderTopRightRadius:'8@s' },

    // DETAILS BELOW IMAGE
    detailsContainer: { padding:'8@s' },
    bold: { fontWeight:'bold' },
    detailText: { fontSize:'12@s', marginBottom:'4@s', color:'black' },
    cardActions: { flexDirection:'row', justifyContent:'space-between', marginTop:'10@s',},
    emptyContainer: { flex:1, justifyContent:'center', alignItems:'center' },
    emptyText: { fontSize:'14@s', color:'gray' },
    cameraIconContainer: { position:'absolute', bottom:'10@s',
    right:'10@s',borderWidth:1,borderRadius:'10@s',
    borderColor:'#b9dfab',backgroundColor:'#b9dfab', width:'50@s', height:'50@s',justifyContent:'center', alignItems:'center' },
});
