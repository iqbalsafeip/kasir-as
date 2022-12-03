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
import AppWrapper from '../../components/AppWrapper';

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

const StokBarang = props => {
  const data = useSelector(state => state.mainReducer);
  const [scan, setScan] = useState([]);
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
  const [value, setValue] = useState('umum');
  const [items, setItems] = useState([
    {label: 'Umum', value: 'umum'},
    {label: 'Warungan', value: 'warungan'},
  ]);

  //   table
  const tableHead = ['Nomor', 'Nama Barang', 'Jumlah', 'Harga', 'Total Harga'];
  const [tableData, setTableData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  return <AppWrapper title={'Stok Barang'}></AppWrapper>;
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
});

export default StokBarang;
