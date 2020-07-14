import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import api from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/EvilIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import noUser_png from '../../icons/nouser.png';
import logo_png from '../../icons/ufpb-logo.png';

const UserInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeData = route.params;

  const [loggedInUser, setLoggedInUser] = useState({});
  const [token, setToken] = useState(null);

  const [firstName, setFirstName] = useState(routeData.firstName);
  const [lastName, setLastName] = useState(routeData.lastName);
  const [cpf, setCpf] = useState(routeData.cpf);
  const [cep, setCep] = useState(routeData.cep);

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('@CodeApi:token');
      const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:users'));

      if(token && user) {
        setLoggedInUser(user);
        setToken(token);
      }
    }
    loadData();
  }, []);

  const chooseImage = async () => {
    let options = {
      title: 'Foto de perfil',
      takePhotoButtonTitle: 'Tire uma foto',
      chooseFromLibraryButtonTitle: 'Selecione da galeria',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const file = {
          name: response.fileName,
          key: response.fileName,
          size: response.fileSize,
          base64: response.data,
          type: 'image/jpeg',
          url: ''
        };
        processUpload(file);
      }
    });
  };

  const processUpload = async (file) => {
    try{
      const response = await api.post('posts/native', file, {headers: {Authorization: token}});

      updateProfile(response.data.url);
    } catch (error){
      console.log(error.data.error);
    }
  };

  const updateProfile = async (image_url) => {
    try{
      const newUser = loggedInUser;

      newUser.image_url = image_url;

      const response = await api.put(`users/${loggedInUser._id}`, newUser, {headers: {Authorization: token}});

      setLoggedInUser(response.data);
    } catch (error){
      console.log(error.data.error);
    }
  };

  const updateUser = async () => {
    try{
      const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: loggedInUser.email,
        password: loggedInUser.password,
        cpf: cpf.trim(),
        address_zipcode: cep.trim()
      }; 

      const response = await api.put(`users/${loggedInUser._id}`, newUser, {headers: {Authorization: token}});

      setLoggedInUser(response.data);
    } catch (error){
      console.log(error.data.error);
    }
  };

  return (
    <>
    <View style={styles.header}>
      <TouchableOpacity style={styles.goBack} onPress={() => navigation.navigate('Home')}>
        <IconMC
          name='arrow-left' 
          size={32}
          color='#0832a3'
        />
        <View style={styles.headerText}>
          <Text style={styles.headerTextInput}>
            VOLTAR
          </Text>
        </View>
      </TouchableOpacity>
    </View>

    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      <StatusBar backgroundColor= 'rgba(8,50,163,0.25)' barStyle= 'dark-content' /> 
      
      <View style={styles.containerAvatar}>
        <TouchableOpacity style={styles.buttonAvatar} onPress={chooseImage}>
          <Image
            style={styles.avatarPic}
            source={loggedInUser && loggedInUser.image_url ? {uri: loggedInUser.image_url} : noUser_png}
            resizeMode='cover'
          />
        </TouchableOpacity>
        <View style={styles.containerUserInfo}>
          <Text style={styles.userName}>
            {loggedInUser.firstName + ` ${loggedInUser.lastName}`}
          </Text>
          <View style={styles.containerUserLocation}>
            <Icon 
              name="location" 
              size={18}
              color="#777777"
            />
            <Text style={styles.userLocation}>
              {loggedInUser.address_city + `, ${loggedInUser.address_state}`}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.containerForm}>
        <Text style={styles.formHeaderText}>
          Clique na foto para editar seu perfil.
        </Text>
        <View style={styles.containerTextInput}>
          <View style={styles.containerTextRowInput}>
            <View style={{width: '50%', paddingRight: 8}}>
              <TextField 
                label="Nome"
                value={firstName}
                onChangeText={setFirstName}
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
                labelFontSize={14}
                fontSize={14}
                tintColor="#0832a3"
                style={styles.input}
                error={lastName === '' ? 'Digite seu sobrenome' : ''}
              />
            </View>
          </View>

          <View style={styles.containerTextRowInput}>
            <View style={{width: '50%', paddingRight: 8}}>
              <TextField 
                label="CPF"
                value={cpf}
                onChangeText={setCpf}
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
                labelFontSize={14}
                fontSize={14}
                tintColor="#0832a3"
                style={styles.input}
                keyboardType='numeric'
              />
            </View>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={updateUser}>
            <Text style={styles.updateButtonText}>
              ATUALIZAR DADOS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    borderBottomWidth: 2.5,
    borderBottomColor: '#0832a3',
    backgroundColor: 'rgba(8,50,163,0.25)',
  },
  goBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerText: {
    paddingHorizontal: 8,
  },
  headerTextInput: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Bold',
    color: '#0832a3'
  },
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    padding: 10,
    paddingTop: 20,
    flex: 1,
  },
  containerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerAvatar: {
    width: '90%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAvatar: {
    width: 190,
    height: 190,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#0832a3',
  },
  avatarPic: {
    height: 180,
    width: 180,
    borderRadius: 100,
  },
  containerUserInfo: {
    width: '100%',
    height: '24%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold'
  },
  userInfo: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium'
  },
  containerUserLocation: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userLocation: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium'
  },
  containerForm: {
    width: '90%',
    height: '50%',
    alignItems: 'center',
    paddingTop: 25,
  },
  formHeaderText: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: '#777777',
  },
  containerTextInput: {
    width: '100%',
    paddingTop: 4,
  },
  containerTextRowInput: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingRight: 30,
  },
  updateButton: {
    width: '100%',
    height: 42,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    marginTop: 20,
    backgroundColor: '#0832a3',
  },
  updateButtonText: {
    fontSize: 13,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
  }
});

export default UserInfo;