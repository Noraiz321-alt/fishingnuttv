import React, { useState } from 'react'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { Text, View, FlatList, Modal, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'react-native-axios';

export default function Upcoming({ data, memberID }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = async (item) => {
        setModalVisible(true);
        try {
            const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/order-pellets/${memberID}/${item.booking_date}/${item.lake_id}/${item.peg_id}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                const firstItem = response.data[0];
                setSelectedItem(firstItem);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.imageContainer}>
                    <Image style={styles.img} source={{ uri: item.peg_image }} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.heading}>
                        {item.name.length > 23 ? `${item.name.substring(0, 21)}...` : item.name}
                    </Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => handleItemClick(item)}>
                        <AntDesign name="caretright" size={s(15)} color="black" />
                    </TouchableOpacity>
                    <View style={styles.pegContainer}>
                        <Text style={styles.peg}>{item.from_shift} | </Text>
                        <Text style={styles.peg}>{item.to_shift}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.flatListContainer}>
                {data && data.length > 0 ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.noBookingContainer}>
                        <Text style={styles.noBookingText}>No upcoming bookings</Text>
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
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Pellet Booking Details</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => closeModal()}>
                                <View style={styles.closeButtonInner}>
                                    <AntDesign name="close" size={s(25)} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {selectedItem ? (
                            <>
                                <View style={styles.modalDetails}>
                                    <Text style={styles.modalText}>Lake Name: {selectedItem.lake_name}</Text>
                                    <View>
                                        <Text style={styles.modalText}>Peg No: {selectedItem.peg_name}</Text>
                                        <Text style={styles.modalText}>{selectedItem.booking_date}</Text>
                                    </View>
                                </View>
                                <View style={styles.pelletDetails}>
                                    <Text style={styles.pelletText}>Weight: {selectedItem.pellet_weight}Kg</Text>
                                    <Text style={styles.pelletText}>Price: (£{selectedItem.pellet_price})</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.noPelletDetailsContainer}>
                                <Text style={styles.noPelletDetailsText}>You haven’t ordered your pellets</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
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
        paddingVertical: '10%'
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
