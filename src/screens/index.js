import DataTransaksi from './DataTransaksi/index.js';
import Home from './Home/index.js';
import Produk from './Produk/index.js';
import ReturPenjualan from './ReturPenjualan/index.js';
import StokBarang from './StokBarang/index.js';
import TransaksiBaru from './TransaksiBaru/index.js';

const screens = [
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'TransaksiBaru',
    component: TransaksiBaru,
  },
  {
    name: 'Produk',
    component: Produk,
  },
  {
    name: 'ReturPenjualan',
    component: ReturPenjualan,
  },
  {
    name: 'StokBarang',
    component: StokBarang,
  },
  {
    name: 'DataTransaksi',
    component: DataTransaksi,
  },
];

export default screens;
