import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { AppContext } from '../context/Appcontext';

const CustomerItems = () => {
  const { token } = useContext(AppContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { customerId, customerName } = params;

  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const fetchItems = async () => {
    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/getitemofcustomer",
        { customerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [customerId]);

  const handleAddItem = async () => {
    if (!itemName.trim() || !quantity || !price) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/addorupdate",
        {
          customerId,
          date,
          items: [{
            name: itemName,
            quantity: parseInt(quantity),
            price: parseFloat(price)
          }]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Alert.alert("Success", "Item added successfully");
        setItemName('');
        setQuantity('');
        setPrice('');
        fetchItems(); // Refresh the list
      } else {
        Alert.alert("Error", data.message || "Failed to add item");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add item");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{customerName}'s Items</Text>
          
          {/* Add Item Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Item</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items List</Text>
            
            {items.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No items found</Text>
              </View>
            ) : (
              items.map((itemRecord) => (
                <View key={itemRecord._id} style={styles.dateSection}>
                  <Text style={styles.dateTitle}>
                    Date: {new Date(itemRecord.date).toLocaleDateString()}
                  </Text>
                  {itemRecord.items.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemDetail}>Qty: {item.quantity}</Text>
                        <Text style={styles.itemDetail}>Price: ${item.price}</Text>
                        <Text style={styles.itemTotal}>
                          Total: ${(item.quantity * item.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  itemsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});