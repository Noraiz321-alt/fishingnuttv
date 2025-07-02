import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const NewsUpload = () => {
    const navigation = useNavigation();
    const route = useRoute();

    // const Category = route.params?.category || route.params.editData.category; // ✅ Dynamically received category

    // console.log('Navigated with Category:', Category);

    // ✅ States
    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [oldImageUrl, setOldImageUrl] = useState(null); // ✅ Old Image URL Store

    const [loading, setLoading] = useState(false);

    // ✅ Check if Edit Mode
    useEffect(() => {
        let newCategory = route.params?.category || route.params?.editData?.category;
        setCategory(newCategory);

        if (route.params?.editData) {
            console.log('show data', route.params?.editData);
            const { id, title, content, image_url } = route.params.editData;
            setId(id);
            setTitle(title);
            setDescription(content);

            if (image_url) {
                setOldImageUrl(image_url);
                setImage(null);
            }
        }
    }, [route.params?.editData]);

    // ✅ Image Select Function
    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && response.assets) {
                const selectedImage = response.assets[0];

                // ✅ Ensure correct image name
                const uriParts = selectedImage.uri.split('/');
                const imageName = uriParts[uriParts.length - 1];

                setImage({
                    uri: selectedImage.uri,
                    name: imageName, // ✅ Now using the correct image name
                    type: selectedImage.type || 'image/jpeg'
                });

                setOldImageUrl();
            }
        });
    };

    // ✅ Submit Function (Post OR Edit)
    const handleSubmit = async () => {
        setLoading(true);
        if (!title || !description) {
            Alert.alert('Error', 'Title and Description are required!');
            return;
        }

        let formData = new FormData();
        if (id) {
            formData.append('id', id);
        }
        formData.append('category', category);
        formData.append('action', id ? 'edit' : 'add');
        formData.append('title', title);
        formData.append('content', description);

        console.log('✅ FormData Before Sending:', formData);

        if (image && image.uri && !oldImageUrl) {
            // ✅ If new image is selected, send proper name
            formData.append('image', {
                uri: image.uri,
                name: image.name, // ✅ Ensured correct image name
                type: image.type,
            });
        } else if (oldImageUrl) {
            // ✅ If old image is used, send image URL instead
            formData.append('image', {
                uri: oldImageUrl,   // ✅ Backend ko "uri" ke andar bhi URL hi chahiye
                name: oldImageUrl.split('/').pop(),  // ✅ Image ka naam extract karo
                type: 'image/jpeg', // ✅ Default type bhejo
            });
        }
        console.log('✅ FormData Before Sending:', JSON.stringify(formData, null, 2));
        console.log('✅ Final FormData:', formData);

        const apiUrl = id
            ? 'https://fishingnuttv.com/adminPanel/crud_blog.php'
            : 'https://fishingnuttv.com/adminPanel/crud_blog.php';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const responseText = await response.text();
            console.log('✅ API Response:', responseText);
            setLoading(false);

            // ✅ Ensure JSON parsing handles unwanted text
            const jsonStartIndex = responseText.indexOf('{');
            let jsonResponse = {};

            if (jsonStartIndex !== -1) {
                try {
                    jsonResponse = JSON.parse(responseText.substring(jsonStartIndex));
                } catch (error) {
                    console.error('❌ JSON Parsing Error:', error);
                }
            }

            console.log('✅ Parsed JSON:', jsonResponse);

            // ✅ Correct Success Condition
            if (jsonResponse?.success === true) {
                setLoading(false);
                Alert.alert(
                    'Success',
                    jsonResponse.message || `News ${id ? 'updated' : 'uploaded'} successfully!`,
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                setLoading(false);
                Alert.alert('Error', jsonResponse.message || 'Failed to submit news.');
            }
        } catch (error) {
            setLoading(false);
            console.error('❌ API Error:', error);
            Alert.alert('Error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: wp('5%'), fontWeight: 'bold', color: 'black' }}>{category}</Text>
                </View>
                <View>
                    <Image style={styles.nav1} source={require('../image/logooo.png')} />
                </View>
            </View>
            <View style={{ alignItems: 'center', paddingTop: 30 }}>
                <Text style={styles.heading}>{id ? `✏️ Edit ${category}` : `📢 Post Your ${category}`}</Text>


                <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    ) : oldImageUrl ? (
                        <Image source={{ uri: oldImageUrl }} style={styles.imagePreview} />
                    ) : (
                        <Text>No Image Selected</Text>
                    )}
                </TouchableOpacity>



                {/* Title Inpuut */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter News Title"
                    placeholderTextColor="#666"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Description Input */}
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter News Description"
                    placeholderTextColor="#666"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>{id ? '✏️ Update News' : '🚀 Post News'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// ✅ Styles
const styles = ScaledSheet.create({
    container: {
        padding: '20@ms',
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: '22@ms',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '30@ms',
    },
    imagePicker: {
        width: '100@ms',
        height: '100@ms',
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10@ms',
        marginBottom: '15@ms',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageText: {
        fontSize: '14@ms',
        color: '#444',
    },
    input: {
        width: '90%',
        padding: '12@ms',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: '8@ms',
        backgroundColor: '#fff',
        fontSize: '16@ms',
        marginBottom: '10@ms',
    },
    textArea: {
        height: '100@ms',
        textAlignVertical: 'top',
    },
    button: {
        width: '90%',
        padding: '15@ms',
        backgroundColor: '#007bff',
        borderRadius: '8@ms',
        alignItems: 'center',
        marginTop: '10@ms',
    },
    buttonText: {
        color: '#fff',
        fontSize: '16@ms',
        fontWeight: 'bold',
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
});

export default NewsUpload;
