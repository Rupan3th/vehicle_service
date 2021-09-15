import { UUID } from '../utils/uuid'
import { isJSONObject, isNull } from '../utils/checker'
import { SIGN, AES_encrypt, AES_decrypt, MD5_encode, RSA_encrypt } from './crypto'

const app = getApp();
const baseURL = app.globalData.baseURL;
// const requestSecret = app.globalData.requestSecret;
// const token = app.globalData.token;

function getSecret() {
  return app.globalData.requestSecret;
}

function getToken() {
  return app.globalData.token;
}

function sign (nonce, timestamp, key, params, body) {
  const headerPart = 'nonce=' + nonce + 'timestamp=' + String(timestamp);

  const paramArr = [];
  if (params !== undefined) {
    for (const k1 in params) {
      const val1 = params[k1];
      paramArr.push(k1 + '=' + val1);
    }
  }
  if (body !== undefined) {
    for (const k2 of Object.keys(body)) {
      let val2 = body[k2];
      if (val2) {
        if (isJSONObject(val2)) {
          val2 = JSON.stringify(val2);
        }
        paramArr.push(k2 + '=' + String(val2));
      }
    }
  }

  if (paramArr.length > 0) {
    paramArr.sort();
    const signSrc = headerPart + paramArr.join('');
    return SIGN(signSrc, key);
  }
  return SIGN(headerPart, key);
}

function packBody (body, key) {
  if (isNull(body)) {
    return undefined;
  }
  return AES_encrypt(body, key);
}

function unpackResponse (data) {
  if (!isNull(data.ree) && data.ree > 0) {
    let content = data.item;
    if (isNull(content) || content === '') {
      content = data.items;
    }
    const decrypt = AES_decrypt(content, getSecret());
    return JSON.parse(decrypt);
  } else {
    let content = data.item;
    if (isNull(content)) {
      content = data.items;
    }
    return content;
  }
}

function formatURLParams (url, params) {
  if (params === undefined) return url;
  if (params === {}) return url;

  const arr = [];
  for (const key in params) {
    const val = params[key];
    const pp = encodeURIComponent(val);
    arr.push(key + '=' + pp);
  }
  return url + '?' + arr.join('&');
}

const baseRequest = (api, method, params, body, secure) => {
  return new Promise((resolve, reject) => {
    let headers = {};
    let urlParams = isNull(params) ? {} : { ...params };
    headers['Content-Type'] = 'application/json; charset=UTF-8';
    if (getToken()) {
      headers['Authorization'] = getToken();
    }
    if (!isNull(secure) && secure === true) {
      const nonce = MD5_encode(UUID());
      const timestamp = new Date().getTime();
      const signature = sign(nonce, timestamp, getSecret(), params, body);
      headers['Signature'] = signature;
      headers['Nonce'] = nonce;
      headers['Timestamp'] = timestamp;

      const secret = RSA_encrypt(getSecret());
      urlParams.qee = secret;
    }
    let url = baseURL + api;
    url = formatURLParams(url, urlParams);
    let data = secure ? packBody(JSON.stringify(body), getSecret()) : body;

    wx.request({
      url: url,
      method: method,
      data: data,
      header: headers,
      timeout: 15000,
      success(response) {
        const data = response.data;
        if (data.errCode !== 0) {
          if (data.errCode === 10009 || data.errCode == 10011) {
            // TODO: error handle for token invalidation
            // naveigate to login page
            wx.request({
              url: app.globalData.baseURL+'wxLogin',
              method: 'post',
              data: {
                code: app.globalData.code,
              },
              header: {
                'content-type': 'application/json'
              },
              success: (result) => {                
                // console.log('registerToken -----', result.data.item.registerToken)        
                // console.log('access token -----', result.data.item.token)
                if(result.data.item.token != null){
                  app.globalData.token = result.data.item.token;                  
                }else{
                  if(result.data.item.registerToken != null){
                    app.globalData.registerToken = result.data.item.registerToken;
                    wx.navigateTo({
                      url: '/pages/verification_sms/verification_sms',
                    })
                  }
                }                
              },
              fail: function (res) {
                console.log("请求失败", res)
              }
            })
          }
          return reject(new Error(data.message));
        } else {
          if (isNull(data.item) && isNull(data.items)) {
            return resolve(response);
          } else {
            if (!isNull(data.item)) {
              response.data.item = unpackResponse(data);
            } else if (!isNull(data.items)) {
              response.data.items = unpackResponse(data);
            }
            return resolve(response);
          }
        }
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

export function getReq (api, params, secure) {
  return baseRequest(api, 'GET', params, undefined, secure)
  .then(response => response.data)
  // .catch(error => {
  //   return error.response;
  // });
}

export function postJSONReq (api, body, secure) {
  return baseRequest(api, 'POST', undefined, body, secure)
  .then(response => response.data)
  // .catch(error => {
  //   return error.response;
  // });
}

export function postJSONAndURLReq (api, body, urlParams, secure) {
  return baseRequest(api, 'POST', urlParams, body, secure)
  .then(response => response.data)
  .catch(error => {
    return error.response;
  });
}

export function postImage(api, filePath) {
  let headers = {};
  headers['Content-Type'] = 'multipart/form-data';
  if (getToken()) {
    headers['Authorization'] = getToken();
  }

  let url = baseURL + api;
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath: filePath,
      name: 'image',
      url: url,
      header: headers,
      formData: {
        ...headers
      },
      timeout: 30000,
      success (response) {
        const data = JSON.parse(response.data);
        response.data = data;
        if (data.errCode !== 0) {
          if (data.errCode === 10009 || data.errCode == 10011) {
            // go to login
            wx.request({
              url: app.globalData.baseURL+'wxLogin',
              method: 'post',
              data: {
                code: app.globalData.code,
              },
              header: {
                'content-type': 'application/json'
              },
              success: (result) => {                
                // console.log('registerToken -----', result.data.item.registerToken)        
                // console.log('access token -----', result.data.item.token)
                if(result.data.item.token != null){
                  app.globalData.token = result.data.item.token;                  
                }else{
                  if(result.data.item.registerToken != null){
                    app.globalData.registerToken = result.data.item.registerToken;
                    wx.navigateTo({
                      url: '/pages/verification_sms/verification_sms',
                    })
                  }
                }                
              },
              fail: function (res) {
                console.log("请求失败", res)
              }
            })
            //////////////
          } else {
            resolve(data);
          }
        } else {
          resolve(data);
        }
      },
      fail(e) {
        reject(e);
      }
    })
  })
}