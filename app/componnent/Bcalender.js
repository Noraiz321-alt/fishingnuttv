import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Alert, Image, Modal, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

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
    setLoading(true);
    console.log('value name', id)
    setCurrentIndex(index);
    console.log('user id:', memberID);
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/check-availability/${itemData.lake_id}/${id}/${currentDate}/${memberID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      });
      const responseData = await response.json();
      console.log('show data zzzzzz', responseData)
      setLoading(false)
      setGetDates(responseData);
    } catch (error) {
      setLoading(false)
      console.error('Error in API call:', error.message);
    }
  };
  const dataForFlatList = getdates
    ? Object.entries(getdates).map(([date, value]) => ({
      date,
      value: value.split(':')[0],
      flag: value.split(':')[1],
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
    const date = new Date(`2024-${month}-01`);
    return date.toLocaleDateString('en-US',{month: 'long' });
  };
  const images = dataa?.map((peg) => peg.peg_image) || [];

  useEffect(() => {
    PegApies()
    palletApi()
  }, []);
  const PegApies = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-pegs/${itemData.lake_id}`);
      setDataa(response.data);
      handleIndexChanged(currentIndex, response?.data[0]?.id);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const availabilitypostapi = async (selectedDateNow) => {
    try {
      const formdata = new FormData();
      formdata.append('peg_id', dataa[currentIndex]?.id || 'N/A');
      formdata.append('lake_id', itemData.lake_id);
      console.log('show booking dataa>>>o>>>>>', formdata, memberID, selectedDateNow)

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
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleDelete = async (selectedDateNow) => {
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-booking-pegs/${memberID}/${selectedDateNow}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Delete successful:', data);
      handleIndexChanged(currentIndex, dataa[currentIndex]?.id);
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  const pelletDelete = async (selectedDateNow) => {
    try {
      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/order-pellets/${memberID}/${selectedDateNow}/${itemData.lake_id}/${dataa?.[currentIndex]?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Delete pellet data:', data);
    } catch (error) {
      console.error('Error deleting data:', error.message);
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
      console.error('Error:', error.message);
    }
  };

  const SkeletonRow = () => {
    return (
      <View style={styles.skeletonRow}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.skeletonBox1}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.skeletonBox2}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topImageWrap}>
        {dataa.length > 0 && (
          <>
            <Swiper
              key={currentIndex}
              loop={false}
              index={currentIndex}
              showsPagination={false}
              onIndexChanged={(index) => {
                setCurrentIndex(index);
                const id = dataa[index]?.id ?? "NO_ID_FOUND";
                handleIndexChanged(index, id);
              }}
            >
              {images.map((img, index) => (
                <View key={index} style={styles.swiperSlide}>
                  <Image
                    source={{ uri: img }}
                    style={styles.swiperImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>

            {/* custom clickable dots */}
            <View style={styles.dotsWrap}>
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const id = dataa[index]?.id ?? "NO_ID_FOUND";
                    setCurrentIndex(index);
                    handleIndexChanged(index, id);
                  }}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.dotActive
                  ]}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.topBarAbsolute}>
          <View style={styles.topBarRow}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={s(20)} color="black" />
            </TouchableOpacity>
            <View>
              <Text style={styles.topBarTitle}>Choose a peg</Text>
            </View>
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationText}  allowFontScaling={false}>{`${dataa?.[currentIndex]?.name || 'N/A'} / ${images.length}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.pegNoWrap}>
          <View style={styles.pegNoBadge}>
            <Text style={styles.pegNoText}>{`Peg No : ${dataa?.[currentIndex]?.name || 'N/A'}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.lowerWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}  allowFontScaling={false}>
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
          <Text style={styles.paragraph} numberOfLines={2}  allowFontScaling={false}>
            {dataa?.[currentIndex]?.description}
          </Text>
         

          <View style={styles.center}>
            <Text style={styles.ctaTitle}>TAP A DATE TO BOOK</Text>
          </View>
          <View style={styles.center}>
            <Text style={styles.smallNote}  allowFontScaling={false}>All Booking are for 24 hours - 8 AM to 8 AM</Text>
          </View>

          <View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={styles.legendColorAvailable}></View>
                <View><Text style={styles.legendText}  allowFontScaling={false}> Available</Text></View>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendColorUnavailable}></View>
                <View><Text style={styles.legendText}  allowFontScaling={false}> Unavailable</Text></View>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendColorBooked}></View>
                <View><Text style={styles.legendText}  allowFontScaling={false}> Booked</Text></View>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingWrap}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => <SkeletonRow key={i} />)}
              </View>
            ) : (
              <View style={styles.flatlistWrap}>
                {dataForFlatList && dataForFlatList.length > 0 ? (
                  <FlatList
                    data={dataForFlatList}
                    keyExtractor={(item) => `${item.date}-${item.value}`}
                    contentContainerStyle={{ paddingBottom: 60 }} 
                    renderItem={({ item }) => {
                      const [year, month, day] = item.value.split('-');
                      return (
                        <View style={[
                          styles.dateRow,
                          { backgroundColor: item.flag == 1 ? '#1b6001' : item.flag == 2 ? 'blueviolet' : '#959595' }
                        ]}>
                          <View style={styles.dateLeft}>
                            <View style={styles.dateDayRow}>
                              <Text style={styles.dateText} allowFontScaling={false}>{day}</Text>
                              <Text style={styles.daySuffix}allowFontScaling={false}>{getOrdinalSuffix(day)}</Text>
                            </View>
                            <Text style={styles.dateText} allowFontScaling={false}>{formattedMonth(month)}</Text>
                            <Text style={styles.dateText} allowFontScaling={false}> {year}</Text>
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
                                        availabilitypostapi(item.value);
                                        setSelectedDate(item.value);
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                            >
                              <Text style={styles.btnText}>Available</Text>
                            </TouchableOpacity>
                          ) : item.flag == 0 ? (
                            <View style={styles.btn}>
                              <View>
                                <Text style={styles.btnText}>Unavailable</Text>
                              </View>
                            </View>
                          ) : (
                            item.flag == 2 && (
                              <View style={styles.btn2}>
                                <View style={styles.bookedRow}>
                                  <Text style={styles.btnText}>Booked</Text>
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
                                        <AntDesign name="delete" size={s(18)} color={'black'} />
                                      </TouchableOpacity>
                                    ) : (
                                      <FontAwesome name="ban" size={s(18)} color="black" />
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
                  <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>Your two months booking peg has reached</Text>
                  </View>
                )}
              </View>
            )}
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

            <View style={styles.modalIconWrap}>
              <FontAwesome name="check-circle" size={s(60)} color="#4aaf50" />
            </View>
            <View style={styles.modalTextWrap}>
              <Text style={styles.modalHeading}>
                Please confirm if you want to order pellet
              </Text>
              <Text style={styles.modalSub}>We allow only fishery pellet.</Text>
              <Text style={styles.modalSub}>Would you like to order some here?</Text>
            </View>

            <View>
              <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                <View style={styles.pelletWrap}>
                  <Text style={styles.pelletText}  allowFontScaling={false}>
                    {selectedValue
                      ? `${selectedValue.weight} X Pkt (750g) - (£${selectedValue.price})`
                      : pelletData.length > 0
                        ? `${pelletData[0].weight} X Pkt (750g) - (£${pelletData[0].price})`
                        : 'None'}
                  </Text>
                  <TouchableOpacity onPress={() => setScrollViewVisible(!isScrollViewVisible)}>
                    {isScrollViewVisible ? (
                      <AntDesign name="caretup" size={s(14)} color="#555555" />
                    ) : (
                      <AntDesign name="caretdown" size={s(14)} color="#555555" />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View style={styles.center}>
                {isScrollViewVisible && (
                  <View style={styles.pelletListWrap}>
                    {pelletData.map((pellet) => (
                      <View style={styles.pelletListItem} key={pellet.id}>
                        <Text style={styles.pelletListText}
                          onPress={() => {
                            setSelectedValue(pellet);
                            setScrollViewVisible(false);
                          }}
                           allowFontScaling={false}
                        >
                          {`${pellet.weight} X Pkt (750g) - (£${pellet.price})`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.modalBottomFlex}>
              <View style={styles.buttonContainer}>
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => {
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

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingBottom: vs(20),
  },

  topImageWrap: {
    flex: 1.5,
    position: 'relative',
  },

  swiperSlide: {
    width: '100%',
    height: vs(260), // roughly same as previous hp('36%')
  },

  swiperImage: {
    width: '100%',
    height: vs(200),
    // borderRadius: s(5),
  },

  dotsWrap: {
    position: 'absolute',
    bottom: vs(10),
    flexDirection: 'row',
    alignSelf: 'center',
    gap: s(3),
  },

  dot: {
    width: s(8),
    height: s(8),
    borderRadius: s(5),
    backgroundColor: '#dcdcdc',
    marginHorizontal: s(1),
  },

  dotActive: {
    backgroundColor: '#1b6001',
  },

  topBarAbsolute: {
    position: 'absolute',
    top: vs(10),
    width: '100%',
  },

  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(15),
  },

  icon: {
    backgroundColor: '#e2e4eb',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(40),
    height: s(40),
    borderRadius: s(100),
  },

  topBarTitle: {
    fontSize: s(18),
    color: '#e2e4eb',
  },

  paginationContainer: {
    backgroundColor: '#e2e4eb',
    justifyContent: 'center',
    width: s(45),
    height: s(45),
    borderRadius: s(100),
  },

  paginationText: {
    textAlign: 'center',
    color: '#000',
    letterSpacing: -1.2,
    fontSize: s(12),
  },

  pegNoWrap: {
    position: 'absolute',
    bottom: vs(28),
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  pegNoBadge: {
    backgroundColor: '#1b6001',
    borderRadius: s(5),
    paddingVertical: vs(4),
    justifyContent: 'center',
    paddingHorizontal: s(15),
  },

  pegNoText: {
    color: 'white',
    fontSize: s(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  lowerWrap: {
    flex: 4,
  },

  sectionHeader: {
    paddingTop: vs(10),
    paddingHorizontal: s(15),
  },

  sectionTitle: {
    color: 'black',
    fontSize: s(20),
    fontWeight: 'bold',
    paddingBottom: vs(2),
  },

  sectionContent: {
    paddingVertical: vs(5),
    paddingHorizontal: s(15),
  },

  paragraph: {
    // marginBottom: vs(5),
    fontSize: s(10),
    color: '#565656',
    height: vs(28),
  },

  center: {
    alignItems: 'center',
  },

  ctaTitle: {
    color: 'black',
    fontSize: s(18),
    fontWeight: 'bold',
  },

  smallNote: {
    color: '#555555',
    fontSize: s(11),
  },

  legendRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    justifyContent: 'space-between',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendColorAvailable: {
    width: s(14),
    height: s(10),
    backgroundColor: '#1b6001',
    marginRight: s(6),
  },

  legendColorUnavailable: {
    width: s(14),
    height: s(10),
    backgroundColor: '#959595',
    marginRight: s(6),
  },

  legendColorBooked: {
    width: s(14),
    height: s(10),
    backgroundColor: 'blueviolet',
    marginRight: s(6),
  },

  legendText: {
    fontSize: s(16),
    color: 'black',
    letterSpacing: -0.4,
  },

  loadingWrap: {
    height: vs(360), // similar to hp('48%')
    paddingTop: vs(10),
  },

  flatlistWrap: {
    height: vs(360),
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(4),
    paddingVertical: vs(9),
    paddingHorizontal: s(15),
    alignItems: 'center',
    // borderRadius: s(6),
  },

  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(8),
  },

  dateText: {
    fontSize: s(14),
    fontWeight: 'bold',
    color: '#fff',
  },

  daySuffix: {
    fontSize: s(10),
    fontWeight: 'bold',
    color: 'white',
    top: vs(1),
  },

  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: s(120),
    height: vs(25),
  },

  btn2: {
    paddingHorizontal: s(12),
    justifyContent: 'center',
    backgroundColor: 'white',
    width: s(120),
    height: vs(25),
  },

  btnText: {
    color: 'black',
    fontSize: s(12),

  },

  bookedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  emptyWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '25%',
    paddingHorizontal: s(20),
  },

  emptyText: {
    fontSize: s(18),
    color: '#a1a19f',
    textAlign: 'center',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    marginHorizontal: s(10),
    backgroundColor: '#fff',
    paddingTop: vs(10),
    width: s(340),
    height: vs(600),
    borderRadius: s(10),
  },

  modalIconWrap: {
    alignItems: 'center',
  },

  modalTextWrap: {
    alignItems: 'center',
    paddingHorizontal: s(25),
  },

  modalHeading: {
    fontSize: s(16),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },

  modalSub: {
    paddingTop: vs(8),
    color: '#555555',
    textAlign: 'center',
  },

  pelletWrap: {
    alignItems: 'center',
    marginTop: vs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: s(1),
    width: s(260),
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: s(5),
    alignSelf: 'center',
  },

  pelletText: {
    color: 'black',
    fontSize: s(13),
  },

  pelletListWrap: {
    width: s(260),
    marginTop: vs(10),
    paddingTop: vs(10),
    justifyContent:'center',
    borderRadius: s(5),
  },

  pelletListItem: {
    backgroundColor: '#616161',
    paddingHorizontal: s(10),
    marginBottom: vs(10),
    borderRadius: s(5),
  },

  pelletListText: {
    paddingVertical: vs(6),
    color: 'white',
    fontSize: s(13),
  },

  modalBottomFlex: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: s(10),
  },

  buttonContainer: {
    alignItems: 'center',
    paddingVertical: vs(12),
    backgroundColor: '#ebebeb',
    borderBottomStartRadius: s(10),
  },

  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: s(220),
  },

  button1: {
    backgroundColor: '#a0a0a0',
    paddingVertical: vs(8),
    paddingHorizontal: s(26),
    borderRadius: s(5),
  },

  buttonText1: {
    color: '#000',
    fontSize: s(15),
    fontWeight: 'bold',
  },

  button2: {
    backgroundColor: '#4aaf50',
    paddingVertical: vs(8),
    paddingHorizontal: s(26),
    borderRadius: s(5),
  },

  buttonText2: {
    color: '#fff',
    fontSize: s(15),
    fontWeight: 'bold',
  },

  // skeleton styles
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(6),
    paddingVertical: vs(10),
    paddingHorizontal: s(15),
    backgroundColor: '#D9D9D9',
    // borderRadius: s(6),
  },

  skeletonBox1: {
    width: s(140),
    height: vs(18),
    borderRadius: s(4),
  },

  skeletonBox2: {
    width: s(100),
    height: vs(18),
    borderRadius: s(4),
  },

});

export default Bcalender;
