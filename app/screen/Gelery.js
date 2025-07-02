import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import apipost from '../api/GetApi';
import { basename } from 'uri-js';
import axios from 'react-native-axios';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Gelery({ route }) {
    const [loading, setLoading] = useState(false);
    // console.log('Route params in last screen:',route.params);
    const { data } = route.params;
    const memberID = data?.data?.memberID; // Accessing memberID from the nested structure
    console.log('Member ID:', memberID);

    useEffect(() => {
        LakeApies()
        console.log('favvvvv')
    }, []);
    const navigation = useNavigation();
    const [dataa, setDataa] = useState(null);
    const [lakeData, setLakeData] = useState([]);
    // const [selectedLake, setSelectedLake] = useState('');
    // const [selectedLakeId, setSelectedLakeId] = useState('');
    const [images, setImages] = useState([]);
    const [timeCaught, setTimeCaught] = useState('');
    const [baitUsed, setBaitUsed] = useState('');
    const [weight, setWeight] = useState('');

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    const [isScrollViewVisible, setScrollViewVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const [isScrollViewVisiblee, setScrollViewVisiblee] = useState(false);
    const [selectedValuee, setSelectedValuee] = useState(null);

    const LakeApies = async () => {
        try {
            const response = await axios.get(`${apipost.Lakeapi}/${memberID}`, { timeout: 10000 });
            setLakeData(response.data);
            console.log('lake Api booking page ', lakeData)
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleLakeChange = async (selectedLakeName) => {
        // Find the selected lake object from lakeData
        const selectedLakeObject = lakeData.find(lake => lake.name === selectedLakeName);
        if (selectedLakeObject) {
            try {
                // Call PegApies with the selectedLakeId
                const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-pegs/${selectedLakeObject.lake_id}`);
                console.log('peg api data', response.data);

                // Update state with the selected lake name
                setSelectedValue(selectedLakeObject);

                // Check if the response data is an array
                if (Array.isArray(response.data)) {
                    // Update state with the peg data
                    setDataa(response.data);
                }

            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    };


    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirm = (time) => {
        setSelectedTime(time);
        hideTimePicker();
    };

    const formatTime = (time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds(); // Get the seconds part
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const selectImages = () => {
        const options = {
            mediaType: 'photo', // Specify media type: 'photo' or 'video'
            quality: 1, // Image quality: 0 to 1
            maxWidth: 500, // Max width of image
            maxHeight: 500, // Max height of image
            allowsEditing: true, // Allows editing before selection
            storageOptions: {
                skipBackup: true, // Don't backup the image to iCloud or Google Photos
                path: 'images', // Save image to 'images' directory
                privateDirectory: true // Store image in app's private directory
            }
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                // Select only the first image from the response
                const selectedImage = response.assets[0];
                // Set the selected image as the new image
                setImages([selectedImage]);
                // Save the selected image to storage
                saveImageToStorage(selectedImage);
            }
        });
    };
    const saveImageToStorage = async (selectedImage) => {
        try {
            await AsyncStorage.setItem('selectedImage', JSON.stringify(selectedImage));
            console.log('Image saved to AsyncStorage:', selectedImage);
        } catch (error) {
            console.error('Error saving image to AsyncStorage:', error);
        }
    };
    const handleSaveCatch = async () => {
        // Check if all required fields are filled
        if (!selectedValue) {
            alert('Please select a lake');
            return;
        }
    
        if (!selectedValuee) {
            alert('Please select a peg');
            return;
        }
    
        if (images.length === 0) {
            alert('Please upload an image');
            return;
        }
    
        // Optional fields — agar empty hain to null bhejenge
        const timeToSend = selectedTime ? formatTime(selectedTime) : null;
        const baitToSend = baitUsed ? baitUsed : null;
        const weightToSend = weight ? weight : null;
    
        const uriParts = images[0].uri.split('/');
        const imageName = uriParts[uriParts.length - 1];
    
        const formData = new FormData();
        formData.append('lake_id', selectedValue.lake_id);
        formData.append('peg_id', selectedValuee.id);
    
        if (timeToSend !== null && timeToSend !== undefined) {
            formData.append('time', timeToSend);
          }
          
          if (baitToSend !== null && baitToSend !== undefined) {
            formData.append('bait', baitToSend);
          }
          
          if (weightToSend !== null && weightToSend !== undefined) {
            formData.append('weight_lbs', weightToSend);
          }
          
    
        formData.append('image', { uri: images[0].uri, name: imageName, type: 'image/jpg' });
    
        console.log('FormData:', formData);


        try {
            setLoading(true);
            // Make POST request to the API
            const response = await axios.post(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/fish-images/${memberID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('API Response:', response.data);
            setLoading(false);
            if (response.data) {
                // Display success message
                Alert.alert(
                    'Success',
                    'Your Catch is successfully added.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack() // Navigate back upon clicking OK
                        }
                    ]
                );
            } else {
                setLoading(false);
                // Handle other response statuses if needed
                console.log('Unexpected response status:', response.status);
            }




        } catch (error) {
            console.error('Error making POST request:', error);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}
                shows
            >

                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                            <AntDesign name="left" size={25} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View>

                        <View style={{ marginBottom: 40 }}>
                            <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                                <View style={{ paddingTop: 20 }}>
                                    <View style={styles.pellet}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
                                            {selectedValue ? selectedValue.name : 'Select A Lake'}
                                        </Text>
                                        <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                                            {isScrollViewVisible ? (
                                                <AntDesign name="caretup" size={14} color="black" />
                                            ) : (
                                                <AntDesign name="caretdown" size={14} color="black" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View >
                                {isScrollViewVisible && (
                                    <View style={{ marginTop: 10, paddingTop: 10, paddingHorizontal: 10 }}>

                                        {lakeData.map((lake, index) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleLakeChange(lake.name);
                                                    setScrollViewVisible(false); // Close ScrollView when lake is selected
                                                }}

                                                style={{ backgroundColor: '#1b6001', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 }} key={index}>
                                                <Text style={{ paddingVertical: 5, color: 'white', fontWeight: 'bold' }} >
                                                    {lake.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}

                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <TouchableOpacity onPress={() => setScrollViewVisiblee(!isScrollViewVisiblee)}>
                                <View style={{}}>
                                    <View style={styles.pellet}>
                                        <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
                                            {selectedValuee && selectedValuee.name ? selectedValuee.name : 'Select A Peg'} {/* Display name instead of peg_id */}
                                        </Text>
                                        <TouchableOpacity onPress={() => setScrollViewVisiblee(!isScrollViewVisiblee)}>
                                            {isScrollViewVisiblee ? (
                                                <AntDesign name="caretup" size={14} color="black" />
                                            ) : (
                                                <AntDesign name="caretdown" size={14} color="black" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View >
                                {isScrollViewVisiblee && (
                                    <View style={{ marginTop: 10, paddingTop: 10, paddingHorizontal: 10 }}>
                                        {dataa && dataa.length > 0 ? (
                                            dataa.map((item, index) => (
                                                <TouchableOpacity key={index} onPress={() => {
                                                    setSelectedValuee({
                                                        id: item.id,
                                                        name: item.name
                                                    });
                                                    setScrollViewVisiblee(false);
                                                }}>
                                                    <View style={{ backgroundColor: '#1b6001', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 }}>
                                                        <Text style={{ paddingVertical: 5, color: 'white', fontWeight: 'bold' }}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <Text style={{ color: 'red' }}>First select a lake</Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
                            <Text style={{ width: '48%', letterSpacing: -1, color: 'black' }}>Bait Used</Text>
                            <Text style={{ width: '48%', letterSpacing: -1, color: 'black' }}>Weight in Lbs</Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 40 }}>

                            <TextInput
                                style={styles.input}
                                placeholder="Bait Used"
                                placeholderTextColor="#a1a19f"
                                value={baitUsed}
                                onChangeText={text => setBaitUsed(text)}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Weight (in lbs)"
                                placeholderTextColor="#a1a19f"
                                value={weight}
                                onChangeText={text => setWeight(text)}
                                keyboardType="numeric"
                            />

                        </View>
                        <TouchableOpacity onPress={showTimePicker} style={{ borderTopWidth: 1, borderBottomWidth: 1, padding: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Fontisto name="clock" size={20} color="black" style={{ marginRight: 10 }} />
                                <TouchableOpacity onPress={showTimePicker}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }} >Catch Time</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={handleConfirm}
                                onCancel={hideTimePicker}
                            />
                            {selectedTime && <Text style={{ color: 'black' }}>{formatTime(selectedTime)}</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
                            <Fontisto name="photograph" size={20} color="black" style={{ marginRight: 10 }} />

                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }}>Upload Pic</Text>
                        </TouchableOpacity>

                        <View style={styles.imageContainer}>
                            {images.map((image, index) => (
                                <Image key={index} source={{ uri: image.uri }} style={styles.image} />
                            ))}
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 30 }}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCatch}>
                                {loading ?
                                    <ActivityIndicator size="small" color="white" />
                                    :
                                    <Text style={styles.saveButtonText}>Report Catch</Text>
                                }
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,

    },
    icon: {
        // marginRight: 10,
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 25,
        backgroundColor: '#b9dfab',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40
    },
    instructions: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        width: '48%',
        padding: 10,
        fontSize: 18,
        color: 'black',
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: '#1b6001',
        width: 150,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,

    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        // fontWeight:'bold',
        textAlign: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        // marginTop: 20,
        marginBottom: 20,
        width: '100%',
        height: 80,

        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 70,
        // margin: 5,
    },
    pellet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    }
});