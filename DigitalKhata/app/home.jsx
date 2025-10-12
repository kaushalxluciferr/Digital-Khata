import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AppContext } from '../context/Appcontext';

const Home = () => {
  const { token } = useContext(AppContext);
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [viewMode, setViewMode] = useState('search'); // 'search', 'edit', 'add'
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState('');

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/getcustomer",
        { shopkeeperId: getShopkeeperIdFromToken() }, // You'll need to implement this
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCustomers(data.customers);
        setFilteredCustomers(data.customers);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch customers");
    }
  };

  // Get shopkeeper ID from token (you'll need to implement JWT decoding)
  const getShopkeeperIdFromToken = () => {
    // This is a placeholder - you'll need to decode the JWT token
    // to get the shopkeeper ID
    return "shopkeeper_id_here";
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomerName(customer.username);
    setViewMode('edit');
  };

  const handleUpdateCustomer = async () => {
    if (!newCustomerName.trim()) {
      Alert.alert("Error", "Customer name cannot be empty");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/updatecustomername",
        {
          _id: editingCustomer._id,
          username: newCustomerName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Alert.alert("Success", "Customer updated successfully");
        setViewMode('search');
        setEditingCustomer(null);
        setNewCustomerName('');
        fetchCustomers(); // Refresh the list
      } else {
        Alert.alert("Error", data.message || "Failed to update customer");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update customer");
    }
  };

  const handleAddCustomer = () => {
    setViewMode('add');
    setNewCustomerName('');
  };

  const handleSaveNewCustomer = async () => {
    if (!newCustomerName.trim()) {
      Alert.alert("Error", "Customer name cannot be empty");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/addcustomer",
        {
          shopkeeperId: getShopkeeperIdFromToken(),
          username: newCustomerName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Alert.alert("Success", "Customer added successfully");
        setViewMode('search');
        setNewCustomerName('');
        fetchCustomers(); // Refresh the list
      } else {
        Alert.alert("Error", data.message || "Failed to add customer");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add customer");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { data } = await axios.post(
                "https://digital-khata-snowy.vercel.app/api/shop/deletecustomer",
                { _id: customerId },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (data.success) {
                Alert.alert("Success", "Customer deleted successfully");
                fetchCustomers(); // Refresh the list
              } else {
                Alert.alert("Error", data.message || "Failed to delete customer");
              }
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Failed to delete customer");
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    setViewMode('search');
    setEditingCustomer(null);
    setNewCustomerName('');
  };

  const handleCustomerPress = (customer) => {
    // Navigate to customer items screen
    router.push({
      pathname: '/customer-items',
      params: { customerId: customer._id, customerName: customer.username }
    });
  };

  const renderSearchView = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search Customer name'
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEditView = () => (
    <View style={styles.editContainer}>
      <Text style={styles.editTitle}>Edit Customer</Text>
      <TextInput
        style={styles.editInput}
        placeholder="Enter customer name"
        value={newCustomerName}
        onChangeText={setNewCustomerName}
        placeholderTextColor="#999"
      />
      <View style={styles.editButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleUpdateCustomer}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddView = () => (
    <View style={styles.editContainer}>
      <Text style={styles.editTitle}>Add New Customer</Text>
      <TextInput
        style={styles.editInput}
        placeholder="Enter customer name"
        value={newCustomerName}
        onChangeText={setNewCustomerName}
        placeholderTextColor="#999"
      />
      <View style={styles.editButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSaveNewCustomer}>
          <Text style={styles.saveButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Dynamic Header Section */}
          {viewMode === 'search' && renderSearchView()}
          {viewMode === 'edit' && renderEditView()}
          {viewMode === 'add' && renderAddView()}

          {/* Customers List Section */}
          {viewMode === 'search' && (
            <View style={styles.customersSection}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'Search Results' : 'All Customers'}
              </Text>
              
              {filteredCustomers.length === 0 ? (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>
                    {searchQuery ? 'No customers found' : 'No customers available'}
                  </Text>
                </View>
              ) : (
                filteredCustomers.map((customer) => (
                  <TouchableOpacity 
                    key={customer._id} 
                    style={styles.customerCard}
                    onPress={() => handleCustomerPress(customer)}
                  >
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{customer.username}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEditCustomer(customer)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteCustomer(customer._id)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Plus Button - Only show in search mode */}
      {viewMode === 'search' && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleAddCustomer}>
          <Image 
            source={require('../pictures/plus.png')} 
            style={styles.plusIcon} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  editContainer: {
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
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  editInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  customersSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#666',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flex: 1,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 10,
  },
  plusIcon: {
    height: 60,
    width: 60,
  },
});