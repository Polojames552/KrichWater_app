import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

export default function ProductDetails({route}: any) {
  const {
    price,
    total_price,
    total_quantity,
    image,
    description,
    productId,
    details,
    path,
  } = route.params || {};
  const item_price = price;
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(price);
  const userData = JSON.parse(details.userData);

  useEffect(() => {
    resetCurrentPrice();
    console.log('Screen Refreshed:');
  }, [price, 1]);

  const resetCurrentPrice = () => {
    console.log('Screen focused!');
    setCurrentPrice(total_price || price);
    setQuantity(total_quantity || 1);
  }; //this function is declared to refresh value of Price and quantity when adding order to cart
  // console.log('PD:Route-From: ', currentPrice);
  // console.log('Total-Quantity: ', quantity);
  const handleAddToCart = () => {
    const InsertAPIURL =
      'https://underdressed-legisl.000webhostapp.com/Add/AddToCartWater.php';
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const Data = {
      User_id: userData.id,
      Product_id: productId,
      Quantity: quantity,
      Price: item_price,
      Total_Price: currentPrice,
      Description: description,
      Image: image,
    };
    console.log(Data);
    fetch(InsertAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(Data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(response => {
        Alert.alert('Attention', response[0].Message);
        resetCurrentPrice();
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
        console.log('Response status:', error.response.status);
        console.log('Response text:', error.response.text());
        Alert.alert('Attention', `Network error: ${error.message}`);
      });
    console.log(
      `Added ${quantity} ${description} to cart with price ₱${parseInt(
        currentPrice,
      ).toFixed(2)}`,
    );
  };

  const handleEditCart = () => {};
  return (
    <View style={styles.container}>
      {price && description && quantity ? (
        <View>
          <View style={styles.productInfo}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    'https://underdressed-legisl.000webhostapp.com/products/' +
                    image,
                }}
                style={styles.image}
              />
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.description}>
              Price: ₱{parseInt(price).toFixed(2)}
            </Text>
            <Text style={styles.productId}>
              Total: ₱{parseInt(currentPrice).toFixed(2)}
            </Text>
          </View>

          <View style={styles.quantityControlContainer}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() => {
                  setQuantity(quantity - 1);
                  const totalPrice = parseInt(currentPrice) - parseInt(price);
                  setCurrentPrice(totalPrice); // Halve the price
                }}
                disabled={quantity <= 1}>
                <Text style={styles.controlButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  setQuantity(quantity + 1);
                  const totalPrice = parseInt(currentPrice) + parseInt(price);
                  setCurrentPrice(totalPrice);
                }}>
                <Text style={styles.controlButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {path === 'Home' ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}>
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{...styles.addToCartButton, backgroundColor: '#FF0000'}}
              onPress={handleEditCart}>
              <Text style={styles.addToCartButtonText}>Edit to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.errorMessage}>Select a product first</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productInfo: {
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 10,
    borderColor: '#70A5CD',
    borderRadius: 15,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 6, // Image border radius (to match the container)
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productId: {
    fontSize: 16,
    color: '#555',
  },
  quantityControlContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: '#555',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: '#70A5CD',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorMessage: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
