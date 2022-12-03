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
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useSelector} from 'react-redux';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const btnList = [
  {
    label: 'Retur Penjualan',
    icon: require('../../assets/icons/retur.png'),
    screen: 'ReturPenjualan',
  },
  {
    label: 'Stok Barang',
    icon: require('../../assets/icons/stok.png'),
    screen: 'StokBarang',
  },
  {
    label: 'Laporan',
    icon: require('../../assets/icons/laporan.png'),
  },
  {
    label: 'Produk',
    icon: require('../../assets/icons/produk.png'),
    screen: 'Produk',
  },
  {
    label: 'Data Transaksi',
    icon: require('../../assets/icons/data.png'),
    screen: 'DataTransaksi',
  },
];

const Home = ({navigation}) => {
  const data = useSelector(state => state.mainReducer);
  React.useEffect(() => {
    console.log(data);
  }, []);
  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: '#D6D6D6', minHeight: height}}>
        <View style={styles.staticBg}></View>
        <View style={{width: width, zIndex: 2}}>
          <View
            style={[styles.container, {paddingVertical: 0, paddingTop: 20}]}>
            <View style={[styles.rowBetween]}>
              <TouchableOpacity>
                <Image
                  source={require('../../assets/icons/menu.png')}
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
              <View style={[styles.row]}>
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/icons/tanya.png')}
                    style={{width: 30, height: 30}}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 8}}>
                  <Image
                    source={require('../../assets/icons/settings.png')}
                    style={{width: 30, height: 30}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TransaksiBaru')}
            style={[styles.btn, {backgroundColor: 'white'}, styles.shadow]}>
            <Image source={require('../../assets/icons/transaksi.png')} />
            <Text style={styles.labelBtn}>Transaksi Baru</Text>
          </TouchableOpacity>
          <View style={[styles.rowBetween, {marginVertical: 20}]}>
            {btnList.map((e, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.btn,
                  {backgroundColor: 'white', minWidth: width * 0.17},
                  styles.shadow,
                ]}
                onPress={() => navigation.navigate(e.screen)}>
                <Image source={e.icon} />
                <Text style={styles.labelBtn}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Calendar
            style={[{borderRadius: 8}, styles.shadow]}
            theme={{
              arrowColor: '#D62828',
              todayDotColor: '#D62828',
              textMonthFontWeight: '700',
              monthTextColor: '#D62828',
              todayBackgroundColor: '#D62828',
            }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
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
    marginTop: 15,
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
});

export default Home;
