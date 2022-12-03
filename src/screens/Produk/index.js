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
  FlatList,
  Modal,
  Pressable,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppWrapper from '../../components/AppWrapper';
import {useCallback} from 'react';
import {
  createHarga,
  createProduk,
  getConnection,
  getHarga,
  getProduk,
  searchProduk,
} from '../../utils/database/actions';

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

const Produk = props => {
  const data = useSelector(state => state.mainReducer);
  const [scan, setScan] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  React.useEffect(() => {
    KeyEvent.onKeyDownListener(async keyEvent => {
      console.log(`onKeyDown keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(`Key: ${keyEvent.pressedKey}`);
      a += await keyEvent.pressedKey;
      setScan(e => [...e, keyEvent.pressedKey]);
    });

    // if you want to react to keyUp
    KeyEvent.onKeyUpListener(async keyEvent => {
      console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
      console.log(`Action: ${keyEvent.action}`);
      console.log(`Key: ${keyEvent.pressedKey}`);
      if (keyEvent.keyCode == 66) {
        let res = findScanned(a);
        if (res) {
          setTableData(state => [
            ...state,
            [4, res.nama, '1', res.harga, res.harga],
          ]);
        }
        a = '';
      }
    });
  }, []);

  const findScanned = scanned => {
    let res = dummyData.filter(e => {
      console.log(typeof e.code.toString());
      console.log(typeof scanned.toString());
      console.log(scanned.toString() == e.code.toString());
      return e.code.toString().trim() == scanned.toString().trim();
    });
    console.log(scanned);
    if (res.length === 0) {
      alert('Barang tidak ditemukan');
      return false;
    } else {
      return res[0];
    }
  };

  //   dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Bumbu', value: 'bumbu'},
    {label: 'Deterjen', value: 'deterjen'},
    {label: 'Kecantikan', value: 'kecantikan'},
    {label: 'Kopi', value: 'kopi'},
    {label: 'Makanan', value: 'makanan'},
    {label: 'Minuman', value: 'minuman'},
    {label: 'Obat', value: 'obat'},
    {label: 'Rokok', value: 'rokok'},
    {label: 'Sabun', value: 'sabun'},
    {label: 'Teh', value: 'teh'},
    {label: 'Lainnya', value: 'lainnya'},
  ]);

  //   table
  const tableHead = ['Kode', 'Nama Barang', 'Kategori Barang', 'Aksi'];
  const [tableData, setTableData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState('');
  //   init data
  useEffect(() => {
    initData();
  }, []);

  const initData = useCallback(async () => {
    setLoading(true);
    try {
      let db = await getConnection();
      let res = await getProduk(db);
      setTableData(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (keyword === '') throw 'Isi Keyword Terlebih dahulu';
      let db = await getConnection();
      let res = await searchProduk(db, keyword);
      setTableData(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');

  const handleTambah = async () => {
    let data = {
      kode,
      nama,
      type: value,
    };
    let db = await getConnection();
    let res = await createProduk(db, data);
    if (res) {
      alert('Tambah Data Berhasil');
      initData();
      setNama('');
      setKode('');
      setValue('');
      setModalVisible(false);
    } else {
      alert('Tambah data Gagal');
    }
  };

  const [hargaShow, setShow] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [dataHarga, setDataHarga] = useState({
    harga_umum: 0,
    harga_grosir: 0,
  });
  const [curr, setCurr] = useState(null);

  const _getHarga = async id => {
    let db = await getConnection();
    let res = await getHarga(db, id);
    console.log(res);
    if (res.length > 0) {
      return res[0];
    } else {
      return false;
    }
  };

  const handleHarga = async id => {
    let harga = await _getHarga(id);
    setCurr(id);
    if (harga) {
      setUpdate(true);
      console.log(harga);
      setDataHarga(harga);
    } else {
      setUpdate(false);
      setDataHarga({
        harga_umum: 0,
        harga_grosir: 0,
      });
    }
    setShow(!hargaShow);
  };

  const handleTambahHarga = async _ => {
    let db = await getConnection();
    let res = await createHarga(db, {...dataHarga, id_produk: curr});
    console.log(res);
    if (res) {
      alert('Tambah Harga Berhasil');
      setDataHarga({
        harga_umum: 0,
        harga_grosir: 0,
      });
    } else {
      alert('Tambah Harga Gagal');
    }
    setShow(false);
  };

  return (
    <AppWrapper title={'Produk'}>
      <View style={styles.container}>
        <View
          style={[
            styles.shadow,
            {flex: 0.77, backgroundColor: 'white', borderRadius: 10},
          ]}>
          <View style={[styles.rowBetween, {paddingHorizontal: 10}]}>
            <View style={[styles.row, {padding: 10}]}>
              <TextInput
                placeholder="Cari Produk"
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 8,
                }}
                value={keyword}
                onChangeText={e => setKeyword(e)}
              />
              <TouchableOpacity
                onPress={handleSearch}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary,
                    marginLeft: 10,
                    flexDirection: 'row',
                  },
                ]}>
                <Icon name="search" size={16} color={colors.white} />
                <Text
                  style={[styles.labelBtn, {color: 'white', marginLeft: 8}]}>
                  Cari
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={initData}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary,
                    marginLeft: 10,
                    flexDirection: 'row',
                  },
                ]}>
                <AntDesign name="reload1" size={16} color={colors.white} />
                <Text
                  style={[styles.labelBtn, {color: 'white', marginLeft: 8}]}>
                  Reload
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary,
                    marginLeft: 10,
                    flexDirection: 'row',
                  },
                ]}>
                <AntDesign name="plus" size={16} color={colors.white} />
                <Text
                  style={[styles.labelBtn, {color: 'white', marginLeft: 8}]}>
                  Tambah
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text>Total Item : {tableData.length}</Text>
            </View>
          </View>
          <Table>
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
              <FlatList
                data={tableData}
                renderItem={({item, index}) => (
                  <TouchableOpacity>
                    <TableWrapper key={index} style={styles.rowTbl}>
                      <Cell
                        data={item.kode}
                        textStyle={[styles.textTbl, {textAlign: 'center'}]}
                      />
                      <Cell
                        data={item.nama}
                        textStyle={[styles.textTbl, {textAlign: 'left'}]}
                      />
                      <Cell
                        data={item.type.toUpperCase()}
                        textStyle={[styles.textTbl, {textAlign: 'center'}]}
                      />
                      <Cell
                        data={
                          <View style={[styles.row, {padding: 8}]}>
                            <TouchableOpacity
                              onPress={() => handleHarga(item.id)}
                              style={[
                                styles.btn,
                                {
                                  backgroundColor: colors.primary,
                                  marginLeft: 10,
                                  flexDirection: 'row',
                                },
                              ]}>
                              <AntDesign
                                name="plus"
                                size={12}
                                color={colors.white}
                              />
                              <Text
                                style={[
                                  styles.labelBtn,
                                  {color: 'white', marginLeft: 8, fontSize: 12},
                                ]}>
                                Harga
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setModalVisible(!modalVisible)}
                              style={[
                                styles.btn,
                                {
                                  backgroundColor: colors.primary,
                                  marginLeft: 10,
                                  flexDirection: 'row',
                                },
                              ]}>
                              <Icon
                                name="trash"
                                size={12}
                                color={colors.white}
                              />
                              <Text
                                style={[
                                  styles.labelBtn,
                                  {color: 'white', marginLeft: 8, fontSize: 12},
                                ]}>
                                Hapus
                              </Text>
                            </TouchableOpacity>
                          </View>
                        }
                        textStyle={[styles.textTbl, {textAlign: 'center'}]}
                      />
                    </TableWrapper>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TableWrapper style={styles.rowTbl}>
                <Cell
                  data={'Produk Kosong'}
                  textStyle={[
                    styles.textTbl,
                    {textAlign: 'center', fontWeight: 'bold'},
                  ]}
                />
              </TableWrapper>
            )}
          </Table>
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
              <Text style={[styles.label, {marginTop: 20}]}>Kode Barcode</Text>
              <TextInput
                placeholder="Kode Produk"
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                value={kode}
                onChangeText={e => setKode(e)}
              />
              <Text style={styles.label}>Nama Produk</Text>
              <TextInput
                placeholder="Nama Produk"
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                value={nama}
                onChangeText={e => setNama(e)}
              />
              <Text style={styles.label}>Kategori Produk</Text>
              <View style={{maxWidth: 400, marginBottom: 10}}>
                <DropDownPicker
                  style={[{backgroundColor: 'white'}]}
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                />
              </View>
              <TouchableOpacity
                onPress={handleTambah}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary,
                    flexDirection: 'row',
                  },
                ]}>
                <AntDesign name="plus" size={16} color={colors.white} />
                <Text
                  style={[styles.labelBtn, {color: 'white', marginLeft: 8}]}>
                  Tambah
                </Text>
              </TouchableOpacity>

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
      <Modal
        animationType="fade"
        transparent={true}
        visible={hargaShow}
        onRequestClose={() => {
          setShow(!hargaShow);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modal}>
              <Text style={[styles.label, {marginTop: 20}]}>Harga Umum</Text>
              <TextInput
                placeholder="Harga Umum"
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                value={dataHarga.harga_umum.toString()}
                onChangeText={e =>
                  setDataHarga(state => ({...state, harga_umum: e}))
                }
              />
              <Text style={styles.label}>Harga Grosir</Text>
              <TextInput
                placeholder="Harga Grosir"
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                value={dataHarga.harga_grosir.toString()}
                onChangeText={e =>
                  setDataHarga(state => ({...state, harga_grosir: e}))
                }
              />
              <TouchableOpacity
                onPress={handleTambahHarga}
                style={[
                  styles.btn,
                  {
                    backgroundColor: colors.primary,
                    flexDirection: 'row',
                  },
                ]}>
                <AntDesign name="plus" size={16} color={colors.white} />
                <Text
                  style={[styles.labelBtn, {color: 'white', marginLeft: 8}]}>
                  {isUpdate ? 'Update' : 'Tambah'}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  top: 10,
                  right: 10,
                  position: 'absolute',
                }}>
                <TouchableOpacity onPress={() => setShow(!hargaShow)}>
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
    padding: 11,
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
    justifyContent: 'center',
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
    minWidth: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});

export default Produk;
