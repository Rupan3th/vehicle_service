const CryptoJS_AES = require('../utils/crypto-js/aes');
const CryptoJS_MD5 = require('../utils/crypto-js/md5');
const CryptoJS_HmacSHA256 = require('../utils/crypto-js/hmac-sha256');
const JSEncrypt = require('../utils/jsencrypt/jsencrypt.min');

export const AES_encrypt = (word, key) => {
  const encodeKey = CryptoJS_AES.enc.Utf8.parse(key);
  const encodeWord = CryptoJS_AES.enc.Utf8.parse(word);
  const encrypted = CryptoJS_AES.AES.encrypt(encodeWord, encodeKey, {
    mode: CryptoJS_AES.mode.ECB,
    padding: CryptoJS_AES.pad.Pkcs7
  });
  return CryptoJS_AES.enc.Base64.stringify(encrypted.ciphertext);
}

export const AES_decrypt = (word, key) => {
  const encodeKey = CryptoJS_AES.enc.Utf8.parse(key);
  const byteWord = CryptoJS_AES.enc.Base64.parse(word);
  const encodeWord = CryptoJS_AES.lib.CipherParams.create({ ciphertext: byteWord })
  const decrypt = CryptoJS_AES.AES.decrypt(encodeWord, encodeKey, {
    mode: CryptoJS_AES.mode.ECB,
    padding: CryptoJS_AES.pad.Pkcs7
  });
  return CryptoJS_AES.enc.Utf8.stringify(decrypt).toString();
}

export const MD5_encode = (word) => {
  return CryptoJS_MD5.MD5(word).toString();
}

export const SIGN = (word, key) => {
  const hash = CryptoJS_HmacSHA256.HmacSHA256(word, key);
  return CryptoJS_AES.enc.Base64.stringify(hash);
}

const rsaCoder = new JSEncrypt.JSEncrypt();
rsaCoder.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm1IyaqDlK+878aY+DD3aKk4Xpy/1ybgKvrk2Lm+C2f6la6XDJU/LW7kBmabGKEZ9uQBDi46e9yHgWMA5UM7ZbVdneDw5X5QYPWePK1IVLSt6YsV4/6hSmlgwrVKjwh+UOzI4Z7ViHaM40JNfB60GJZx/mBQLAop8BvApMoO8K01kBIOiIDWAXRq81ow2q+7mFW33vdb8CrGjjh6FUQR9HxYpxu981399FdywsF98X2fn2QEoGCAdnpsx+TqMdPoxH5jfgaD/rcc8w0tIny164oEu/pPhfwDIK8a1mQ9xuqmVEy7Fapfzjw8calmGfiHABnbVROKni4yHP/8OMoDfrQIDAQAB');
export const RSA_encrypt = (word) => {
  return rsaCoder.encrypt(word);
}
