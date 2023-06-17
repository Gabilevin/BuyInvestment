import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseUrl from "../../assets/common/BaseUrl";
import {View,Text,FlatList,TextInput,StyleSheet,TouchableOpacity,} from "react-native";
import axios from "axios";


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [Newcategory, setNewCategory] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${BaseUrl}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error loading categories"));

    return () => {
      setCategories([]);
      setToken("");
    };
  }, []);

  const addCategory = () => {
    const category = {
      name: Newcategory,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${BaseUrl}categories`, category, config)
      .then((res) => setCategories([...categories, res.data]))
      .catch((error) => alert("Error adding category"));

    setNewCategory("");
  };

  const deleteCategory = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .delete(`${BaseUrl}categories/${id}`, config)
      .then((res) => {
        const newCategories = categories.filter((item) => item.id !== id);
        setCategories(newCategories);
      })
      .catch((error) => alert("Error deleting category"));
  };

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryTitle}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteCategory(item._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Category</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={Newcategory}
            style={{
              flex: 1,
              height: 40,
              borderColor: "#CCCCCC",
              borderWidth: 1,
              borderRadius: 5,
              marginRight: 10,
              paddingHorizontal: 10,
            }}
            onChangeText={(text) => setNewCategory(text)}
            placeholder="Category name"
            placeholderTextColor="#CCCCCC"
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#3CB371",
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
            onPress={() => addCategory()}
          >
            <Text style={{ color: "#FFFFFF" }}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingVertical: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Categories;