import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Sample Products Data

const PRODUCTS_DATA = {
  pellets: [
    {
      id: '1',
      name: 'Premium Pellets Mix',
      description: 'High-quality fishing pellets',
      price: '£2.99',
      image: require('../image/pellets.jpg'), // Replace with your local path
      rating: 4.5,
      inStock: true,
    },
    // {
    //   id: '2',
    //   name: 'Carp Pellets Pro',
    //   description: 'Professional grade pellets',
    //   price: '£15.99',
    //   // image: require('../image/groundbait.jpg'),
    //   rating: 4.8,
    //   inStock: true,
    // },
  ],
  boilies: [
    {
      id: '3',
      name: 'Strawberry Boilies',
      description: 'Sweet fruity boilies',
      price: '£8.49',
      image: require('../image/boilies.jpg'),
      rating: 4.6,
      inStock: true,
    },
    {
      id: '4',
      name: 'Fishmeal Boilies',
      description: 'Classic fishmeal flavor',
      price: '£11.99',
      image: require('../image/boilies1.jpg'),
      rating: 4.7,
      inStock: false,
    },
    {
      id: '5',
      name: 'Fishmeal Boilies',
      description: 'Classic fishmeal flavor',
      price: '£8.49',
      image: require('../image/boilies3.jpg'),
      rating: 4.7,
      inStock: false,
    },
  ],
  popups: [
    {
      id: '5',
      name: 'Fluorescent Pop Ups',
      description: 'High visibility pop-ups',
      price: '£3.49',
      image: require('../image/popups.jpg'),
      rating: 4.4,
      inStock: true,
    },
    {
      id: '6',
      name: 'Cork Ball Pop Ups',
      description: 'Premium cork ball mix',
      price: '£3.49',
      image: require('../image/popups1.jpg'),
      // image: require('../image/popups1.pg'),
      rating: 4.5,
      inStock: true,
    },
  ],
  groundbait: [
    {
      id: '7',
      name: 'Cloud9 Groundbait',
      description: 'Ultimate cloud effect mix',
      price: '£4.49',
      image: require('../image/groundbait.jpg'),
      rating: 4.9,
      inStock: true,
      sizes: ['1kg', '5kg', '10kg', '20kg'],
    },
    // {
    //   id: '8',
    //   name: 'Method Mix Groundbait',
    //   description: 'Perfect for method feeders',
    //   price: '£5.99',
    //   // mage: require('../image/popups.jpg'),
    //   rating: 4.6,
    //   inStock: true,
    // },
  ],
};


const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'grid-outline' },
  { id: 'pellets', name: 'Pellets', icon: 'nutrition-outline' },
  { id: 'boilies', name: 'Boilies', icon: 'ellipse-outline' },
  { id: 'popups', name: 'Pop Ups', icon: 'balloon-outline' },
  { id: 'groundbait', name: 'Ground Bait', icon: 'cube-outline' },
];

const StoreProductsScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return Object.values(PRODUCTS_DATA).flat();
    }
    return PRODUCTS_DATA[selectedCategory] || [];
  };

  const filteredProducts = getFilteredProducts();

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
      >
        <Icon
          name={item.icon}
          size={20}
          color={isSelected ? '#FFF' : '#000'}
        />
        <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item, index }) => {
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        style={styles.productCard}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
        >
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.productImage} />
            {!item.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
            <TouchableOpacity style={styles.favoriteButton}>
              <Icon name="heart-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#1b6001" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>

            {/* Price and Add Button */}
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{item.price}</Text>
              <TouchableOpacity
                style={styles.addButton}
                disabled={!item.inStock}
              >
                <Icon
                  name="add-circle"
                  size={32}
                  color={item.inStock ? '#1b6001' : '#666'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fishing Store</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="cart-outline" size={28} color="#000" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <Icon name="search" size={22} color="#999" style={styles.searchIcon} />
        <Text style={styles.searchInput}>Search products...</Text>
      </View> */}

      {/* Banner */}
      <Animatable.View animation="fadeIn" style={styles.banner}>
        <View >
          <Text style={styles.bannerTitle}>Check out our PREMIUM high nutritional baits!</Text>
          <Text style={styles.bannerSubtitle}>
          Choose from our baits below to discover more about what we offer!
          </Text>
        </View>
      </Animatable.View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView >
  );
};

export default StoreProductsScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '20@s',
    paddingVertical: '15@vs',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  menuButton: {
    padding: '5@s',
  },

  headerTitle: {
    fontSize: '20@ms',
    fontWeight: 'bold',
    color: '#000',
  },

  cartButton: {
    padding: '5@s',
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#1b6001',
    borderRadius: '10@s',
    width: '18@s',
    height: '18@s',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadgeText: {
    color: '#FFF',
    fontSize: '10@ms',
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: '20@s',
    marginTop: '15@vs',
    borderRadius: '12@s',
    paddingHorizontal: '15@s',
    paddingVertical: '12@vs',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  searchIcon: {
    marginRight: '10@s',
  },

  searchInput: {
    flex: 1,
    color: '#999',
    fontSize: '14@ms',
  },

  banner: {
    backgroundColor: '#FFF',
    marginHorizontal: '20@s',
    marginTop: '15@vs',
    borderRadius: '12@s',
    paddingVertical: '20@s',
    paddingHorizontal: '10@s',
    borderWidth: '1@s',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  bannerContent: {
    alignItems: 'center',
  },

  bannerTitle: {
    fontSize: '16@ms',
    fontWeight: 'bold',
    color: '#000',
    // marginBottom: '5@vs',
  },

  bannerSubtitle: {
    fontSize: '13@ms',
    color: '#666',
  },

  categoriesSection: {
    marginTop: '20@vs',
  },

  categoriesList: {
    paddingHorizontal: '15@s',
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    borderRadius: '20@s',
    marginHorizontal: '5@s',
    borderWidth: '1@s',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  categoryChipActive: {
    backgroundColor: '#1b6001',
    borderColor: '#1b6001',
  },

  categoryText: {
    color: '#000',
    fontSize: '13@ms',
    marginLeft: '5@s',
    fontWeight: '600',
  },

  categoryTextActive: {
    color: '#FFF',
  },

  productsList: {
    paddingHorizontal: '15@s',
    paddingTop: '15@vs',
    paddingBottom: '20@vs',
  },

  productCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: '15@s',
    margin: '5@s',
    overflow: 'hidden',
    borderWidth: '1@s',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '150@vs',
    backgroundColor: '#F5F5F5',
  },

  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  outOfStockBadge: {
    position: 'absolute',
    top: '10@vs',
    left: '10@s',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: '8@s',
    paddingVertical: '4@vs',
    borderRadius: '5@s',
  },

  outOfStockText: {
    color: '#FFF',
    fontSize: '10@ms',
    fontWeight: 'bold',
  },

  favoriteButton: {
    position: 'absolute',
    top: '10@vs',
    right: '10@s',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '8@s',
    borderRadius: '20@s',
  },

  productInfo: {
    padding: '12@s',
  },

  productName: {
    fontSize: '14@ms',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '4@vs',
  },

  productDescription: {
    fontSize: '11@ms',
    color: '#666',
    marginBottom: '8@vs',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8@vs',
  },

  ratingText: {
    color: '#000',
    fontSize: '12@ms',
    marginLeft: '4@s',
    fontWeight: '600',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceText: {
    fontSize: '16@ms',
    fontWeight: 'bold',
    color: '#1b6001',
  },

  addButton: {
    padding: '2@s',
  },
});