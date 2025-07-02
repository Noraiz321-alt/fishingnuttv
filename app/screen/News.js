import React, { useEffect, useState, useRef } from 'react';
import {
    FlatList, Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ScaledSheet } from 'react-native-size-matters';
import NewsUpload from './NewsUpload';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Blog() {

    const isAdminRef = useRef(false);
    const navigation = useNavigation()

    const [ApiData, setApiData] = useState({ data: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('');
    const [loading, setloading] = useState(true)


    useFocusEffect(
        React.useCallback(() => {
            // fetchData();
            setCurrentPage(1); // ✅ GoBack ke baad page reset ho jaye
            fetchNews(1);
            return () => {
            };
        }, [])
    );

    useEffect(() => {

        const checkAdminStatus = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    isAdminRef.current = parsedData.custom_admin === 1;
                    console.log('Is Admin:', isAdminRef.current);
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        checkAdminStatus();
        fetchNews(currentPage);

    }, [currentPage]);

    const fetchNews = async (page) => {
        try {
            setloading(true);

            const response = await axios.get(
                `https://fishingnuttv.com/fntv-custom/fntvAPIs/news.php?category=news&page=${page}&t=${new Date().getTime()}`
            );

            setloading(false);
            console.log('✅ API Response:', response.data);

            if (response.data.posts) {
                setApiData([...response.data.posts]); // ✅ Spread operator to avoid state mutation
            } else {
                setApiData([]);
            }

            if (response.data.category) {
                setCategory(response.data.category);
            }

            setTotalPages(response.data.total_pages || 1);
        } catch (error) {
            setloading(false);
            console.error('❌ Error fetching news:', error);
        }
    };

    // ✅ Ensure pagination updates on page change
    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);
    const handlePrevPages = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPages = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // ✅ Pagination UI Update
    const renderPagination = () => {
        if (!totalPages || totalPages < 1) return null; // ✅ Prevent rendering if no pages

        let pages = [];
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <TouchableOpacity key={i} onPress={() => handlePageClick(i)}>
                    <Text style={i === currentPage ? styles.activePage : styles.page}>{i}</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.paginationContainer}>
                <TouchableOpacity onPress={handlePrevPages} disabled={currentPage <= 1}>
                    <Text style={[styles.page, currentPage <= 1 && styles.disabledPage]}>{'<<'}</Text>
                </TouchableOpacity>
                {pages}
                <TouchableOpacity onPress={handleNextPages} disabled={currentPage >= totalPages}>
                    <Text style={[styles.page, currentPage >= totalPages && styles.disabledPage]}>{'>>'}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const deleteNews = async (id, imagePath) => {
        try {
            let formData = new FormData();
            formData.append('id', id);
            formData.append('action', 'delete');

            // ✅ Only send imagePath if it's a valid string
            if (imagePath && typeof imagePath === 'string' && imagePath.trim() !== '') {
                formData.append('image_path', imagePath);
            }

            const response = await fetch(
                'https://fishingnuttv.com/adminPanel/crud_blog.php',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const responseText = await response.text(); // ✅ Ensure proper response parsing
            console.log('🛠️ API Response:', responseText);

            let jsonResponse = {};
            try {
                jsonResponse = JSON.parse(responseText); // ✅ Safe JSON Parsing
            } catch (error) {
                console.error('❌ JSON Parsing Error:', error);
            }

            // ✅ Corrected condition to check `success`
            if (jsonResponse.success === true) {
                Alert.alert('Success', 'News deleted successfully!');

                // ✅ Corrected state update (prevData is an array, not an object)
                setApiData(prevData => prevData.filter(item => item.id !== id));
            } else {
                Alert.alert('Error', jsonResponse.message || 'Failed to delete news.');
            }
        } catch (error) {
            console.error('❌ Delete Error:', error);
            Alert.alert('Error', 'Something went wrong!');
        }
    };

    // const stripHtmlTags = (str) => {
    //     return str.replace  (/<[^>]*>/g, '');    
    // };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>



            <ScrollView>
                {
                    loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop:100  }}>
                            <ActivityIndicator  size="small" color="#b9dfab"  />
                        </View>

                    )
                        :
                        (
                            <View style={styles.listContainer}>
                                {ApiData.length > 0 ? (
                                    ApiData.map(item => (
                                        <View key={item.id} style={styles.newsItemContainer}>
                                            <TouchableOpacity onPress={() => navigation.navigate('NewsPage', { itemData: item })}>
                                            <Image source={{ uri: item.image_url }} style={styles.image} />
                                            </TouchableOpacity>
                                            {isAdminRef.current && (
                                                <View style={styles.flexx}>
                                                    <TouchableOpacity
                                                        onPress={() => navigation.navigate('NewsUpload', { editData: item })}
                                                    >
                                                        <AntDesign name="edit" size={20} color={'#1b6001'} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            Alert.alert(
                                                                'Delete News',
                                                                'Are you sure you want to delete this news?',
                                                                [
                                                                    { text: 'Cancel', style: 'cancel' },
                                                                    { text: 'Delete', onPress: () => deleteNews(item.id, item.image_url) }
                                                                ],
                                                                { cancelable: true }
                                                            );
                                                        }}
                                                    >
                                                        <AntDesign name="delete" size={20} color={'red'} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}

                                            <Text style={styles.date}>{item.date}</Text>
                                            <TouchableOpacity style={styles.textheight} onPress={() => navigation.navigate('NewsPage', { itemData: item })}>
                                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                                <Text style={styles.paragraph} numberOfLines={2}>{item.content}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No News Available</Text>
                                )}
                            </View>
                        )}
               {totalPages > 1 && (
                    <View style={styles.paginationWrapper} >
                        {renderPagination()}
                    </View>
                )}
            </ScrollView>
            {isAdminRef.current && (
                <TouchableOpacity
                    style={styles.cameraIconContainer}
                    onPress={() => navigation.navigate('NewsUpload', { category })}
                >
                    <MaterialCommunityIcons name="camera-plus-outline" size={40} color="black" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}


const styles = ScaledSheet.create({
    flexx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '10@s',
        paddingTop: '10@s',
    },
    imageBackground: {
        width: '100%',
        height: '175@vs',
        // justifyContent: 'centerr',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '50@s',
        height: '50@s',
    },
    listContainer: {
       
        alignItems: 'center',
        // padding: '10@s', // Uncomment if you want padding
    },
    newsItemContainer: {
        width: '95%', // or '100%' if no margin needed
    alignSelf: 'center', // optional for centering
    marginBottom: '20@vs',
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: '6@s',
    borderWidth: '0.5@s',
    borderColor: 'lightgray',
    borderRadius: '8@s',
    },
    // textheight:{
    //     height: '120@vs',
    // },
    image: {
        width: '100%',
        height: '170@vs', // Scaled height for responsiveness
    },
    date: {
        margin: '10@s', // Scaled margin
        fontSize: '12@s', // Scaled font size
        color: '#666',
        textAlign: 'right'
    },
    title: {
        marginHorizontal: '10@s', // Scaled horizontal margin
        color: 'black',
        fontWeight: 'bold',
        fontSize: '16@s', // Scaled font size
    },
    paragraph: {
        margin: '10@s', // Scaled margin
        fontSize: '14@s', // Scaled font size
        color: '#333',
    },
    logo_image: {
        width: '50@s', // Scaled width
        height: '50@s', // Scaled height
    },
    headerText: {
        fontSize: '35@s', // Scaled font size
        fontWeight: '600',
        color: '#cdb07b',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '20@vs', // Scaled vertical margin
    },
    page: {
        fontSize: '16@s', // Scaled font size
        color: 'black',
        marginHorizontal: '5@s', // Scaled horizontal margin
        padding: '10@s', // Scaled padding
        borderRadius: '20@s', // Scaled border radius
        borderWidth: '1@s', // Scaled border width
        borderColor: '#ccc',
        textAlign: 'center',
    },
    activePage: {
        fontSize: '16@s', // Scaled font size
        color: '#444',
        marginHorizontal: '5@s', // Scaled horizontal margin
        padding: '10@s', // Scaled padding
        borderRadius: '20@s', // Scaled border radius
        backgroundColor: '#b9dfab',
        borderWidth: '1@s', // Scaled border width
        borderColor: '#ccc',
        textAlign: 'center',
    },
    menuIcon: {
        padding: '20@s', // Scaled padding
    },
    icon: {
        width: '30@s', // Scaled width
        height: '30@s', // Scaled height
        tintColor: '#cdb07b'
    },
    disabledPage: {
        color: 'lightgray', // Disabled color
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '2%',
        justifyContent: 'space-between',
    },
    nav: {
        width: '45@s',
        height: '45@s',
        borderRadius: '25@s',
        backgroundColor: '#b9dfab',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav1: {
        width: '45@s',
        height: '45@s',
        borderRadius: '100@s',
    },

    cameraIconContainer: {
        position: 'absolute',
        bottom: wp('4%'),
        right: wp('3.5%'),
    },

});





