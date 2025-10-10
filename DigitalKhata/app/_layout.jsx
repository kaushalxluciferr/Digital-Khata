import { Slot } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppContextProvider from "../context/Appcontext";

export default function RootLayout() {
  return   (
    <SafeAreaView style={styles.container}>
      <AppContextProvider>
      <Slot/>
      </AppContextProvider>
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    padding:4,
    // marginTop:Platform.OS==='android'?StatusBar.currentHeight:0,

  }
})