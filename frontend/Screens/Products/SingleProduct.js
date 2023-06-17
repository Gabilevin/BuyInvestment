import React, { useState, useEffect,useContext , useCallback ,useRef} from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Left, H1, Container, Right } from "native-base";
import Banner from "../../Shared/Banner";
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import Toast from "react-native-toast-message";
import BaseUrl from "../../assets/common/BaseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../Context/store/AuthGlobal";
import IconMore from "./IconMore";

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [ListImagesBanner, setListImagesBanner] = useState(
    props.route.params.item.ListImages
  );

  const [token, setToken] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [rating, setRating] = useState(0);
  const [provider_id, setProviderID] = useState();
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [review, setReview] = useState("");
  const [defaultRating, setdefaultRating] = useState(2);
  const [defaultRating2, setdefaultRating2] = useState(2);
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";

  const [showModal, setShowModal] = useState(false);
  const [selectedImageID, setSelectedImageID] = useState(null);
  const [updatedReviewText, setUpdatedReviewText] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [editing, setEditing] = useState(false);
  const [reviewFilter, setreviewFilter] = useState();
  const reviewTextInputRef = useRef(null);
  const [displayedReview, setDisplayedReview] = useState("");

  AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res);
    })
    .catch((error) => console.log(error));

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    setreviewFilter(item.review);

  }, []);


  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        console.log("");
      }
      else{
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

  
  const handleTextInputChange = (text) => {
    if (editing) {
      setReviewText(text);
    }
  };


  const totalRating = reviewFilter
    ? reviewFilter
        .filter(
          (review) =>
            review &&
            review.review_rate !== null &&
            review.review_rate !== undefined
        )
        .reduce((acc, curr) => {
          if (curr.review_rate) {
            return acc + curr.review_rate;
          }
          return acc;
        }, 0)
    : 0;
  const validReviews = reviewFilter
    ? reviewFilter.filter((review) => review && review.review_rate)
    : [];
  const reviewCount = validReviews.length;
  const averageRating = Math.round(totalRating / reviewCount);

  const handleSave = async (reviewText, item_rating2) => {
    setShowButtons(true);
    setEditing(false);

    const newReviewEdited = {
      review_rate: item_rating2,
      text: reviewText,
      user_email: userProfile.email,
      date: Date.now(),
    };

    const form2 = new FormData();
    form2.append("review_rate", item_rating2);
    form2.append("text", reviewText);
    form2.append("user_email", userProfile.email);
    form2.append("date", Date.now());
    form2.append("rating",)


    await axios
      .put(`${BaseUrl}products/${item.id}/review`, form2, config)
      .then((res22) => {
        setreviewFilter(res22.data.updatedProduct.review);
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Your review successfully updated",
          text2: "",
        });
        setTimeout(() => {
          console.log("In setTimeout"); 
        }, 500);
      })
      .catch((error) => {
        console.log("Failed to update review:", error);
      });

    setShowButtons(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setShowButtons(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setShowButtons(true);
    setUpdatedReviewText(review.text);

    setShowModal(false);
  };

  const handleDelete = (productId, userEmail) => {
    axios
      .delete(`${BaseUrl}products/${productId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_email: userEmail },
      })
      .then((res) => {
        const gabi = reviewFilter.filter(
          (gabi2) => gabi2.user_email !== userEmail
        );
        setreviewFilter(gabi);
      })
      .catch((error) => {
        console.log("Failed to delete review:", error);
      });
  };

  const toggleModal = (imageID) => {
    setSelectedImageID(imageID);
    setShowModal(!showModal);
  };
 
  

  const handleBlur = () => {
    setDisplayedReview(review);
  };

  const handleFocus = () => {
    setDisplayedReview('');
    
  };

  const handleEndEditing = (event) => {
    const { text } = event.nativeEvent;
    setReview(text); 
    setDisplayedReview(text);
  };

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarContainer}>
        <View style={styles.ratingContainer}>
          {maxRating.map((item_rating) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key_rating={item_rating}
                onPress={() => setdefaultRating(item_rating)}
              >
                <Image
                  style={styles.starImgStyleNewReview}
                  source={
                    item_rating <= defaultRating
                      ? { uri: starImgFilled }
                      : { uri: starImgCorner }
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <TextInput
          ref={reviewTextInputRef}
          style={styles.input}
          onEndEditing={handleEndEditing}
          onBlur={handleBlur} 
          onFocus={handleFocus}
          value={displayedReview ? displayedReview : undefined}
          placeholder="Write your review here"
          multiline={true}
          numberOfLines={8}
          maxLength={500}
        />

        <View style={styles.buttonContainer}>
          <Button title="Add Review" onPress={addReview} />
        </View>
      </View>
    );
  };

  const addReview = async () => {
    setBrand(props.route.params.item.brand);
    setName(props.route.params.item.name);
    setPrice(props.route.params.item.price.toString());
    setDescription(props.route.params.item.description);
    setMainImage(props.route.params.item.image);
    setImage(props.route.params.item.image);
    setCategory(props.route.params.item.category);
    setProviderID(props.route.params.item.provider_id)
    reviewTextInputRef.current.clear();

    const newReview = {
      review_rate: defaultRating,
      text: review,
      user_email: userProfile.email,
      date: Date.now(),
    };

    const existingReview = reviewFilter.find(
      (r) => r && r.user_email == userProfile.email
    );

    if (existingReview) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "You can't add more reviews",
        text2: "You can only edit your existing review.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category.id);
    formData.append("rating",rating);
    formData.append("provider_id", provider_id);
    formData.append("review", JSON.stringify(newReview));

    await axios
      .put(`${BaseUrl}products/${item.id}`, formData, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setreviewFilter(res.data.review);
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Your review successfully added",
            text2: "",
          });
          setTimeout(() => {
            console.log("In setTimeout"); 
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
        console.log("Error !!!!", error);
      });

    setReview("");
  };

  return (
    <Container style={styles.container}>
      <ScrollView style={{ marginBottom: 80 }}>
        <View>
          <Banner ListImagesBanner={ListImagesBanner} />
        </View>
        <View style={styles.contentContainer}>
          <H1 style={styles.contentHeader}> {item.name} </H1>
          <View style={styles.starContainer}>
            {maxRating.map((item_rating, key_rating) => {
              return (
                <Image
                  key={key_rating}
                  style={styles.starImgStyleNewReview}
                  source={
                    item_rating <= averageRating
                      ? { uri: starImgFilled }
                      : { uri: starImgCorner }
                  }
                />
              );
            })}
          </View>
          <Text style={styles.contentText}> {item.brand} </Text>
          <Text style={styles.contentText}> {item.description} </Text>
        </View>

        <View>
          <FlatList
            data={reviewFilter}
            renderItem={({ item: review }) => {
              if (
                review &&
                review.user_email !== null &&
                review.user_email !== undefined
              ) {
                return (
                  <View style={styles.reviewContainer}>
                    {review.review_rate && review.review_rate > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        {context.stateUser.userProfile &&
                        context.stateUser.userProfile.email ==
                          review.user_email ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              flex: 1,
                              marginBottom: -15,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => toggleModal(selectedImageID)}
                            >
                              <Image
                                source={require("./moreIcon.png")}
                                style={{ width: 20, height: 15 }}
                              />
                            </TouchableOpacity>
                            <IconMore
                              linkinpark={item}
                              showModal={showModal}
                              toggleModal={toggleModal}
                              imageID={
                                review && review.user_email
                                  ? review.user_email
                                  : "default_image_id"
                              }
                              deleteReview={handleDelete}
                              editReview={handleEdit}
                              product_id={item._id}
                            />
                          </View>
                        ) : null}
                      </View>
                    ) : null}

                    <View style={{ marginTop: 2 }}>
                      {editing &&
                      context.stateUser.userProfile &&
                      context.stateUser.userProfile.email ===
                        review.user_email ? (
                        <View style={[styles.starContainer]}>
                          {maxRating.map((item_rating2, key_rating) => {
                            const ratingValue = item_rating2;
                            return (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                key_rating={item_rating2}
                                onPress={() => setdefaultRating2(item_rating2)}
                              >
                                <Image
                                  style={styles.starImgStyleNewReview}
                                  source={
                                    item_rating2 <= defaultRating2
                                      ? { uri: starImgFilled }
                                      : { uri: starImgCorner }
                                  }
                                />
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      ) : (
                        <View style={styles.starContainer}>
                          {maxRating.map((item_rating, key_rating) => {
                            return (
                              <Image
                                key={key_rating}
                                style={styles.starImgStyle}
                                source={
                                  item_rating <= review.review_rate
                                    ? { uri: starImgFilled }
                                    : { uri: starImgCorner }
                                }
                              />
                            );
                          })}
                        </View>
                      )}

                      {editing &&
                      context.stateUser.userProfile &&
                      context.stateUser.userProfile.email ===
                        review.user_email ? (
                        <TextInput
                          value={reviewText}
                          onChangeText={handleTextInputChange}
                          placeholder={review && review.text ? review.text : ""}
                          style={styles.textInputStyle}
                          multiline={true}
                          numberOfLines={4}
                        />
                      ) : (
                        <Text style={styles.textStyle}>
                          {review && review.text ? review.text : ""}
                        </Text>
                      )}
                      <View>
                        {showButtons && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              marginTop: -20,
                            }}
                          >
                            {context.stateUser.userProfile &&
                              context.stateUser.userProfile.email ===
                                review.user_email && (
                                <>
                                  <View
                                    style={{
                                      borderRadius: 20,
                                      overflow: "hidden",
                                      marginRight: 5,
                                    }}
                                  >
                                    <Button
                                      title="Save"
                                      onPress={() =>
                                        handleSave(reviewText, defaultRating2)
                                      }
                                      buttonStyle={{ backgroundColor: "red" }} // customize button style as needed
                                    />
                                  </View>
                                  <View
                                    style={{
                                      borderRadius: 40,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <Button
                                      title="Cancel"
                                      onPress={handleCancel}
                                      buttonStyle={{ backgroundColor: "green" }} 
                                    />
                                  </View>
                                </>
                              )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              } else {
                return null; 
              }
            }}
            keyExtractor={(review) =>
              review?.user_email ? review.user_email : "default_key"
            }
            ListEmptyComponent={<Text>No reviews found.</Text>} 
          />
        </View>

        {context.stateUser.isAuthenticated ? (
          <View style={styles.container}>
            <CustomRatingBar />
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Left>
          <Text style={styles.price}> ${item.price} </Text>
        </Left>
        <Right>
          <Button
            title="Add to cart"
            style={{ borderRadius: 7 }}
            onPress={() => {
              props.addItemToCart(item),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${item.name} added to Cart`,
                  text2: "Go to your cart to complete order",
                });
            }}
          />
        </Right>
      </View>
    </Container>
  );
};

const mapToDispatchToProps = (dispatch) => {
  return {
      addItemToCart: (product) => 
          dispatch(actions.addToCart({quantity: 1, product}))
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: " white",
    padding: 0,
    margin: 0,
  },
  image: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
  },
  price: {
    fontSize: 20,
    margin: 20,
    color: "red",
  },
  image: {
    width: "100%",
    height: 270,
  },
  starImgStyle: {
    width: 8,
    height: 10,
    resizeMode: "cover",
  },
  starImgStyleNewReview: {
    width: 15,
    height: 20,
    resizeMode: "cover",
  },
  customRatingBarContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "80%",
  },
  reviewsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingBottom: 10,
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewStar: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  reviewText: {
    fontSize: 16,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  moreIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  moreIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

});

export default connect(null, mapToDispatchToProps)(SingleProduct);
