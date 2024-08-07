'use client'
import { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { firestore } from '../firebase'; // Import firestore from your firebase.js file
import './styles.css';

const initialItems = [];

export default function Home() {
  useEffect(() => {
    const fetchItems = async () => {
      const pantryQuery = collection(firestore, 'Pantry');
      const pantryDocs = await getDocs(pantryQuery);
      const pantryItems = [];
      pantryDocs.forEach((doc) => {
        pantryItems.push({ id: doc.id, ...doc.data() });
      });
      setPantryItems(pantryItems);

      const groceryQuery = collection(firestore, 'Grocery');
      const groceryDocs = await getDocs(groceryQuery);
      const groceryItems = [];
      groceryDocs.forEach((doc) => {
        groceryItems.push({ id: doc.id, ...doc.data() });
      });
      setGroceryItems(groceryItems);
    };
    fetchItems();
  }, []);

  const [groceryItems, setGroceryItems] = useState(initialItems);
  const [pantryItems, setPantryItems] = useState(initialItems);
  const [newGroceryItem, setNewGroceryItem] = useState('');
  const [newGroceryQuantity, setNewGroceryQuantity] = useState(1);
  const [newPantryItem, setNewPantryItem] = useState('');
  const [newPantryQuantity, setNewPantryQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const transferItem = async (id) => {
    const itemToTransfer = groceryItems.find(item => item.id === id);
    if (itemToTransfer) {
      const newItemData = { name: itemToTransfer.name, quantity: itemToTransfer.quantity };
      const docRef = await addDoc(collection(firestore, 'Pantry'), newItemData);
      setPantryItems([...pantryItems, { id: docRef.id, ...newItemData }]);
      await removeItem(setGroceryItems, groceryItems, id, 'Grocery');
    }
  };

  const addItem = async (setItems, items, collectionName, newItem, newQuantity, setNewItem, setNewQuantity) => {
    if (newItem && newQuantity > 0) {
      const newItemData = { name: newItem, quantity: newQuantity };
      const docRef = await addDoc(collection(firestore, collectionName), newItemData);
      setItems([...items, { id: docRef.id, ...newItemData }]);
      setNewItem('');
      setNewQuantity(1);
    }
  };

  const removeItem = async (setItems, items, id, collectionName) => {
    await deleteDoc(doc(firestore, collectionName, id));
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = async (setItems, items, id, quantity, collectionName) => {
    const itemRef = doc(firestore, collectionName, id);
    await updateDoc(itemRef, { quantity });
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const filteredGroceryItems = groceryItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPantryItems = pantryItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ backgroundImage: `url(/kyle.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Stack
        width="800px"
        height="auto"
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={4}
        overflow={'auto'}
        bgcolor={'rgba(255, 255, 255, 0.8)'}
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h4" color="primary" mb={2}>
          Grocery List
        </Typography>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Stack direction={'row'} spacing={2} mb={4}>
          <TextField
            label="Item"
            value={newGroceryItem}
            onChange={(e) => setNewGroceryItem(e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            value={newGroceryQuantity}
            onChange={(e) => setNewGroceryQuantity(Number(e.target.value))}
          />
          <Button variant="contained" color="primary" onClick={() => addItem(setGroceryItems, groceryItems, 'Grocery', newGroceryItem, newGroceryQuantity, setNewGroceryItem, setNewGroceryQuantity)}>
            Add Item
          </Button>
        </Stack>
        {filteredGroceryItems.map((item) => (
          <Box
            key={item.id}
            width="100%"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={"#e0f7fa"}
            p={2}
            mb={1}
            borderRadius={1}
          >
            <Typography
              variant={'h6'}
              color={"#00796b"}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              {item.name.toUpperCase()}
            </Typography>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Button variant="outlined" color="secondary" onClick={() => updateQuantity(setGroceryItems, groceryItems, item.id, item.quantity - 1, 'Grocery')}>-</Button>
              <Typography variant={'h6'}>{item.quantity}</Typography>
              <Button variant="outlined" color="secondary" onClick={() => updateQuantity(setGroceryItems, groceryItems, item.id, item.quantity + 1, 'Grocery')}>+</Button>
              <Button variant="contained" color="secondary" onClick={() => removeItem(setGroceryItems, groceryItems, item.id, 'Grocery')}>Remove</Button>
              <Button variant="contained" color="primary" onClick={() => transferItem(item.id)}>Transfer to Pantry</Button>
            </Stack>
          </Box>
        ))}
        <Typography variant="h4" color="primary" mt={4} mb={2}>
          Your Food Pantry
        </Typography>
        <Stack direction={'row'} spacing={2} mb={4}>
          <TextField
            label="Item"
            value={newPantryItem}
            onChange={(e) => setNewPantryItem(e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            value={newPantryQuantity}
            onChange={(e) => setNewPantryQuantity(Number(e.target.value))}
          />
          <Button variant="contained" color="primary" onClick={() => addItem(setPantryItems, pantryItems, 'Pantry', newPantryItem, newPantryQuantity, setNewPantryItem, setNewPantryQuantity)}>
            Add Item
          </Button>
        </Stack>
        {filteredPantryItems.map((item) => (
          <Box
            key={item.id}
            width="100%"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={"#ffe0b2"}
            p={2}
            mb={1}
            borderRadius={1}
          >
            <Typography
              variant={'h6'}
              color={"#d84315"}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              {item.name.toUpperCase()}
            </Typography>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Button variant="outlined" color="secondary" onClick={() => updateQuantity(setPantryItems, pantryItems, item.id, item.quantity - 1, 'Pantry')}>-</Button>
              <Typography variant={'h6'}>{item.quantity}</Typography>
              <Button variant="outlined" color="secondary" onClick={() => updateQuantity(setPantryItems, pantryItems, item.id, item.quantity + 1, 'Pantry')}>+</Button>
              <Button variant="contained" color="secondary" onClick={() => removeItem(setPantryItems, pantryItems, item.id, 'Pantry')}>Remove</Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
