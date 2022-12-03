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
  TextInput,
  Keyboard,
  NativeModules,
  Modal,
  FlatList,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useSelector} from 'react-redux';
import KeyEvent from 'react-native-keyevent';
import {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import colors from '../../constants/colors';
import {formatRupiah} from '../../helper';
import {useEffect} from 'react';

// icons
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppWrapper from '../../components/AppWrapper';
import {findProductByKode, getConnection} from '../../utils/database/actions';

import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

let a = '';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const dummyData = [
  {
    code: '8991906102009',
    nama: 'LA ICE PURPLE 20 Batang',
    harga: 28000,
  },
  {
    code: '8997217370557',
    nama: 'MALBORO MERAH 20 Batang',
    harga: 35000,
  },
];

const TransaksiBaru = props => {
  const [isScanning, setScanning] = useState(false);
  React.useEffect(() => {
    KeyEvent.onKeyDownListener(async keyEvent => {
      a += await keyEvent.pressedKey;
      setScanning(true);
    });

    // if you want to react to keyUp
    KeyEvent.onKeyUpListener(async keyEvent => {
      if (keyEvent.keyCode == 66) {
        setScanning(false);
        let db = await getConnection();
        let res = await findProductByKode(db, a);
        console.log(res);
        if (res.length > 0) {
          setTableData(state => [...state, {...res[0], count: 1}]);
        } else {
          alert('Barang Tidak Ditemukan');
        }
        a = '';
      }
    });
  }, []);

  const toRenderTable = data => {
    return data.map(e => [
      '',
      e.nama,
      e.count,
      value === 'umum' ? e.harga_umum : e.harga_grosir,
      e.harga || 0,
    ]);
  };

  //   dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('umum');
  const [items, setItems] = useState([
    {label: 'Umum', value: 'umum'},
    {label: 'Grosir', value: 'grosir'},
  ]);

  //   table
  const tableHead = ['Nomor', 'Nama Barang', 'Jumlah', 'Harga', 'Total Harga'];
  const [tableData, setTableData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tunai, setTunai] = useState(0);
  const [tunaiArr, setTunaiArr] = useState([]);
  const [kembali, setKembali] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const dataTunai = [
    100, 200, 500, 1000, 2000, 4000, 5000, 8000, 10000, 20000, 30000, 50000,
    100000, 200000, 300000, 400000, 500000,
  ];

  const appendTunai = item => {
    if (tunaiArr.includes(item)) {
      setTunaiArr(state => state.filter(e => e !== item));
    } else {
      setTunaiArr(state => [...state, item]);
    }
  };

  useEffect(() => {
    let total = 0;
    tunaiArr.map(e => (total += e));
    setTunai(state => total);
  }, [tunaiArr]);

  useEffect(() => {
    setKembali(state => parseInt(grandTotal) - parseInt(tunai));
  }, [tunai, grandTotal]);

  useEffect(() => {
    let total = 0;
    tableData.map(e => {
      let sum =
        parseInt(e.count) *
        parseInt(value === 'umum' ? e.harga_umum : e.harga_grosir);
      total += sum;
    });

    setGrandTotal(total);
  }, [tableData, value]);

  const handleMinus = (data, index, value) => {
    setTableData(state => {
      if (value - 1 === 0) return state.filter((_, i) => i != index);

      return state.map((e, i) => {
        if (i === index) {
          let data = e;
          data.count = parseInt(e.count);
          data.count--;
          return data;
        } else return e;
      });
    });
  };

  const handlePlus = (data, index) => {
    setTableData(state => {
      return state.map((e, i) => {
        if (i === index) {
          let data = e;
          data.count = parseInt(e.count);
          data.count++;
          return data;
        } else return e;
      });
    });
    console.log(data);
  };

  const renderData = (data, index, rowData, indexData) => {
    if ([3].includes(index)) {
      return formatRupiah(data);
    }

    if (index === 4) {
      let total = parseInt(rowData[2]) * parseInt(rowData[3]);
      console.log(rowData);
      return formatRupiah(total.toString());
    }

    if (index === 2) {
      return (
        <View
          style={[
            styles.row,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <TouchableOpacity
            onPress={() => handleMinus(rowData, indexData, data)}>
            <Icon name="minus" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View
            style={{
              borderColor: 'black',
              borderWidth: 1,
              paddingVertical: 0.5,
              paddingHorizontal: 4,
              marginHorizontal: 10,
              marginVertical: 5,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.4,
            }}>
            <Text>{data}</Text>
          </View>

          <TouchableOpacity onPress={() => handlePlus(rowData, indexData)}>
            <Icon name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      );
    }

    return data;
  };

  useEffect(() => {
    BluetoothManager.enableBluetooth().then(
      r => {
        var paired = [];
        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
            } catch (e) {
              //ignore
            }
          }
        }
        console.log(JSON.stringify(paired));
      },
      err => {
        alert(err);
      },
    );
  }, []);

  return (
    <AppWrapper title={'Transaksi Baru'}>
      {isScanning && (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 99,
            position: 'absolute',
          }}>
          <Text>Scanning</Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.rowBetween}>
          <View style={[styles.rowBetween, {maxWidth: 200}]}>
            <Text style={styles.label}>Harga </Text>
            <DropDownPicker
              style={[{backgroundColor: '#D6D6D6'}, styles.shadow]}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.shadow,
                styles.row,
                {backgroundColor: 'white'},
              ]}>
              <Icon name="search" size={24} color={colors.primary} />
              <Text style={[styles.labelBtn, {marginLeft: 10}]}>Cari</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.shadow,
                styles.row,
                {backgroundColor: 'white', marginLeft: 10},
              ]}
              onPress={() => setTableData([])}>
              <Icon name="trash-o" size={24} color={colors.primary} />
              <Text style={[styles.labelBtn, {marginLeft: 10}]}>
                Kosongkan Keranjang
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 0.77}}>
            <Table
              style={[styles.shadow, {minHeight: 20}]}
              borderStyle={{borderWidth: 0.5, borderColor: 'gray'}}>
              <Row
                data={tableHead}
                style={styles.headTbl}
                textStyle={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              />
              {tableData.length > 0 ? (
                toRenderTable(tableData).map((rowData, index) => (
                  <TableWrapper key={index} style={styles.rowTbl}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex == 0
                            ? index + 1
                            : renderData(cellData, cellIndex, rowData, index)
                        }
                        textStyle={[
                          styles.textTbl,
                          {textAlign: cellIndex == 1 ? 'left' : 'center'},
                        ]}
                      />
                    ))}
                  </TableWrapper>
                ))
              ) : (
                <TableWrapper style={styles.rowTbl}>
                  <Cell
                    data={'Keranjang Kosong'}
                    textStyle={[
                      styles.textTbl,
                      {textAlign: 'center', fontWeight: 'bold'},
                    ]}
                  />
                </TableWrapper>
              )}
            </Table>
          </View>

          <SafeAreaView
            style={[
              {
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'flex-end',
                flex: 0.21,
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 8,
              },
              styles.shadow,
            ]}>
            <View
              style={[
                styles.row,
                {
                  maxWidth: 300,
                  marginBottom: 10,
                },
              ]}>
              <Text style={[styles.textInf, {flex: 0.5}]}>Total Bayar</Text>
              <View style={styles.cardInf}>
                <Text style={styles.textInf}>{formatRupiah(grandTotal)}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={[
                styles.row,
                {
                  maxWidth: 300,
                  marginBottom: 10,
                },
              ]}>
              <Text style={[styles.textInf, {flex: 0.5}]}>Tunai</Text>
              <View style={styles.cardInf}>
                <Text style={styles.textInf}>{formatRupiah(tunai)}</Text>
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.row,
                {
                  maxWidth: 300,
                },
              ]}>
              <Text style={[styles.textInf, {flex: 0.5}]}>Kembali</Text>
              <View style={styles.cardInf}>
                <Text style={styles.textInf}>{formatRupiah(kembali)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.shadow,
                {
                  backgroundColor: colors.primary,
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: 10,
                  padding: 10,
                },
              ]}>
              <MaterialIcons name="payments" size={30} color={colors.white} />
              <Text style={[styles.textInf, {color: 'white', marginLeft: 10}]}>
                Bayar
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modal}>
              <Text style={[styles.label, {marginTop: 20}]}>Pilih Tunai</Text>
              <ScrollView>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '100%',
                  }}>
                  <FlatList
                    data={dataTunai}
                    numColumns={4}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => appendTunai(item)}
                        style={{
                          flex: 1 / 4,
                          padding: 10,
                          borderColor: 'black',
                          borderRadius: 5,
                          borderWidth: 1,
                          margin: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: tunaiArr.includes(item)
                            ? 'gray'
                            : 'white',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          {formatRupiah(item)}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item}
                  />
                </View>
              </ScrollView>
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
            </View>
          </View>
        </View>
      </Modal>
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: width * 0.95,
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
  headTbl: {height: 40, backgroundColor: '#D62828', color: 'white'},
  textTbl: {margin: 8, textAlign: 'center'},
  rowTbl: {flexDirection: 'row', backgroundColor: 'white'},
  textInf: {fontWeight: 'bold', fontSize: 15, color: 'black'},
  cardInf: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginLeft: 5,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: '100%',
    backgroundColor: 'white',
    borderRadiusTop: 10,
    padding: 10,
    height: 300,
  },
});

export default TransaksiBaru;
