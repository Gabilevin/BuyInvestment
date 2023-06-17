import React, { useState, useRef, useCallback, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BaseUrl from "../../assets/common/BaseUrl";
import emailjs from "@emailjs/browser";

const SuggestionForProduct = () => {
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();

  const [productName, setProductName] = useState("");
  const [productCost, setProductCost] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const addUrl = () => {
    if (urlInput.trim() !== "") {
      setUrls([...urls, urlInput.trim()]);
      setUrlInput("");
    }
  };


  const fetchReviews = async () => {
    try {
      const response = await fetch('https://your-api-url.com/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleFormSubmit = async () => {
    const emailServiceId = "service_rfkok78"; 
    const emailTemplateId = "template_8ep0064"; 
    const emailPublicKey = "LurI94Ica1cbEjLjy"; 

    const templateParams = {
      from_name: userProfile.email,
      user_id: userProfile._id,
      user_name: userProfile.name,
      user_phone: userProfile.phone,
      product_name: productName,
      product_cost: productCost,
      product_description: productDescription,
      images: urls.join("\n"),
      to_name: "BuyInvestment Admin",
    };

    await emailjs
      .send(emailServiceId, emailTemplateId, templateParams, emailPublicKey)
      .then(
        (result) => {
          console.log(result.text);
          navigation.navigate("Investment");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const inputRef = useRef(null);

  const handleContentSizeChange = (event) => {
    const { contentSize } = event.nativeEvent;
    const currentHeight = inputRef.current.height;
    const newHeight = contentSize.height + 20; 
    if (newHeight > currentHeight) {
      inputRef.current.setNativeProps({ height: newHeight });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        console.log("");
      } else {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${BaseUrl}users/${context.stateUser.user.userId}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((user) => setUserProfile(user.data));
          })
          .catch((error) => console.log(error));
      }
      return () => {
        setUserProfile();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <Container>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fill in the details of your product:</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.formHeaderText}>Suggest a product</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={productName}
            onChangeText={(text) => setProductName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Cost"
            value={productCost}
            onChangeText={(text) => setProductCost(text)}
          />
          <TextInput 
            ref={inputRef}
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description of the Product"
            value={productDescription}
            onChangeText={(productDescription) =>
              setProductDescription(productDescription)
            }
            onContentSizeChange={handleContentSizeChange}
            multiline
          />

          {urls.map((url, index) => (
            <TextInput
              key={index}
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                marginVertical: 10,
                paddingHorizontal: 10,
              }}
              value={url}
              editable={false}
            />
          ))}

          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
            placeholder="Enter a URL"
            value={urlInput}
            onChangeText={setUrlInput}
          />
          <TouchableOpacity style={styles.button} onPress={addUrl}>
            <Text style={styles.buttonText}>Add URL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  formHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SuggestionForProduct;
