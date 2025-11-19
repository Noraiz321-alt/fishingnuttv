import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : null
  );
  const [isFavorite, setIsFavorite] = useState(false);

  // Quantity logic
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Size-price mapping
  const getSizePrice = (size) => {
    const priceMap = {
      '1kg': '£4.49',
      '5kg': '£20.99',
      '10kg': '£39.99',
      '20kg': '£75.99',
    };
    return priceMap[size] || product.price;
  };

  // Selected size or default price
  const currentPrice = selectedSize ? getSizePrice(selectedSize) : product.price;

  // Convert string "£4.49" → 4.49
  const numericPrice = parseFloat(currentPrice.replace("£", ""));

  // Total price = price × quantity
  const totalPrice = (numericPrice * quantity).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? '#1b6001' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Animatable.View animation="fadeIn" style={styles.imageSection}>
          <Image source={product.image} style={styles.productImage} />

          {!product.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
        </Animatable.View>

        {/* Info Section */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.infoCard}>
          
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map((s)=>
              <Icon
                key={s}
                name={s <= Math.floor(product.rating) ? "star" : "star-outline"}
                size={18}
                color="#1b6001"
              />
            )}
            <Text style={styles.ratingText}> {product.rating}</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            100% natural multigrain mix with the ultimate cloud effect. 
            {'\n\n'}
            Float your feed into the stratosphere with ReeBic Cloud9 Groundbait —
            a slow-sinking milky cloud mix designed to draw fish from all levels.
          </Text>

          {/* Sizes */}
          {product.sizes && (
            <>
              <Text style={styles.sectionTitle}>Select Size</Text>

              <View style={styles.sizeContainer}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      selectedSize === size && styles.sizeChipActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextActive,
                      ]}
                    >
                      {size}
                    </Text>

                    <Text
                      style={[
                        styles.sizePriceText,
                        selectedSize === size && styles.sizePriceTextActive,
                      ]}
                    >
                      {getSizePrice(size)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Key Features */}
          <Text style={styles.sectionTitle}>Key Features</Text>

          <View style={styles.featuresList}>
            {[
              "100% Natural ingredients",
              "Ultra-light cloud effect",
              "Slow-sinking formula",
              "Suitable for all fish types",
            ].map((f, i)=>(
              <View key={i} style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#1b6001" />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Bottom Bar */}
      <Animatable.View animation="fadeInUp" style={styles.bottomBar}>

        {/* Quantity Buttons */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
            <Icon name="remove" size={20} color="#000" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
            <Icon name="add" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Total Price + Add to Cart */}
        <View style={styles.priceCartContainer}>
          
          <View>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceValue}>£{totalPrice}</Text>
          </View>

          <TouchableOpacity
            style={[styles.addToCartButton, !product.inStock && styles.disabledButton]}
            disabled={!product.inStock}
          >
            <Icon name="cart" size={22} color="#FFF" />
            <Text style={styles.addToCartText}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>

        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

/* ---------------------------- STYLES --------------------------- */

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '20@s',
    paddingVertical: '15@vs',
    backgroundColor: '#FFF',
  },

  backButton: { padding: '5@s' },

  headerTitle: { fontSize: '18@ms', fontWeight: 'bold', color: '#000' },

  favoriteButton: { padding: '5@s' },

  imageSection: { width, height: height * 0.4 },

  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  infoCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: '25@s',
    borderTopRightRadius: '25@s',
    padding: '20@s',
    marginTop: '-20@vs',
  },

  productName: { fontSize: '24@ms', fontWeight: 'bold', color: '#000' },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: '10@vs' },

  ratingText: { fontSize: '14@ms', color: '#000' },

  sectionTitle: {
    fontSize: '16@ms',
    fontWeight: 'bold',
    marginTop: '20@vs',
    marginBottom: '10@vs',
    color: '#000',
  },

  descriptionText: { fontSize: '13@ms', color: '#666', lineHeight: '20@vs' },

  sizeContainer: { flexDirection: 'row', flexWrap: 'wrap' },

  sizeChip: {
    backgroundColor: '#F5F5F5',
    padding: '12@s',
    marginRight: '10@s',
    marginBottom: '10@s',
    borderRadius: '10@s',
    borderWidth: 1,
    borderColor: '#DDD',
    minWidth: '70@s',
    alignItems: 'center',
  },

  sizeChipActive: { backgroundColor: '#1b6001', borderColor: '#1b6001' },

  sizeText: { color: '#000', fontSize: '14@ms', fontWeight: 'bold' },
  sizeTextActive: { color: '#FFF' },

  sizePriceText: { color: '#666', fontSize: '11@ms' },
  sizePriceTextActive: { color: '#FFF' },

  featuresList: { marginBottom: '20@vs' },

  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: '10@vs' },

  featureText: { marginLeft: '10@s', color: '#666', fontSize: '13@ms' },

  bottomBar: {
    backgroundColor: '#FFF',
    padding: '20@s',
    borderTopWidth: 1,
    borderColor: '#EEE',
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '10@vs',
  },

  quantityButton: {
    backgroundColor: '#EEE',
    padding: '10@s',
    borderRadius: '8@s',
  },

  quantityText: { fontSize: '18@ms', fontWeight: 'bold', marginHorizontal: '25@s' },

  priceCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: { fontSize: '12@ms', color: '#666' },

  priceValue: { fontSize: '24@ms', fontWeight: 'bold', color: '#1b6001' },

  addToCartButton: {
    backgroundColor: '#1b6001',
    paddingVertical: '12@vs',
    paddingHorizontal: '20@s',
    borderRadius: '12@s',
    flexDirection: 'row',
    alignItems: 'center',
  },

  disabledButton: { backgroundColor: '#AAA' },

  addToCartText: { color: '#FFF', fontSize: '15@ms', marginLeft: '10@s' },
});
