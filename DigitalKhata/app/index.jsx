import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
import { AppContext } from "../context/Appcontext";
import { hp, wp } from "../helper/responsive";

export default function Index() {

const {token}=useContext(AppContext)
const router=useRouter()


const handleClick=()=>{
if(token){
  router.replace('/home')
}else{
  router.push('/login')
}
}

  return (
    <View>
   <View style={{justifyContent:"center",alignItems:"center",borderRadius:12}}>
    <Image source={require('../pictures/digitalkhata.jpg')} style={{height:150,width:200,resizeMode:"cover", marginTop:wp(30)}}/>
   </View>

   <View style={{alignItems:"center",marginTop:wp(20)}}>
   <Animated.Text
  entering={FadeInLeft.delay(600).springify()}
  style={{ fontSize: wp(6), fontWeight: "800" }}
>
  Welcome To Your Digital Khaata
</Animated.Text>
   </View>

   <TouchableOpacity style={{justifyContent:"center",alignItems:"center",padding:wp(3),marginTop:hp(7)}}
   onPress={handleClick}
   >
    <Animated.Text entering={FadeInDown.delay(600).springify()} style={{backgroundColor:"black",color:"white",padding:hp(2),borderRadius:12,fontSize:wp(7)}}>Get Started</Animated.Text>
   </TouchableOpacity>
    </View>
  );
}

const styles=StyleSheet.create({

})