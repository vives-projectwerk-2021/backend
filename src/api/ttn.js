import axios from 'axios';
import config from '../config/config.js'

const api = axios.create({
  baseURL: config.ttn_device_manager_base_url
});

const TTN = {    
  registerDevice(json) {
    return api.post("/devices", json);
  },
  removeDevice(id) {
    return api.delete("/devices/" + id)
  }
}

export { api, TTN }