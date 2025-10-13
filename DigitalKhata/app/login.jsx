import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { hp, wp } from '../helper/responsive';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { AppContext } from '../context/Appcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const { token, settoken } = useContext(AppContext)
  const router = useRouter()
  const [email, setemail] = useState('')
  const [pass, setpass] = useState("")

  const handlesignin = () => {
    router.push('/signup')
  }

  const handleLogin = async () => {
    if (!email || !pass) {
      Alert.alert("Some field is missing")
      return;
    }
    try {
      const { data } = await axios.post("https://digital-khata-snowy.vercel.app/api/shop/signin", { email, password: pass })
      if (data.success) {
        const token = data.token
        await AsyncStorage.setItem("token", token)
        settoken(token)
        Alert.alert("Signup Successfull", "Welcome on Digital Khata")
        router.replace('/home')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Login Page</Text>
          <Image
            source={require('../pictures/candle.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.inputSection}>
          <View>
            <Text style={styles.label}>Enter Your Email Address</Text>
            <TextInput
              placeholder="Enter your email here"
              style={styles.input}
              onChangeText={setemail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          <View>
            <Text style={styles.label}>Enter Your Password</Text>
            <TextInput
              placeholder="Enter your password here"
              style={styles.input}
              onChangeText={setpass}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don’t have an account? <Text style={styles.signupText} onPress={handlesignin}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  innerContainer: {
    backgroundColor: '#2c5364',
    borderRadius: wp(4),
    paddingVertical: hp(4),
    paddingHorizontal: wp(6),
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: '700',
    color: '#fff',
  },
  logo: {
    height: hp(6),
    width: hp(6),
    resizeMode: 'cover',
  },
  inputSection: {
    gap: hp(2.2),
    marginTop: wp(2),
    marginBottom: hp(3),
  },
  label: {
    color: '#fff',
    fontSize: hp(1.9),
    marginBottom: hp(0.6),
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    fontSize: hp(2),
  },
  button: {
    backgroundColor: '#0f9b0f',
    borderRadius: wp(2.5),
    paddingVertical: hp(1.8),
    marginTop: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(2.2),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: hp(2.5),
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: hp(1.8),
  },
  signupText: {
    color: '#0f9b0f',
    fontWeight: '600',
  },
});
