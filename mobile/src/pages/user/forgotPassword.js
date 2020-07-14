import React, { useState } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard,
} from 'react-native';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';

import logo from '../../icons/logo3.png';

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState(null);

  const navigation = useNavigation();

  //Send token to mail to reset password
  forgotPassword = async () => {
    try {
      await api.post('/users/forgot_password', {
        email: email.trim().toLowerCase(),
      });

      Keyboard.dismiss();
      Alert.alert('','Token enviado para e-mail', [{
        text: 'OK',
        onPress: () => navigation.navigate('ResetPassword', email),
      }]);
      
    } catch (response) {
      console.log(response);
      setErrorMessage(response.data.error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image 
          style={styles.logo} 
          source={logo}
        />
      </View>
      
      <View style={styles.containerHeader}>
        <Text style={styles.textHeader}>
          Digite aqui o e-mail da conta que deseja recuperar a senha.
        </Text>
      </View>
      
      <View style={styles.containerTextInput}>
        <TextField 
          label="Email"
          value={email}
          onChangeText={setEmail}
          onChange={() => setEmail('')}
          labelFontSize={14}
          fontSize={14}
          tintColor="#0832a3"
          style={styles.input}
          error={email === '' ? 'Digite seu email' : ''}
          />
        <Icon 
          name="envelope" 
          size={18}
          color="#777777"
          style={{
            position: 'absolute',
            top: 54,
            right: 0,
            marginRight: 5,
          }}
        />
      </View>

      <TouchableOpacity 
        onPress={() => forgotPassword()}
        style={styles.forgotPasswordButton}
      >
        <Text style={styles.textForgotPassword}>
          ENVIAR
        </Text>
      </TouchableOpacity>
      {!!errorMessage && <Text style = {styles.textError}>{ errorMessage }</Text>}
    
      <Text style={styles.textInfo}>
        JÁ POSSUI CONTA?
      </Text> 

      <TouchableOpacity 
        style={styles.existingUserButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.textExistingUser}>
          FAZER LOGIN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#FFF',
  },
  containerLogo: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  logo: {
    width: '90%',
    height: 100,
  },
  containerHeader: {
    width: '90%',
    marginTop: '10%',
  },
  textHeader: {
    fontSize: 14.5,
    fontFamily: 'Roboto-Medium',
    color: '#0832a3',
  },
  textError: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#CC0000',
  }, 
  containerTextInput: {
    width: '90%',
    paddingTop: 20
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingRight: 30,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginTop: '5%',
    borderRadius: 9,
    backgroundColor: '#0832a3',
  },
  textForgotPassword: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
  },
  textInfo: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    paddingTop: 80,
    color: '#0832a3',
  },
  existingUserButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0832a3',
    backgroundColor: '#FFF',
  }, 
  textExistingUser: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#0832a3',
  },
});

export default ForgotPassword;