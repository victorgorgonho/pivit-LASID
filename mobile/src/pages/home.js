import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    FlatList,
    Text,
    Image,
    StatusBar,
    TouchableOpacity,
    Modal,
    Alert
} from 'react-native';

import api from '../services/api';
import { firebase } from '../services/firebase';
import { useNavigation, useLinking } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

import { TextField } from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/EvilIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import noUser_png from '../icons/nouser.png';
import logo_png from '../icons/ufpb-logo.png';

const Home = () => {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState(null);
    const [name, setName] = useState(null);
    const [time, setTime] = useState(null);

    const navigation = useNavigation();

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

    useEffect(() => {
        firebase.database().ref('/Batimentos').remove();
        firebase.database().ref('/Batimentos').off('value', undefined);

        firebase.database().ref('/Velocidade').remove();
        firebase.database().ref('/Velocidade').off('value', undefined);

        firebase.database().ref('/Distancia').remove();
        firebase.database().ref('/Distancia').off('value', undefined);
    });

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

    const handleNavigate = () => {
        if(name !== '' && name !== null && time >= 0){
            const data = {
                name: name,
                time: time ? time : 1
            }

            navigation.navigate('Exercise', data);
            setModalVisible(false);
        }else{
            Alert.alert('', 'Informações incompletas!');
        }
    };

    const handleNavigateInfo = () => {
        const user = {
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            cpf: loggedInUser.cpf,
            cep: loggedInUser.address_zipcode
        }

        navigation.navigate('UserInfo', user);
    };

    return (
        <>
        <View style={styles.container}>
            <StatusBar backgroundColor= '#FFF' barStyle= 'dark-content' /> 
            <View style={styles.header}>
                <TouchableOpacity style={{ paddingTop: 2 }} onPress={() => navigation.navigate('Login')}>
                    <IconMC
                        name='logout' 
                        size={32}
                        color='#777777'
                        style={{
                            transform: [{ rotate: '180deg' }],
                        }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.containerAvatar}>
                <TouchableOpacity style={styles.buttonAvatar} onPress={chooseImage}>
                    <Image
                        style={styles.avatarPic}
                        source={loggedInUser && loggedInUser.image_url ? {uri: loggedInUser.image_url} : noUser_png}
                        resizeMode='cover'
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.containerUserInfo}>
                <Text style={styles.userInfo}>
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
            <View style={styles.options}>
                <TouchableOpacity style={styles.buttonOptions} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonOptionsText}>
                        INICIAR EXERCÍCIO
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOptions} onPress={handleNavigateInfo}>
                    <Text style={styles.buttonOptionsText}>
                        INFORMAÇÕES PESSOAIS
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Image
                    style={styles.logoPic}
                    source={logo_png}
                />
                <Text style={styles.footerText}>
                    Created by LASID-UFPB
                </Text>
            </View>
        </View>
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
        >
            <StatusBar backgroundColor='rgba(0,0,0,0.5)' barStyle= 'dark-content' /> 
            <View style={styles.modalView}>
                <View style={styles.modalForm}>
                    <Text style={styles.modalHeader}>
                        Exercício
                    </Text>
                    <View style={styles.input}>
                        <TextField
                            label='Nome do exercício'
                            value={name}
                            onChangeText={setName}
                            onChange={() => setName('')}
                            labelFontSize={14}
                            fontSize={14}
                            tintColor="#0832a3"
                            style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}
                            inputContainerStyle={{paddingRight: 30}}
                            error={name === '' ? 'Digite o nome do exercício' : ''}
                        />
                        <IconMC 
                            name="dumbbell" 
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
                    <View style={styles.input}>
                        <TextField
                            label='Duração (em minutos)'
                            value={time}
                            onChangeText={setTime}
                            onChange={() => setTime(0)}
                            labelFontSize={14}
                            fontSize={14}
                            tintColor="#0832a3"
                            style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}
                            inputContainerStyle={{paddingRight: 30}}
                            keyboardType='numeric'
                            error={time === 0 ? 'Digite uma duração válida' : 0}
                        />
                        <IconMC 
                            name="clock-time-four-outline" 
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
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.modalFooterButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalFooterText}>
                                VOLTAR
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalFooterButton} onPress={handleNavigate}>
                            <Text style={styles.modalFooterText}>
                                COMEÇAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        padding: 10,
        flex: 1,
    },
    header: {
        alignItems: 'flex-start',
    },
    containerAvatar: {
        width: '100%',
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        marginTop: '13%',
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
        height: 60,
        alignItems: 'center',
    },
    userInfo: {
        fontSize: 20,
        fontFamily: 'Ubuntu-Bold'
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
    options: {
        width: '100%',
        height: 160,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 40,
    },
    buttonOptions: {
        width: '80%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#777777',
        backgroundColor: '#0832a3',
    },
    buttonOptionsText: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: 'Ubuntu-Bold',
    }, 
    footer: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoPic: {
        height: 60,
        width: 60,
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: '#777777',
    },
    modalView: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalForm: {
        width: '90%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'flex-start', 
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0832a3',
        padding: 10,
    },
    modalHeader: {
        width: '90%',
        paddingTop: 10,
        fontSize: 17,
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 10,
    },
    input: {
        width: '90%',
    },
    modalFooter: {
        width: '90%',
        height: '30%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    modalFooterButton: {
        width: '35%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#777777',
        backgroundColor: '#0832a3',
    },
    modalFooterText: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: 'Ubuntu-Bold'
    },
});

export default Home;