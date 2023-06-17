import React from "react";
import {Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from 'react-native-swiper/src';

var { width } = Dimensions.get("window")
const images = ["https://www.trustedreviews.com/wp-content/uploads/sites/54/2021/12/19BR_BattlePass-920x518.jpg",
                "https://www.techcenturion.com/wp-content/uploads/2019/02/All-Fortnite-Skins.jpg",
                "https://cdn.xsd.cz/resize/594a75b6948a3d4580b3586579d0c551_resize=680,383_.jpg?hash=7e5f0592e50270326a13f7223165a8d4"
            ];


const HomePageBanner = () => {
    return(
        <ScrollView>
            <View style = {styles.container}>
                <View style = {styles.swiper}>
                    <Swiper
                    style = {{ height:width / 2 }}
                    showButtons={false}
                    autoplay={true}
                    autoplayTimeout = {10}
                    >
                    {images.map((item) =>{
                        return(
                            <Image 
                                key = {item}
                                style = {styles.imageBanner}
                                resizeMode = "contain"
                                source = {{uri: item}}
                            />
                        )

                    })}
                    </Swiper>
                </View>
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    swiper:{
        width: width,
        alignItems :'center',
        marginTop: 30
    },
    imageBanner: {
        height: width / 2,
        width: width - 40,
        borderRadius: 10,
        marginHorizontal: 20,
        
    }
})

export default HomePageBanner;