import axios from 'axios';
import config from '../config/config.js'

const api = axios.create({
  // baseURL: config.ttn_device_manager_base_url
});

const TTN = {    
  registerDevice(json){
    return api.post(config.ttn_device_manager_base_url+"/devices", json);
  }
}

export { api, TTN }