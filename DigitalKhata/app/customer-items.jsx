import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, FlatList } from 'react-native';
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
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [viewMode, setViewMode] = useState('list'); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemList, setItemList] = useState([{ name: '', quantity: '', price: '' }]);
  const [selectedDateRecord, setSelectedDateRecord] = useState(null);
  const [isEditingExistingDate, setIsEditingExistingDate] = useState(false);

  // Fetch items for the customer
  const fetchItems = async () => {
    try {
      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/getiteminfo",
        { customerId }
      );
      if (data.success) {
        // Sort items by date (newest first)
        const sortedItems = data.items.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(sortedItems);
        setFilteredItems(sortedItems);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch items");
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchItems();
    }
  }, [customerId]);

  useEffect(() => {
    if (searchDate.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        new Date(item.date).toISOString().split('T')[0].includes(searchDate)
      );
      setFilteredItems(filtered);
    }
  }, [searchDate, items]);

  const handleSearchByDate = () => {
    console.log('Searching for date:', searchDate);
  };

  const handleCreateItems = () => {
    setViewMode('create');
    setDate(new Date().toISOString().split('T')[0]);
    setItemList([{ name: '', quantity: '', price: '' }]);
    setIsEditingExistingDate(false);
  };

  const handleAddToExistingDate = (dateRecord) => {
    setViewMode('create');
    setDate(new Date(dateRecord.date).toISOString().split('T')[0]);
    setItemList([{ name: '', quantity: '', price: '' }]);
    setIsEditingExistingDate(true);
    setSelectedDateRecord(dateRecord);
  };

  const handleAddItemField = () => {
    setItemList([...itemList, { name: '', quantity: '', price: '' }]);
  };

  const handleRemoveItemField = (index) => {
    if (itemList.length > 1) {
      const newItemList = itemList.filter((_, i) => i !== index);
      setItemList(newItemList);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItemList = [...itemList];
    newItemList[index][field] = value;
    setItemList(newItemList);
  };

  const handleSaveItems = async () => {
    // Validate all fields
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      if (!item.name.trim() || !item.quantity || !item.price) {
        Alert.alert("Error", `Please fill all fields for item ${i + 1}`);
        return;
      }
      if (isNaN(item.quantity) || parseInt(item.quantity) <= 0) {
        Alert.alert("Error", `Please enter valid quantity for item ${i + 1}`);
        return;
      }
      if (isNaN(item.price) || parseFloat(item.price) < 0) {
        Alert.alert("Error", `Please enter valid price for item ${i + 1}`);
        return;
      }
    }

    try {
      const formattedItems = itemList.map(item => ({
        name: item.name.trim(),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      }));

      const { data } = await axios.post(
        "https://digital-khata-snowy.vercel.app/api/shop/addorupdate",
        {
          customerId,
          date,
          items: formattedItems
        }
      );

      if (data.success) {
        Alert.alert("Success", isEditingExistingDate ? "Items added to existing date successfully" : "Items added successfully");
        setViewMode('list');
        setItemList([{ name: '', quantity: '', price: '' }]);
        setIsEditingExistingDate(false);
        setSelectedDateRecord(null);
        fetchItems(); // Refresh the list
      } else {
        Alert.alert("Error", data.message || "Failed to add items");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add items");
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setItemList([{ name: '', quantity: '', price: '' }]);
    setIsEditingExistingDate(false);
    setSelectedDateRecord(null);
  };

  const handleDatePress = (dateRecord) => {
    setSelectedDateRecord(dateRecord);
    setViewMode('date-details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDateRecord(null);
  };

  const calculateDateTotal = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateGrandTotal = () => {
    return items.reduce((total, dateRecord) => {
      return total + calculateDateTotal(dateRecord.items);
    }, 0);
  };

  // Render individual date card for main list
  const renderDateCard = ({ item: dateRecord }) => (
    <TouchableOpacity 
      style={styles.dateCard}
      onPress={() => handleDatePress(dateRecord)}
    >
      <View style={styles.dateCardContent}>
        <Text style={styles.dateCardTitle}>
          {new Date(dateRecord.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <View style={styles.dateCardDetails}>
          <Text style={styles.itemsCount}>
            {dateRecord.items.length} item{dateRecord.items.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.dateCardTotal}>
            ₹{calculateDateTotal(dateRecord.items).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render date details view
  const renderDateDetails = () => (
    <View style={styles.dateDetailsContainer}>
      <View style={styles.dateDetailsHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.dateDetailsTitle} numberOfLines={1}>
          {new Date(selectedDateRecord.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.dateTotalContainer}>
        <Text style={styles.dateTotalText}>
          Total: ₹{calculateDateTotal(selectedDateRecord.items).toFixed(2)}
        </Text>
      </View>

      {/* Add Items Button in Date Details */}
      <TouchableOpacity 
        style={styles.addItemsButton}
        onPress={() => handleAddToExistingDate(selectedDateRecord)}
      >
        <Text style={styles.addItemsButtonText}>+ Add More Items to this Date</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedDateRecord.items}
        renderItem={({ item, index }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemTotal}>
                ₹{(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetail}>Price: ₹{item.price.toFixed(2)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.itemsListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderCreateView = () => (
    <View style={styles.createContainer}>
      <Text style={styles.createTitle}>
        {isEditingExistingDate ? 'Add Items to Existing Date' : 'Add Items'}
      </Text>
      
      <View style={styles.dateInputContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          editable={!isEditingExistingDate} // Don't allow editing date when adding to existing date
        />
        {isEditingExistingDate && (
          <Text style={styles.editingExistingDateText}>
            Adding to existing date
          </Text>
        )}
      </View>

      <FlatList
        data={itemList}
        renderItem={({ item, index }) => (
          <View style={styles.itemInputCard}>
            <View style={styles.itemInputHeader}>
              <Text style={styles.itemNumber}>Item {index + 1}</Text>
              {itemList.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItemField(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={item.name}
              onChangeText={(text) => handleItemChange(index, 'name', text)}
              placeholderTextColor="#999"
            />
            
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                value={item.quantity}
                onChangeText={(text) => handleItemChange(index, 'quantity', text)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Price"
                value={item.price}
                onChangeText={(text) => handleItemChange(index, 'price', text)}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.itemsList}
        showsVerticalScrollIndicator={false}
      />

     <View style={styles.createButtons}>
  <TouchableOpacity style={[styles.actionButton, styles.addItemButton]} onPress={handleAddItemField}>
    <Text style={styles.addItemButtonText}>Add More Items</Text>
  </TouchableOpacity>
  
  <View style={styles.formActions}>
    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSaveItems}>
      <Text style={styles.saveButtonText}>
        {isEditingExistingDate ? 'Add to Date' : 'Save Items'}
      </Text>
    </TouchableOpacity>
  </View>
</View>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      {/* Search by Date Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='(YYYY-MM-DD)'
          value={searchDate}
          onChangeText={setSearchDate}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchByDate}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Grand Total */}
      {items.length > 0 && (
        <View style={styles.grandTotalContainer}>
          <Text style={styles.grandTotalText}>
            Grand Total: ₹{calculateGrandTotal().toFixed(2)}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        {searchDate ? 'Search Results' : 'All Dates'}
      </Text>
    </>
  );

  const ListEmptyComponent = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>
        {searchDate ? 'No items found for this date' : 'No items available'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {viewMode !== 'date-details' && viewMode !== 'create' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{customerName}'s Khata</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      {/* Header for Create View */}
      {viewMode === 'create' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isEditingExistingDate ? 'Add Items' : 'Add Items'}
          </Text>
          <View style={styles.placeholder} />
        </View>
      )}

      {/* Main Content */}
      {viewMode === 'list' && (
        <FlatList
          data={filteredItems}
          renderItem={renderDateCard}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {viewMode === 'date-details' && renderDateDetails()}

      {viewMode === 'create' && (
        <View style={styles.createContent}>
          {renderCreateView()}
        </View>
      )}

      {/* Floating Create Button - Only show in list mode */}
      {viewMode === 'list' && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleCreateItems}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomerItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 60,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  createContent: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  grandTotalContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  grandTotalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  // Date Card Styles
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  dateCardDetails: {
    alignItems: 'flex-end',
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateCardTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  // Date Details Styles
  dateDetailsContainer: {
    flex: 1,
  },
  dateDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  dateTotalContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateTotalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addItemsButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addItemsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsListContent: {
    padding: 20,
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
  },
  createContainer: {
    flex: 1,
  },
  createTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  dateInputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editingExistingDateText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  itemsList: {
    flex: 1,
    marginBottom: 15,
  },
  itemInputCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
 createButtons: {
  gap: 10,
  marginTop: 10,
},
addItemButton: {
  backgroundColor: '#FFA500',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
},
addItemButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  textAlign: 'center',
},
formActions: {
  flexDirection: 'row',
  gap: 10,
},
actionButton: {
  flex: 1,
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
},
cancelButton: {
  backgroundColor: '#666',
},
saveButton: {
  backgroundColor: '#007AFF',
},
cancelButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  textAlign: 'center',
},
saveButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  textAlign: 'center',
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
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});