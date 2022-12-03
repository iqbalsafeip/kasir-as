import SQLite from 'react-native-sqlite-storage';

export const getConnection = async () => {
  return SQLite.openDatabase(
    {name: 'kasir', createFromLocation: '~kasir.db', location: 'default'},
    () => {
      console.log('sukses');
    },
    err => {
      alert(JSON.stringify(err));
      console.log(err);
    },
  );
};

export const getProduk = async db => {
  try {
    const products = [];
    const results = await db.executeSql(`SELECT * FROM produk`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index));
      }
    });
    return products;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const searchProduk = async (db, keyword) => {
  try {
    const products = [];
    const results = await db.executeSql(
      `SELECT * FROM produk WHERE nama LIKE '%${keyword}%'`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index));
      }
    });
    return products;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const createProduk = async (db, data) => {
  try {
    return await db.executeSql(
      `INSERT INTO produk (kode,nama,type) VALUES ('${data.kode}','${data.nama}','${data.type} ');`,
    );
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const createHarga = async (db, data) => {
  try {
    return await db.executeSql(
      `INSERT INTO harga_produk (id_produk,harga_umum,harga_grosir) VALUES ('${data.id_produk}','${data.harga_umum}','${data.harga_grosir} ');`,
    );
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const findProductByKode = async (db, kode) => {
  try {
    const products = [];
    console.log(kode);
    const results = await db.executeSql(
      `SELECT * FROM produk p JOIN harga_produk hp ON p.id = hp.id_produk WHERE p.kode='${kode.trim(
        '',
      )}' `,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index));
      }
    });
    return products;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const getHarga = async (db, kode) => {
  try {
    const products = [];
    const results = await db.executeSql(
      `SELECT * FROM harga_produk WHERE id_produk='${kode}'`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index));
      }
    });
    return products;
  } catch (error) {
    console.log(error);
    throw Error('Failed to get todoItems !!!');
  }
};
