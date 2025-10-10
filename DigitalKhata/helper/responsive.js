 import {Dimensions } from 'react-native'
 const {height,width}=Dimensions.get("window")

 export const hp=(percemtage)=>{
    return (percemtage* height)/100
 }


 export const wp=(percemtage)=>{
    return (percemtage*width)/100
 }


 