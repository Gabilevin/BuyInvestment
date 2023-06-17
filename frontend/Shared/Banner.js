import React, {useState , useEffect} from "react";
import {Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from 'react-native-swiper/src';

var { width } = Dimensions.get("window")

const Banner = (props) => {
    const[bannerData, setBannerData] = useState([]);
    useEffect(() =>{
        setBannerData(props.ListImagesBanner
        )
        return() =>{
            setBannerData([]);
        }
    }, [])
    return(
        <ScrollView>
            <View style = {styles.container}>
                <View style = {styles.swiper}>
                    <Swiper
                    style = {{ height:width / 2 }}
                    showButtons={false}
                    autoplay={true}
                    autoplayTimeout = {30}
                    >
                    {bannerData.map((item) =>{
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
                    <View style = {{ height: 20 }}></View>
                </View>
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        
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
        marginHorizontal: 20
    }
})

export default Banner;