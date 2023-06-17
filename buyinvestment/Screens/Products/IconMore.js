import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";

const IconMore = ({ linkinpark, showModal, toggleModal, imageID, deleteReview, editReview,product_id}) => {

  return (
    <View>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}
          >
            <TouchableOpacity onPress={() => toggleModal(imageID)}>
              <Image
                source={require("./close.png")}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: "flex-end",
                  marginBottom: 10,
                }}
              />
              <Text>
                {linkinpark.review._id}
              </Text>
            </TouchableOpacity>
            <Text>Modal Content Here</Text>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "blue",
                borderRadius: 5,
                padding: 10,
              }}
              onPress={() => {
                editReview();
                toggleModal(imageID);
              }}
            >
              <Text style={{ color: "#fff" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "green",
                borderRadius: 5,
                padding: 10,
              }}
              onPress={() => {
                deleteReview(product_id, imageID);
                toggleModal(imageID);
              }}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IconMore;
