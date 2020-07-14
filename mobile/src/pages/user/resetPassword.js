import React, { useState } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';

import logo from '../../icons/logo3.png';
import api from '../../services/api';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [errorMessage, setErrorMessage] = useState(null);
  const [ĺoggedInUser, setLoggedInUser] = useState({});
  const [email, setEmail] = useState(route.params);
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState(null);

  //Reset password if all three infos are correct
  resetPassword = async () => {
    try {
      await api.post('/users/reset_password', {
        email: email.trim(),
        token,
        password,
      });

      Keyboard.dismiss();
      Alert.alert('','Senha atualizada com sucesso');
      navigation.navigate('Login');

    } catch (response) {
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
  
      {!!errorMessage && <Text style = {styles.textError}>{errorMessage}</Text>}
      <View style={styles.containerTextHeader}>
        <Text style={styles.textHeader}>
          Digite o token recebido no e-mail e a nova senha para completar a mudança de senha.
        </Text>
      </View>

      <View style={styles.containerTextInput}>
        <View>
          <TextField 
            label="Email"
            value={email}
            onChangeText={setEmail}
            onChange={() => setEmail('')}
            labelFontSize={14}
            fontSize={14}
            tintColor="#0832a3"
            editable={false}
            style={styles.input}
          />
          <Icon 
            name="envelope" 
            size={18}
            color="#777777"
            style={{
              position: 'absolute',
              top: 34,
              right: 0,
              marginRight: 5,
            }}
          />
        </View>

        <View>
          <TextField 
            label="Token"
            value={token}
            onChangeText={setToken}
            onChange={() => setToken('')}
            labelFontSize={14}
            fontSize={14}
            tintColor="#0832a3"
            style={styles.input}
            error={token === '' ? 'Digite seu token' : ''}
          />
          <Icon 
            name="gears" 
            size={18}
            color="#777777"
            style={{
              position: 'absolute',
              top: 34,
              right: 0,
              marginRight: 5,
            }}
          />
        </View>

        <View>
          <TextField 
            label="Nova senha"
            value={password}
            onChangeText={setPassword}
            onChange={() => setPassword('')}
            labelFontSize={14}
            fontSize={14}
            tintColor="#0832a3"
            style={styles.input}
            error={password === '' ? 'Digite sua nova senha' : ''}
            />
          <Icon 
            name="lock"
            size={24} 
            color="#777777"
            style={{
              position: 'absolute',
              top: 34,
              right: 0,
              marginRight: 5,
            }}
          />
        </View>
      </View>

      <TouchableOpacity 
        onPress = { () => resetPassword()}
        style = { styles.resetPasswordButton}
      >
        
        <Text style = {styles.textResetPassword}>
          ENVIAR
        </Text>
      
      </TouchableOpacity>
    
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
    backgroundColor: '#fff',
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
  containerTextHeader: {
    width: '90%',
  },
  textHeader: {
    fontSize: 14,
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
    marginTop: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingRight: 30,
  },
  textResetPassword: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
  },
  resetPasswordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    backgroundColor: '#0832a3',
  },
  textExistingUser: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#0832a3',
  },
  textInfo: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    paddingTop: 10,
    color: '#0832a3',
  },
  existingUserButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0832a3',
    backgroundColor: '#FFF',
  }, 
});

export default ResetPassword;