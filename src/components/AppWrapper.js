import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import colors from '../constants/colors';

// icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const AppWrapper = props => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View style={{backgroundColor: '#D6D6D6', minHeight: height}}>
      <View style={{width: width, zIndex: 2, backgroundColor: '#D62828'}}>
        <View
          style={[styles.container, {paddingVertical: 0, paddingVertical: 20}]}>
          <View style={[styles.rowBetween]}>
            <View style={styles.row}>
              {/* <Pressable onPress={() => setModalVisible(true)}>
                <Image
                  source={require('../assets/icons/menu.png')}
                  style={{width: 30, height: 30}}
                />
              </Pressable> */}
              <Text style={styles.title}>{props.title}</Text>
            </View>
            <View style={[styles.row]}>
              <TouchableOpacity>
                <Image
                  source={require('../assets/icons/tanya.png')}
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 8}}>
                <Image
                  source={require('../assets/icons/settings.png')}
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>{props.children}</ScrollView>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#EAEAEA',
                height: 150,
                padding: 18,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  top: 10,
                  right: 10,
                  position: 'absolute',
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name="close" size={24} color={'black'} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 75 / 2,
                  backgroundColor: 'white',
                }}></View>
              <View style={{marginLeft: 15}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 24, color: 'black'}}>
                  Garut Shop
                </Text>
                <TouchableOpacity
                  style={[
                    styles.shadow,
                    {
                      padding: 5,
                      backgroundColor: colors.primary,
                      borderRadius: 5,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <AntDesign name="isv" size={18} color={colors.white} />
                  <Text style={{color: 'white', marginLeft: 10}}>Toko</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                minWidth: 250,
                padding: 15,
                borderBottomWidth: 2,
                borderBottomColor: '#EAEAEA',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AntDesign name="dashboard" size={24} color={colors.primary} />
              <Text
                style={{fontWeight: 'bold', color: 'black', marginLeft: 10}}>
                Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: width * 0.93,
    alignSelf: 'center',
    zIndex: 2,
    paddingVertical: 25,
  },
  rowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    minWidth: 20,
    minHeight: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  labelBtn: {
    fontWeight: '400',
    fontSize: 16,
    color: '#D62828',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.27,

    elevation: 3,
  },
  staticBg: {
    width: width,
    height: 300,
    backgroundColor: '#D62828',
    zIndex: 1,
    position: 'absolute',
  },
  title: {
    fontWeight: '700',
    color: 'white',
    fontSize: 24,
    marginLeft: 35,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    marginRight: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '100%',
    maxWidth: 250,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AppWrapper;
