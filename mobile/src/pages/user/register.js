import React, { Component, useState } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/FontAwesome';

import logo from '../../icons/logo3.png';

const Register = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [cpf, setCpf] = useState(null);
  const [cep, setCep] = useState(null);

  const navigation = useNavigation();

  //Register user
  register = async () => {
    try {
      const response = await api.post('/users/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        cpf,
        address_zipcode: cep
      });

      const { user, token } = response.data;
      
      //Storage token and new user (as .JSON) in AsyncStorage to be used in another pages
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:users', JSON.stringify(user)],
      ]);

      Keyboard.dismiss();
      Alert.alert('','Usuário criado com sucesso!');
      navigation.navigate('Login');

    } catch (response) {
      console.log(response);
      setErrorMessage(response.data.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.containerLogo}>
        <Image
          style={styles.logo}
          source={logo}
        />
      </View>
      
      {!!errorMessage && <Text style = {styles.textError}>{errorMessage}</Text>}
      <View style={styles.containerTextInput}>
        <View style={styles.containerTextRowInput}>
          <View style={{width: '50%', paddingRight: 8}}>
            <TextField 
              label="Nome"
              value={firstName}
              onChangeText={setFirstName}
              onChange={() => setFirstName('')}
              labelFontSize={14}
              fontSize={14}
              tintColor="#0832a3"
              style={styles.input}
              error={firstName === '' ? 'Digite seu nome' : ''}
            />
          </View>

          <View style={{width: '50%', paddingLeft: 8}}>
            <TextField 
              label="Sobrenome"
              value={lastName}
              onChangeText={setLastName}
              onChange={() => setLastName('')}
              labelFontSize={14}
              fontSize={14}
              tintColor="#0832a3"
              style={styles.input}
              error={lastName === '' ? 'Digite seu sobrenome' : ''}
            />
          </View>
        </View>
        
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

        <View style={styles.containerTextRowInput}>
          <View style={{width: '50%', paddingRight: 8}}>
            <TextField 
              label="CPF"
              value={cpf}
              onChangeText={setCpf}
              onChange={() => setCpf('')}
              labelFontSize={14}
              fontSize={14}
              tintColor="#0832a3"
              style={styles.input}
              keyboardType='numeric'
            />
          </View>

          <View style={{width: '50%', paddingLeft: 8}}>
            <TextField 
              label="CEP"
              value={cep}
              onChangeText={setCep}
              onChange={() => setCep('')}
              labelFontSize={14}
              fontSize={14}
              tintColor="#0832a3"
              style={styles.input}
              keyboardType='numeric'
            />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        onPress = { () => register()}
        style = { styles.newUserButton}
      >
        
        <Text style = {styles.textNewUser}>
          FINALIZAR REGISTRO
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  textError: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#CC0000',
  }, 
  containerTextInput: {
    width: '90%',
  },
  containerTextRowInput: {
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingRight: 30,
  },
  textInfo: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    paddingTop: 50,
  },
  textNewUser: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
  },
  newUserButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    marginTop: 20,
    borderRadius: 9,
    backgroundColor: '#0832a3',
  },
  textInfo: {
    paddingTop: 26,
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
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

export default Register;