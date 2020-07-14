import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal
} from 'react-native';

import api from '../services/api';
import { firebase } from '../services/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

import CountDown from 'react-native-countdown-component';
import { LineChart } from "react-native-chart-kit";
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import noUser_png from '../icons/nouser.png';
import logo_png from '../icons/ufpb-logo.png';

const Exercise = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeData = route.params;
  
  const [loggedInUser, setLoggedInUser] = useState({});
  const [token, setToken] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState(routeData.name);
  const [time, setTime] = useState(routeData.time);
  const [heartbeat, setHeartbeat] = useState([]);
  const [velocity, setVelocity] = useState([]);
  const [distance, setDistance] = useState([]);

  const [chartData, setChartData] = useState({
    datasets: [{
      data: [0], 
      color: (opacity = 1) => `rgba(8,50,163, ${opacity})`, // optional
      strokeWidth: 2 
    }]
  });
  

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
    firebase.database().ref('/Batimentos').push(1);
    firebase.database()
      .ref('/Batimentos')
      .on('value', snapshot => {
        let newItems = [];
        snapshot.forEach(item => {newItems.push(item.val())});
        setHeartbeat(newItems);
      });

    firebase.database().ref('/Velocidade').push(1);
    firebase.database()
      .ref('/Velocidade')
      .on('value', snapshot => {
        let newItems = [];
        snapshot.forEach(item => {newItems.push(item.val())});
        setVelocity(newItems);
      });

    firebase.database().ref('/Distancia').push(1);
    firebase.database()
      .ref('/Distancia')
      .on('value', snapshot => {
        let newItems = [];
        snapshot.forEach(item => {newItems.push(item.val())});
        setDistance(newItems);
      });      
  }, []);

  useEffect(() => {
    const newData = chartData;
    newData.datasets[0].data = velocity;
    setChartData(newData);
  }, [velocity]);
  
  const handleFinishCountdown = () => {
    const calculateAverage = (arr) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    
    setModalVisible(true);

    const averageHeartbeat = calculateAverage(heartbeat);
    const averageVelocity = calculateAverage(velocity);
    const averageDistance = calculateAverage(distance);

    setTimeout(() => {
      storeExercise(averageHeartbeat, averageVelocity, averageDistance);
      setModalVisible(false);
      navigation.navigate('Home');
    }, 6000);
  };

  const storeExercise = async (averageHeartbeat, averageVelocity, averageDistance) => {
    try{
      const exercise = {
        userEmail: loggedInUser.email,
        name,
        time,
        averageHeartbeat,
        averageVelocity,
        averageDistance
      }; 

      const response = await api.post('exercises', exercise, {headers: {Authorization: token}});
    } catch (error){
      console.log(error.data.error);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(8,50,163, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
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
      <View style={styles.containerAvatar}>
        <TouchableOpacity style={styles.buttonAvatar} onPress={() => setModalVisible(true)}>
          <Image
            style={styles.avatarPic}
            source={loggedInUser && loggedInUser.image_url ? {uri: loggedInUser.image_url} : noUser_png}
            resizeMode='cover'
          />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.container}>
      <StatusBar backgroundColor= 'rgba(8,50,163,0.25)' barStyle= 'dark-content' /> 
      <View style={styles.dataContainer}>
        <View style={{paddingTop: 20}}>
          <CountDown
            size={50}
            until={time*60}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#0832a3', borderRadius: 20}}
            digitTxtStyle={{color: '#0832a3'}}
            timeLabelStyle={{color: '#0832a3', fontWeight: 'bold'}}
            timeToShow={['M', 'S']}
            timeLabels={{m: 'Min', s: 'Sec'}}
            onFinish={handleFinishCountdown}
          />
        </View>
        <View style={styles.dataRow}>
          <View style={styles.dataTitleContainer}>
            <Text style={styles.dataTitle}>
              Batimentos cardiacos
            </Text>
            <View style={styles.dataBox}>
              <Text style={styles.dataInput}>
                {`${heartbeat[heartbeat.length - 1]} bpm`}
              </Text>
            </View>
          </View>
          <View style={styles.dataBoxRow}>
            <View style={{width: '50%', height: '100%'}}>
              <Text style={styles.dataTitle}>
                Distância
              </Text>
              <View style={styles.miniDataBox}>
                <Text style={styles.dataInput}>
                  {`${distance[distance.length - 1]} m`}
                </Text>
              </View>
            </View>
            <View style={{width: '50%', height: '100%', marginLeft: 13}}>
              <Text style={styles.dataTitle}>
                Velocidade
              </Text>
              <View style={styles.miniDataBox}>
                <Text style={styles.dataInput}>
                  {`${velocity[velocity.length - 1]} m/s`}
                </Text>
              </View>
            </View>
          </View>
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
          <View style={styles.chart}>
            <LineChart
              data={chartData}
              width={300}
              height={300}
              chartConfig={chartConfig}
              withDots={false}
              withInnerLines={true}
              bezier
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  containerAvatar: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  buttonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#0832a3',
  },
  avatarPic: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  dataContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
  },
  dataRow: {
    alignItems: 'center',
    paddingTop: 40,
    width: '80%',
    height: '59%',
  },
  dataTitleContainer: {
    width: '90%',
    height: '30%',
  },
  dataTitle: {
    fontSize: 19,
    fontFamily: 'Ubuntu-Bold',
    color: '#0832a3',
    alignSelf: 'flex-start'
  },
  dataInput: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
  },
  dataBox: {
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: '#0832a3', 
    borderRadius: 10,
  },
  dataBoxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '90%',
    height: '61.5%',
    marginTop: 20,
    paddingTop: 10,
  },
  miniDataBox: {
    width: '90%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderRadius: 10,
    borderColor: '#0832a3', 
  },
  footer: {
    width: '100%',
    height: '30%',
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
    justifyContent: 'center', 
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0832a3',
    padding: 10,
  },
  chart: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: '5%',
    paddingRight: '5%'
  },
});

export default Exercise;