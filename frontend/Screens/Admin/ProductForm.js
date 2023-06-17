import React, { useState, useEffect } from "react"
import { 
    View, 
    Image,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,  
    Button
} from "react-native"
import { Item, Picker } from "native-base"
import Error from "../../Shared/Error"
import Icon from "react-native-vector-icons/FontAwesome"
import FormContainer from "../../Shared/FormContainer"
import Input from "../../Shared/Input"
import Toast from "react-native-toast-message"
import BaseUrl from "../../assets/common/BaseUrl"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import mime from "mime";

const ProductForm = (props) => {
    
    const [pickerValue, setPickerValue] = useState();
    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [brand, setBrand] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [categories, setCategories] = useState([]);
    const [err, setError] = useState();
    const [mainImage, setMainImage] = useState();
    const [category, setCategory] = useState();
    const [item, setItem] = useState(null);
    const [token, setToken] = useState();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [provider_id, setProviderID] = useState();


    useEffect(() => {

        if(!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setName(props.route.params.item.name);
            setBrand(props.route.params.item.brand);
            setMainImage(props.route.params.item.image);
            setPrice(props.route.params.item.price.toString());
            setCategory(props.route.params.item.category._id);
            setDescription(props.route.params.item.description);
            setImage(props.route.params.item.image);
            setProviderID(props.route.params.item.provider_id);
            setReview(props.route.params.item.review);
        }


        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))

        axios
            .get(`${BaseUrl}categories`)
            .then((res) => setCategories(res.data))
            .catch((error) => alert("Category error"));
        
        (async () => {
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    alert("Error")
                }
            }
        })();

        return () => {
            setCategories([])
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const addProduct = () => {
        if (
            name == "" ||
            brand == "" ||
            price == "" ||
            description == "" ||
            category == ""
        ) {
            setError("Please fill in the form correctly")
        }

        let formData = new FormData();

        formData.append("provider_id", provider_id);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("brand", brand);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("rating", rating);
        formData.append("reviews", review);
        

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
        

        if(item !== null) {      
            formData.append("image", image);
            axios
            .put(`${BaseUrl}products/${item.id}`, formData, config)
            .then((res) => {
                if(res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "The Product is updated",
                        text2: ""
                    });
                    setTimeout(() => {
                        props.navigation.navigate("Products");
                    }, 500)
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                        type: "Error",
                        text1: "Error",
                        text2: "Please try again"
                })
            })
        } else {
            const newImageUri = "file:///" + image.split("file:/").join("");
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop()
            });
            axios
            .post(`${BaseUrl}products`, formData, config)
            .then((res) => {
                if(res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "New Product added",
                        text2: ""
                    });;
                    setTimeout(() => {
                        props.navigation.navigate("Products");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again"
                })
            })
        } 
    }

    return (
       <FormContainer title="Add Product">
           <View style={styles.imageContainer}>
               <Image style={styles.image} source={{uri: mainImage}}/>
               <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                   <Icon style={{ color: "white"}} name="camera"/>
               </TouchableOpacity>
           </View>

           <View style={styles.label}>
               <Text style={{ textDecorationLine: "underline"}}>Providers ID</Text>
           </View>

           <Input 
            placeholder="Provider ID"
            name="Provider ID"
            id="Provider ID"
            value={provider_id}
            onChangeText={(text) => setProviderID(text)}
           />

           <View style={styles.label}>
               <Text style={{ textDecorationLine: "underline"}}>Brand</Text>
           </View>
           <Input 
            placeholder="Brand"
            name="brand"
            id="brand"
            value={brand}
            onChangeText={(text) => setBrand(text)}
           />
           <View style={styles.label}>
               <Text style={{ textDecorationLine: "underline"}}>Name</Text>
           </View>
           <Input 
            placeholder="Name"
            name="name"
            id="name"
            value={name}
            onChangeText={(text) => setName(text)}
           />
            <View style={styles.label}>
               <Text style={{ textDecorationLine: "underline"}}>Price</Text>
           </View>
           <Input 
            placeholder="Price"
            name="price"
            id="price"
            value={price}
            keyboardType={"numeric"}
            onChangeText={(text) => setPrice(text)}
           />
            <View style={styles.label}>
               <Text style={{ textDecorationLine: "underline"}}>Description</Text>
           </View>
           <Input 
            placeholder="Description"
            name="description"
            id="description"
            value={description}
            onChangeText={(text) => setDescription(text)}
           />
           <View style = {{width:205, padding:10}}>

                <Item picker>
                <View style={{
            borderColor: 'transparent', 
            justifyContent:"center", 
            alignSelf:"center",
            width: "80%",
            marginTop: 6
            }}>
          <Picker
            mode="dropdown"
            iosIcon={<Icon color={"#007aff"} name="arrow-down" />}
            style={{ justifyContent: "center",
                    alignSelf: "center",
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: 20,
                    borderRadius: 40,
                    width: "80%",
                    marginBottom: 15,
                    backgroundColor: "rgba(102,102,102,0.6)" }}
            placeholder="Select your Category"
            selectedValue={pickerValue}
            placeholderStyle={{ color: "#007aff" }}
            placeholderIconColor= "#007aff"
            onValueChange={itemValue => 
                [setPickerValue(itemValue), setCategory(itemValue)]}
          >
            {categories.map((c) => {
              return <Picker.Item key={c._id} label={c.name} value={c._id} />;
            })}
          </Picker>
        </View>
                </Item>


           </View>
           {err ? <Error message={err} /> : null}
           <View style={styles.buttonContainer}>
               <Button
                title = "Confirm"
                onPress={() => addProduct()}               
               />
           </View>
       </FormContainer>
    )
}

const styles = StyleSheet.create({
    label: {
        width: "80%",
        marginTop: 10
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 5,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20
    }
})

export default ProductForm;