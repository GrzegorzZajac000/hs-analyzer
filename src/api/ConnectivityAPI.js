import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.CONNECTIVITY_API_URL,
  timeout: 120000
});

const ConnectivityAPI = {
  ping: ip => {
    return instance.get(`/ping/${ip}`);
  },

  checkPort: ip => {
    return instance.get(`/port-check/${ip}/44158`);
  }
};

export default ConnectivityAPI;
