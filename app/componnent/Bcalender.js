import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Alert, SafeAreaView, Image, Modal, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import ImageSlider from 'react-native-image-slider';
import Carousel from 'react-native-snap-carousel';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Bcalender = ({ route }) => {
  const { width } = Dimensions.get('window');

  const { itemData, memberID } = route.params;
  const currentDate = new Date().toISOString().split('T')[0];
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataa, setDataa] = useState([]);
  const [getdates, setGetDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPellet, setSelectedPellet] = useState(null);
  const [isScrollViewVisible, setScrollViewVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [pelletData, setPelletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const handleIndexChanged = async (index, id) => {
    console.log('value name', id)
    setCurrentIndex(index);
    console.log('user id:', memberID);
    // console.log('Current Date:',i
    try {
      // Perform your post API call here using fetch
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/check-availability/${itemData.lake_id}/${id}/${currentDate}/${memberID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      });
      const responseData = await response.json();
      console.log('show data zzzzzz',responseData )
      setLoading(false)
      setGetDates(responseData);
      // console.log('flaf data with date :', responseData);
    } catch (error) {
      setLoading(false)
      console.error('Error in API call:', error.message);
    }
  };
  const dataForFlatList = getdates
    ? Object.entries(getdates).map(([date, value]) => ({
      date,
      value: value.split(':')[0],
      flag: value.split(':')[1], // Split the 'value' string and take the second part
    }))
    : [];

  const getOrdinalSuffix = (number) => {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };
  const formattedMonth = (month) => {
    const date = new Date(`2024-${month}-01`); // Assuming the year and day
    return date.toLocaleDateString('en-US', { month: 'long' });
  };
  const images = dataa?.map((peg) => peg.peg_image) || [];
  // const images = dataa ? dataa.map((peg) => peg.peg_image) : [];
  // const images = dataa && dataa.pegs ? dataa.pegs.map((peg) => peg.peg_image) : [];



  useEffect(() => {
    PegApies()
    palletApi()
  }, []);
  const PegApies = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-pegs/${itemData.lake_id}`);
      // console.log('test lid', response.data);
      // console.log('API response:', response.data);
      setDataa(response.data);

      handleIndexChanged(currentIndex, response?.data[0]?.id);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  // console.log('peg data',dataa);

  const availabilitypostapi = async (selectedDateNow) => {
    try {
      const formdata = new FormData();
      formdata.append('peg_id', dataa[currentIndex]?.id || 'N/A');
      formdata.append('lake_id', itemData.lake_id);
      console.log('show booking dataa>>>o>>>>>',formdata,memberID,selectedDateNow)


      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-booking-pegs/${memberID}/${selectedDateNow}`, {
        method: 'POST',
        body: formdata,
      });

      const responseData = await response.json();
      console.log('Response data: post api', responseData);
      
      if (responseData.error) {
        Alert.alert("Details", responseData.error.replace(/\n/g, "\n"));
      } else {
        handleIndexChanged(currentIndex, dataa[currentIndex]?.id);
        setIsModalVisible(true); // Agar error nahi hai toh modal show hoga
      }

      // handleIndexChanged(currentIndex, dataa[currentIndex]?.id);

      // setIsModalVisible(true);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };


  const handleDelete = async (selectedDateNow) => {

    console.log('member id ', memberID)
    console.log('date ', selectedDateNow)
    console.log('lake',)
    console.log('id',)
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-booking-pegs/${memberID}/${selectedDateNow}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // You may need to include additional headers like authorization headers if required by the API
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      handleIndexChanged(currentIndex, dataa[currentIndex]?.id);
      // Handle the successful response here
    } catch (error) {
      console.error('Error deleting data:', error.message);
      // Handle errors here
    }
  };

  const pelletDelete = async (selectedDateNow) => {
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/order-pellets/${memberID}/${selectedDateNow}/${itemData.lake_id}/${dataa?.[currentIndex]?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include additional headers if required by the API (e.g., authorization)
        },
      });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      const data = await response.json();
      console.log('Delete pellet data:', data);

      // Handle the successful response here
    } catch (error) {
      console.error('Error deleting data:', error.message);
      // Handle errors here
    }
  };

  const palletApi = async () => {
    try {
      const response = await axios.get('https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/pellets');
      setPelletData(response.data);
      setPelletData(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const handleYesButtonClick = () => {

    let pellet_weight;
    let pellet_price;
    if (selectedValue) {
      pellet_weight = selectedValue.weight;
      pellet_price = selectedValue.price;
    } else if (pelletData.length > 0) {
      pellet_weight = pelletData[0].weight;
      pellet_price = pelletData[0].price;
    } else {
      pellet_weight = 'DefaultWeight';
      pellet_price = 'DefaultPrice';
    }
    const data = {

      pellet_weight: pellet_weight,
      pellet_price: pellet_price,
    };
    bookingpostapi(data)
  };

  const bookingpostapi = async (data) => {
    try {
      const formData = new FormData();
      formData.append('pellet_weight', data.pellet_weight);
      formData.append('pellet_price', data.pellet_price);

      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/order-pellets/${memberID}/${selectedDate}/${itemData.lake_id}/${dataa?.[currentIndex]?.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data', // You may not need this header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data forward:', responseData);


      setIsModalVisible(false);
      Alert.alert(
        'Success!',
        'Thank you for your pellet order. It will be delivered to you at the lake. Please have cash to pay.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false }
      )

    } catch (error) {
      // Handle errors here
      console.error('Error:', error.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1.5, position: 'relative' }}>
        <ImageSlider
          images={images}
          onEndReached={() => console.log('End reached')}
          position={currentIndex}
          onPositionChanged={(index) => {
            const id = dataa?.[index]?.id ?? null;

            handleIndexChanged(index, id);
          }}
        // height={hp('32%')}
        />
        <View style={{ position: 'absolute', top: 10, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={25} color="black" />
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 22, color: '#e2e4eb' }}>Choose a peg</Text>
            </View>
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationText}>{`${dataa?.[currentIndex]?.name || 'N/A'} / ${images.length}`}</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: 35, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#1b6001', width: hp('15%'), borderRadius: 5, height: hp('4%'), justifyContent:'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{`Peg No : ${dataa?.[currentIndex]?.name|| 'N/A'}  `}</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 4 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {itemData.name.length > 27 ? (
              <>
                {itemData.name.substring(0, 26)}
                <Text> ...</Text>
              </>
            ) : (
              itemData.name
            )}
          </Text>
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.paragraph}>

            {dataa?.[currentIndex]?.description}
          </Text>
          {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, */}

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold' }}>TAP A DATE TO BOOK</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#555555', fontSize: 12 }}>All Booking are for 24 hours - 8 AM to 8 AM</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between',}}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: hp('3%'), height: hp('1.8%'), backgroundColor: '#1b6001' }}></View>
                <View><Text style={{ fontSize: 18, color: 'black',letterSpacing: -0.8, }}> Available</Text></View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: hp('3%'), height: hp('1.8%'), backgroundColor: '#959595' }}></View>
                <View><Text style={{ fontSize: 18, color: 'black' ,letterSpacing: -0.8, }}> Unavailable</Text></View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: hp('3%'), height: hp('1.8%'), backgroundColor: 'blueviolet' }}></View>
                <View><Text style={{ fontSize: 18, color: 'black' ,letterSpacing: -0.8, }}> Booked</Text></View>
              </View>
            </View>
            {loading ?
              <ActivityIndicator size="large" color="black" style={{top:'100%'}} />
              :
              <View style={{ height: hp('48%'), }}>
                {dataForFlatList && dataForFlatList.length > 0 ? (
                  <FlatList
                    data={dataForFlatList}
                    keyExtractor={(item) => `${item.date}-${item.value}`}
                    renderItem={({ item }) => {
                      // Extracting day, month, and year from the formatted date
                      const [year, month, day] = item.value.split('-');
                      return (
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          // flexWrap:'wrap',
                          marginVertical: 5,
                          paddingVertical: 8.5,
                          paddingHorizontal: 15,
                          backgroundColor: item.flag == 1 ? '#1b6001' : item.flag == 2 ? 'blueviolet' : '#959595',
                          alignItems: 'center'
                        }}>
                          <View style={{
                            flexDirection: 'row'
                          }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.dateText}>{day}</Text>
                              <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white', top: 1 }}>{getOrdinalSuffix(day)} </Text>
                            </View>
                            <Text style={styles.dateText}>{formattedMonth(month)}</Text>
                            <Text style={styles.dateText}> {year}</Text>
                          </View>

                          {item.flag == 1 ? (
                            <TouchableOpacity
                              style={styles.btn}
                              onPress={() => {
                                Alert.alert(
                                  'Confirmation',
                                  'Are you sure you want to book for this date?',
                                  [
                                    {
                                      text: 'No',
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () => {
                                        // Set the selected date here
                                        availabilitypostapi(item.value);
                                        setSelectedDate(item.value);
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                            >
                              <Text style={{ color: 'black' }}>Available</Text>
                            </TouchableOpacity>
                          ) : item.flag == 0 ? (
                            <View style={styles.btn}>
                              <View>
                                <Text style={{ color: 'black' }} >Unavailable</Text>
                              </View>
                            </View>
                          ) : (
                            // item.flag == 2 && (
                            //   <View style={styles.btn2}>
                            //     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            //       <Text style={{ color: 'black' }}>Booked</Text>
                            //       <TouchableOpacity onPress={() => {
                            //         Alert.alert(
                            //           'Confirmation',
                            //           'Are you sure you want to cancel booking',
                            //           [
                            //             {
                            //               text: 'No',
                            //               style: 'cancel',
                            //             },
                            //             {
                            //               text: 'Yes',
                            //               onPress: () => {
                            //                 handleDelete(item.value)
                            //                 pelletDelete(item.value)
                            //               },
                            //             },
                            //           ],
                            //           { cancelable: false }
                            //         );
                            //       }} >
                            //         <AntDesign name="delete" size={wp('5%')} color={'black'} />
                            //       </TouchableOpacity>
                            //     </View>
                            //   </View>
                            // )
                            item.flag == 2 && (
                              <View style={styles.btn2}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text style={{ color: 'black' }}>Booked</Text>
                                  {
                                    new Date(item.value) >= new Date(currentDate) ? (
                                      <TouchableOpacity onPress={() => {
                                        Alert.alert(
                                          'Confirmation',
                                          'Are you sure you want to cancel booking',
                                          [
                                            {
                                              text: 'No',
                                              style: 'cancel',
                                            },
                                            {
                                              text: 'Yes',
                                              onPress: () => {
                                                handleDelete(item.value)
                                                pelletDelete(item.value)
                                              },
                                            },
                                          ],
                                          { cancelable: false }
                                        );
                                      }} >
                                        <AntDesign name="delete" size={wp('5%')} color={'black'} />
                                      </TouchableOpacity>
                                    ) : (
                                      <FontAwesome name="ban" size={wp('5%')} color="black" />
                                    )
                                  }
                                </View>
                              </View>
                            )
                          )}

                        </View>

                      )
                    }}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '25%', paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 30, color: '#a1a19f', textAlign: 'center' }}>Your two months booking peg has reached</Text>
                  </View>
                )}

              </View>
}
          </View>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={{ alignItems: 'center' }}>
              <FontAwesome name="check-circle" size={100} color="#4aaf50" />
            </View>
            <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#000000' }}>
                Please confirm if you want to order pellet

              </Text>
              <Text style={{ paddingTop: 10, color: '#555555' }}>We allow only fishery pellet.</Text>
              <Text style={{ color: '#555555',textAlign:'center' }}>
                Would you like to order some here?
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                  <View style={styles.pellet}  >
                    <Text style={{ color: 'black' }}>
                      {selectedValue
                        ? `${selectedValue.weight} X Pkt (750g) - (£${selectedValue.price})`
                        : pelletData.length > 0
                          ?
                          `${pelletData[0].weight} X Pkt (750g) - (£${pelletData[0].price})`
                          : 'None'}
                    </Text>
                    <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                      {isScrollViewVisible ? (
                        <AntDesign name="caretup" size={14} color="#555555" />
                      ) : (
                        <AntDesign name="caretdown" size={14} color="#555555" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>

                {isScrollViewVisible && (
                  <View style={{ width: hp('35'), marginTop: 10, paddingTop: 10, borderRadius: 5, }}>
                    {/* <ScrollView style={{ height: hp('25%') }}> */}
                    {pelletData.map((pellet) => (
                      <View style={{ backgroundColor: '#616161', paddingHorizontal: 10, marginBottom: 10, borderRadius: 5, }}>
                        <Text style={{ paddingVertical: 5, color: 'white' }} key={pellet.id}
                          onPress={() => {
                            setSelectedValue(pellet);
                            setScrollViewVisible(false);
                          }}
                        >
                          {`${pellet.weight} X Pkt (750g) - (£${pellet.price})`}
                        </Text>
                      </View>
                    ))}
                    {/* </ScrollView> */}
                  </View>
                )}
              </View>
            </View>

            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              borderRadius: 10
            }}>

              <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: hp('35%') }}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => {
                      // Handle booking logic here (including selected pellet)
                      setIsModalVisible(false);
                    }}
                  >
                    <Text style={styles.buttonText1}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleYesButtonClick()}
                  >
                    <Text style={styles.buttonText2}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  paginationContainer: {
    backgroundColor: '#e2e4eb',
    justifyContent: 'center',
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: 100,
  },
  icon: {
    backgroundColor: '#e2e4eb',
    justifyContent: 'center',
    alignItems: 'center',
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: 100,
  },
  paginationText: {
    textAlign: 'center',
    color: '#000',
    letterSpacing: -1.8,
  },

  text: {
    textAlign: 'center',
    padding: hp('1%'),
  },
  sectionHeader: {
    paddingTop: 10,
    paddingHorizontal: 15,

  },
  sectionTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 2
  },
  sectionContent: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 10,
    color: '#565656',
    height: wp('9%'),
  },
  dateItem: {
    padding: 10,
    borderBottomWidth: 8,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  availabilityText: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 10,
    // width: hp('42%'),
    height: hp('90%'),
    //  paddingH:10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
  },
  modalDateText: {
    fontSize: 16,
  },
  buttonContainer: {
    // width: hp('45%'),
    // flexDirection: 'row',

    alignItems: 'center',
    // paddingHorizontal: 70,
    paddingVertical: 20,
    backgroundColor: '#ebebeb',
    borderEndEndRadius: 10,
    // borderStartEndRadius:10
    borderBottomStartRadius: 10
  },
  button1: {
    backgroundColor: '#a0a0a0',
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText1: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold'
  },
  button2: {
    backgroundColor: '#4aaf50',
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText2: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  },
  dateCard: {

  },
  dateText: {

    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  btn: {
    // flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: hp('18%'),
    height: hp('3.5%'),
  },
  btn2: {
    // alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: hp('18%'),
    height: hp('3.5%'),
  },

  pellet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    width: hp('35'),
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  }
  // New styles

});


export default Bcalender;
