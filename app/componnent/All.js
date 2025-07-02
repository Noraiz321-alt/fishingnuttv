import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const All = ({ data }) => {


    console.log('show data xs', data)

    const renderItem = ({ item }) => {
        const bookingDate = new Date(item.booking_date);
        const today = new Date();
      
        const isToday =
          bookingDate.getFullYear() === today.getFullYear() &&
          bookingDate.getMonth() === today.getMonth() &&
          bookingDate.getDate() === today.getDate();
      
        return (
          <View style={styles.card}>
            {/* FILTER TAG */}
            {isToday ? (
              <View style={styles.todayContainer}>
                <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>Today</Text>
              </View>
            ) : new Date(item.booking_date) > new Date() ? (
              <View style={styles.upcomingContainer1}>
                <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>Upcoming</Text>
              </View>
            ) : (
              <View style={styles.upcomingContainer2}>
                <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>Previous</Text>
              </View>
            )}
      
            {/* CARD BODY */}
            <View style={styles.cardContent}>
              <View style={styles.imageContainer}>
                <Image style={styles.img} source={{ uri: item.peg_image }} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.heading}>
                  {item.name.length > 18 ? (
                    <>
                      {item.name.substring(0, 15)}
                      <Text style={{ color: 'black' }}> ...</Text>
                    </>
                  ) : (
                    item.name
                  )}
                </Text>
                <View style={{ paddingVertical: 2 }}>
                  <Text style={{ fontSize: wp('2.6%'), fontWeight: 'bold', color: 'black' }}>
                    Peg NO: {item.peg_name}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Text style={styles.peg}>{item.from_shift}  |  </Text>
                  <Text style={styles.peg}>{item.to_shift}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      };
  
    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: s(10) }}>
                {data && data.length > 0 ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={{justifyContent: 'center', alignItems: 'center',paddingTop:'50%' }}>
                        <Text style={{fontSize:30,color:'#a1a19f'}}>Nothing to show !</Text>
                    </View>
                )}
            </View>
        </View>
    )
}
export default All;
const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    card: {
        borderRadius: '12@s', // Using `s` for responsive scaling
        overflow: 'hidden',
        backgroundColor: '#eaf5e6',
        // paddingVertical: '5@vs',
        marginVertical: '8@vs',
        justifyContent: 'center',
    },
    heading: {
        fontSize: '18@s', // Responsive font size
        fontWeight: 'bold',
        color: 'black',
    },
    peg: {
        letterSpacing: '-0.8@s',
        color: '#5f5f5e',
        fontWeight: 'bold',
        fontSize: '10@s', // Responsive font size
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: '10@s', // Responsive padding
        paddingRight:'10@s',
        alignItems: 'center',
    },
    upcomingContainer1: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5@s',
        backgroundColor: '#4B0082',
        alignItems: 'center',
        width: '68@s',
        borderBottomLeftRadius: '10@s',
    },
    upcomingContainer2: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5@s',
        backgroundColor: 'red',
        alignItems: 'center',
        width: '64@s',
        borderBottomLeftRadius: '10@s',
    },
    todayContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5@s',
        backgroundColor: '#1b6001', // Dark green
        alignItems: 'center',
        width: '64@s',
        borderBottomLeftRadius: '10@s',
      },
    imageContainer: {
        borderRadius: '10@s',
        width: '90@s', // Scaled width
        height: '73@vs', // Full height of the card
        backgroundColor: '#f8f8ff',
        overflow: 'hidden', 
        // Add styling if needed for the image container
    },
    img: {
        overflow: 'hidden',
        borderRadius: '4@s',
        width: '100%', // Set the width to 100% of the image container
        height: '100%', // Set the height to 100% of the image container
        aspectRatio: 1.5, // Maintain the aspect ratio (adjust as needed)
    },
    textContainer: {
        flex: 1,
        marginLeft: '10@s', // Responsive margin
    },
});