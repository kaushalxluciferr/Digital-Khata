import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { hp, wp } from '../helper/responsive';
import { useRouter } from 'expo-router';

const Signup = () => {
  const router = useRouter();
  const [email,setemail]=useState('')
  const [pass,setpass]=useState('')
  const [cnfpass,setcnfpass]=useState('')


  const handleSignup = () => {
    if(pass.length<8){
        Alert.alert("password should be 8 lettter")
        return ;
    }
    if(pass!==cnfpass){
        Alert.alert("Password not matched")
        return ;
    }
  }

  const handleLoginRedirect = () => {
    router.push('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Image
            source={require('../pictures/candle.png')}
            style={styles.logo}
          />
        </View>

        {/* Input Section */}
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
            <View>
            <Text style={styles.label}>Confirm Your Password</Text>
            <TextInput
              placeholder="Enter your password here"
              style={styles.input}
              secureTextEntry
              onChangeText={setcnfpass}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.loginText} onPress={handleLoginRedirect}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Signup;

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
  loginText: {
    color: '#0f9b0f',
    fontWeight: '600',
  },
});
