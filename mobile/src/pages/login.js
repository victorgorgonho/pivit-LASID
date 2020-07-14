import React, { useState, useEffect } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';

import logo from '../icons/logo3.png';
import api from '../services/api';

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState('jose.victor@lavid.ufpb.br');
  const [password, setPassword] = useState('123456');

  const navigation = useNavigation();

  useEffect(() => {
    if(errorMessage){
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    }
  }, [errorMessage])

  //Sign in if email and password match MongoDB user
  signIn = async () => {
    try {
      const response = await api.post('/users/authenticate', {
        email: email.trim().toLowerCase(),
        password,
      });

      const { user, token } = response.data;
      
      //Storage token and user (as JSON) in AsyncStorage to use in other screens
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:users', JSON.stringify(user)],
      ]);

      setLoggedInUser(user);
      Keyboard.dismiss();
      
      Alert.alert('','Login com sucesso!');
      navigation.navigate('Home');
      
    } catch (error) {
      setErrorMessage(error.data.error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar backgroundColor= '#FFF' barStyle= 'dark-content' /> 
      <View style={styles.containerLogo}>
        <Image
          style={styles.logo}
          source={logo}
        />
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
            style={styles.input}
            error={email === '' ? 'Digite seu email' : ''}
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
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            labelFontSize={14}
            fontSize={14}
            tintColor="#0832a3"
            style={styles.input}
            error={password === '' ? 'Digite sua senha' : ''}
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
      {!!errorMessage && <Text style = {styles.textError}>{ errorMessage }</Text>}

      <TouchableOpacity 
        onPress = { () => signIn() }
        style = { styles.loginButton}
        >
        <Text style = {styles.textLoginButton}>
          ENTRAR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.forgotPasswordButton}
        onPress = { () => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.textForgotPassword}>
          ESQUECI MINHA SENHA
        </Text>
      </TouchableOpacity>
    
      <Text style={styles.textNewUser}>
        NÃO POSSUI CONTA?
      </Text> 

      <TouchableOpacity 
        style={styles.newUserButton}
        onPress = { () => navigation.navigate('Register')}
      >
        <Text style={styles.textNewUser}>
          CRIAR NOVA CONTA
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  containerTextInput: {
    width: '90%',
    marginTop: 8,
  },
  textError: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#CC0000',
  }, 
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingRight: 30,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginTop: 20,
    borderRadius: 9,
    backgroundColor: '#0832a3',
  },
  textLoginButton: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
  },
  textForgotPassword: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    marginTop: 40,
    marginBottom: 40,
    color: '#979696',
  },
  newUserButton: {
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
  textNewUser: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#0832a3',
  },
});

export default Login;