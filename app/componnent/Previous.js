import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Modal, ImageBackground } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from 'react-native-axios';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Previous({ data, memberID }) {
    
    console.log('previous/////', memberID)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const handleItemClick = async (item) => {
        setModalVisible(true);
        try {
            const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/order-pellets/${memberID}/${item.booking_date}/${item.lake_id}/${item.peg_id}`);
            console.log('pellet previous api dsata', response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
                // Access properties from the first object in the array
                const firstItem = response.data[0];
                setSelectedItem(firstItem);
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.imageContainer}>
                    <Image style={styles.img} source={{ uri: item.peg_image }} />
                </View>
                <View style={styles.textContainer}>

                    <Text style={styles.heading}>
                    {item.name.length > 23 ? (
                        <>
                            {item.name.substring(0, 21)}
                            <Text style={{color:'black'}}> ...</Text>
                        </>
                    ) : (
                        item.name
                    )}
                        </Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => handleItemClick(item)}>
                        <AntDesign name="caretright" size={15} color="black" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center',flexWrap:'wrap' }}>
                        <Text style={styles.peg} >{item.from_shift}  |  </Text>
                        <Text style={styles.peg} >{item.to_shift}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 15, }}>
                {data && data.length > 0 ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '50%' }}>
                        <Text style={{ fontSize: 30, color: '#a1a19f' }}>No previous bookings</Text>
                    </View>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => closeModal()}
            >
                <View style={styles.modalContainer}>


                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Pellet Booking Details</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>

                            <View style={{
                                width: wp('10%'), // 20% of the screen width
                                height: wp('10%'),
                                borderRadius: 25,
                                backgroundColor: '#b9dfab',
                                overflow: 'hidden',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                    <AntDesign name="close" size={25} color="black" />
                            </View>
                                </TouchableOpacity>
                        </View>
                        {selectedItem ? (
                            <>
                                <View style={{ paddingVertical: 10, marginBottom: 10 }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>Lake Name: {selectedItem.lake_name}</Text>
                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', paddingVertical: 10 }} >Peg No: {selectedItem.peg_name}</Text>
                                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }} >{selectedItem.booking_date}</Text>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'space-between', backgroundColor: '#616161', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 10,
                                }}>
                                    <View style={{}}>
                                        <Text style={{ color: 'white', fontSize: 18 }}>Weight: {selectedItem.pellet_weight}Kg</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: 18 }}>Price: (£{selectedItem.pellet_price})</Text>
                                    </View>
                                </View>
                                
                            </>
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ paddingTop: '25%' }}>
                              <Text style={{ fontWeight: 'bold', color: '#a1a19f' }}>
                                {selectedItem ? selectedItem : 'No pellet booking details available'}
                              </Text>
                            </View>
                          </View>
                        )}
                    </View>

                </View>
            </Modal>
        </View>
    )
}
const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    flatListContainer: {
        paddingHorizontal: s(10),
    },
    card: {
        borderRadius: '10@s',
        overflow: 'hidden',
        backgroundColor: '#eaf5e6',
        justifyContent: 'center',
        marginBottom: vs(10), // Added margin for spacing between cards
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: '10@s',
        alignItems: 'center',
    },
    imageContainer: {
        width: '90@s',
        height: '73@vs', // Fixed height for the image container
        backgroundColor: '#f8f8ff',
        overflow: 'hidden',
        borderRadius: '10@s',
    },
    img: {
        width: '100%', 
        height: '100%',
        resizeMode: 'cover', 
        aspectRatio: 1.7,
    },
    textContainer: {
        flex: 1,
        marginLeft: '10@s',
    },
    heading: {
        fontSize: '18@s',
        fontWeight: 'bold',
        color: 'black',
    },
    pegContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: 5,
    },
    peg: {
        letterSpacing: '-0.8@s',
        fontWeight: 'bold',
        fontSize: '10@s',
        color: '#5f5f5e',
    },
    noBookingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '50%',
    },
    noBookingText: {
        fontSize: s(30),
        color: '#a1a19f',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '20@s',
        borderRadius: '10@s',
        width: '96%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: s(20),
        fontWeight: 'bold',
        color: 'black',
    },
    modalDetails: {
        paddingVertical: vs(10),
        marginBottom: vs(10),
    },
    modalText: {
        fontSize: s(15),
        fontWeight: 'bold',
        color: 'black',
        paddingVertical: vs(10),
    },
    pelletDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#616161',
        borderRadius: '5@s',
        paddingVertical: '10@vs',
        paddingHorizontal: '10@s',
    },
    pelletText: {
        color: 'white',
        fontSize: s(18),
    },
    noPelletDetailsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: vs(25),
    },
    noPelletDetailsText: {
        fontWeight: 'bold',
        color: '#a1a19f',
    },
    closeButton: {},
    closeButtonInner: {
        width: '40@s',
        height: '40@s',
        borderRadius: '20@s',
        backgroundColor: '#b9dfab',
        justifyContent: 'center',
        alignItems: 'center',
    },
});