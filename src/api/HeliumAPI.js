import axios from 'axios';
import URLBuilder from '../utilities/URLBuilder';
import cursorData from './cursorData';
import retry from 'axios-retry-after';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3000/api' : 'https://api.hs-analyzer.com/api',
  timeout: 120000,
  headers: {
    'Cache-Control': 'max-age=60',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Content-Type': 'application/json'
  }
});

instance.interceptors.response.use(null, retry(instance, {
  isRetryable (error) {
    return (error.response && error.response.status === 429);
  },

  wait (error) {
    return new Promise(resolve => setTimeout(resolve, error.response.data.come_back_in_ms / 50));
  }
}));

const HeliumAPI = {
  // Stats
  getBlockchainStats: () => {
    return instance.get('/v1/stats');
  },

  getTokenSupply: () => {
    return instance.get('/v1/stats/token_supply');
  },

  // Blocks
  getBlockchainHeight: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/blocks/height`, config);
    return instance.get(url);
  },

  getBlockStats: () => {
    return instance.get('/v1/blocks/stats');
  },

  getBLockDescriptions: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/blocks', loadingStateUpdate, config);
  },

  getBlockAtHeight: height => {
    if (!height) {
      throw new Error('HeliumAPI.getBlockAtHeight - height is required');
    }

    return instance.get(`/v1/blocks/${height}`);
  },

  getBlockAtHeightTransactions: (height, loadingStateUpdate, config = {}) => {
    if (!height) {
      throw new Error('HeliumAPI.getBlockAtHeightTransactions - height is required');
    }

    return cursorData(instance, `/v1/blocks/${height}/transactions`, loadingStateUpdate, config);
  },

  getBlockAtHash: hash => {
    if (!hash) {
      throw new Error('HeliumAPI.getBlockAtHash - hash is required');
    }

    return instance.get(`/v1/blocks/hash/${hash}`);
  },

  getBlockAtHashTransactions: (hash, loadingStateUpdate, config = {}) => {
    if (!hash) {
      throw new Error('HeliumAPI.getBlockAtHashTransactions - hash is required');
    }

    return cursorData(instance, `/v1/blocks/hash/${hash}/transactions`, loadingStateUpdate, config);
  },

  // Accounts
  getAccounts: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/accounts', loadingStateUpdate, config);
  },

  getRichestAccounts: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/rich`, config);
    return instance.get(url);
  },

  getAccountForAddress: address => {
    if (!address) {
      throw new Error('HeliumAPI.getAccountForAddress - address is required');
    }

    return instance.get(`/v1/accounts/${address}`);
  },

  getHotspotsForAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotsForAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/hotspots`, loadingStateUpdate, config);
  },

  getValidatorsForAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorsForAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/validators`, loadingStateUpdate, config);
  },

  getOUIsForAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getOUIsForAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/ouis`, loadingStateUpdate, config);
  },

  getActivityForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getActivityForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/activity`, config);
    return instance.get(url);
  },

  getRolesForAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRolesForAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/roles`, loadingStateUpdate, config);
  },

  getRolesCountsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRolesCountsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/roles/count`, config);
    return instance.get(url);
  },

  getElectionsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getElectionsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/elections`, config);
    return instance.get(url);
  },

  getChallengesForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getChallengesForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/challenges`, config);
    return instance.get(url);
  },

  getPendingTransactionsForAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getPendingTransactionsForAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/pending-transactions`, loadingStateUpdate, config);
  },

  getRewardsForAnAccount: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForAnAccount - address is required');
    }

    return cursorData(instance, `/v1/accounts/${address}/rewards`, loadingStateUpdate, config);
  },

  getRewardsInRewardsBlockForAnAccount: (address, block) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsInRewardsBlockForAnAccount - address is required');
    }

    return instance.get(`/v1/accounts/${address}/rewards/${block}`);
  },

  getRewardsTotalForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsTotalForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/rewards/sum`, config);
    return instance.get(url);
  },

  getStatsForAccount: address => {
    if (!address) {
      throw new Error('HeliumAPI.getStatsForAccount - address is required');
    }

    return instance.get(`/v1/accounts/${address}/stats`);
  },

  // Validators
  getListValidators: () => {
    return instance.get('/v1/validators');
  },

  getValidatorForAddress: address => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorForAddress - address is required');
    }

    return instance.get(`/v1/validators/${address}`);
  },

  getValidatorsForName: name => {
    if (!name) {
      throw new Error('HeliumAPI.getValidatorsForName - name is required');
    }

    return instance.get(`/v1/validators/name/${name}`);
  },

  validatorNameSearch: search => {
    if (!search) {
      throw new Error('HeliumAPI.validatorNameSearch - search is required');
    }

    return instance.get(`/v1/validators/name?search=${search}`);
  },

  getValidatorActivity: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorActivity - address is required');
    }

    return cursorData(instance, `/v1/validators/${address}/activity`, loadingStateUpdate, config);
  },

  getValidatorRoles: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorRoles - address is required');
    }

    return cursorData(instance, `/v1/validators/${address}/roles`, loadingStateUpdate, config);
  },

  getValidatorRolesCounts: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorRolesCounts - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/validators/${address}/roles/count`, config);
    return instance.get(url);
  },

  getStatsForValidators: () => {
    return instance.get('/v1/validators/stats');
  },

  getCurrentlyElectedValidators: () => {
    return instance.get('/v1/validators/elected');
  },

  getElectedValidatorsAtBlock: height => {
    if (!height) {
      throw new Error('HeliumAPI.getElectedValidatorsAtBlock - height is required');
    }

    return instance.get(`/v1/validators/elected/${height}`);
  },

  getElectedValidatorsInElection: hash => {
    if (!hash) {
      throw new Error('HeliumAPI.getElectedValidatorsInElection - hash is required');
    }

    return instance.get(`/v1/validators/elected/hash/${hash}`);
  },

  getRewardsForValidator: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForValidator - address is required');
    }

    return cursorData(instance, `/v1/validators/${address}/rewards`, loadingStateUpdate, config);
  },

  getRewardTotalForValidator: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardTotalForValidator - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/validators/${address}/rewards/sum`, config);
    return instance.get(url);
  },

  // Wrong docs (?)
  // getRewardTotalForAllValidators: address => {
  //   return instance.get(`/v1/validators/:rewards/sum`);
  // }

  // Hotspots
  getListHotspots: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/hotspots', loadingStateUpdate, config);
  },

  getHotspotForAddress: address => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotForAddress - address is required');
    }

    return instance.get(`/v1/hotspots/${address}`);
  },

  getHotspotForName: name => {
    if (!name) {
      throw new Error('HeliumAPI.getHotspotForName - name is required');
    }

    return instance.get(`/v1/hotspots/name/${name}`);
  },

  hotspotNameSearch: search => {
    if (!search) {
      throw new Error('HeliumAPI.hotspotNameSearch - search is required');
    }

    return instance.get(`/v1/hotspots/name?search=${search}`);
  },

  hotspotLocationDistanceSearch: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/location/distance`, config);
    return instance.get(url);
  },

  hotspotLocationBoxSearch: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/location/box`, config);
    return instance.get(url);
  },

  getHotspotsForH3Index: h3index => {
    if (!h3index) {
      throw new Error('HeliumAPI.getHotspotsForH3Index - h3index is required');
    }

    return instance.get(`/v1/hotspots/hex/${h3index}`);
  },

  getHotspotActivity: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotActivity - address is required');
    }

    return cursorData(instance, `/v1/hotspots/${address}/activity`, loadingStateUpdate, config);
  },

  getHotspotRoles: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotRoles - address is required');
    }

    return cursorData(instance, `/v1/hotspots/${address}/roles`, loadingStateUpdate, config);
  },

  getHotspotRolesCount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotRolesCount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/roles/count`, config);
    return instance.get(url);
  },

  getHotspotElections: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotElections - address is required');
    }

    return cursorData(instance, `/v1/hotspots/${address}/elections`, loadingStateUpdate, config);
  },

  getCurrentlyElectedHotspots: () => {
    return instance.get('/v1/hotspots/elected');
  },

  getHotspotChallenges: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotChallenges - address is required');
    }

    return cursorData(instance, `/v1/hotspots/${address}/challenges`, loadingStateUpdate, config);
  },

  getRewardsForHotspot: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForHotspot - address is required');
    }

    return cursorData(instance, `/v1/hotspots/${address}/rewards`, loadingStateUpdate, config);
  },

  getRewardsInRewardsBlockForHotspot: (address, block) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsInRewardsBlockForHotspot - address is required');
    }

    return instance.get(`/v1/hotspots/${address}/rewards/${block}`);
  },

  getTotalRewardsForHotspot: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getTotalRewardForHotspot - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/rewards/sum`, config);
    return instance.get(url);
  },

  getWitnessesForHotspot: address => {
    if (!address) {
      throw new Error('HeliumAPI.getWitnessesForHotspot - address is required');
    }

    return instance.get(`/v1/hotspots/${address}/witnesses`);
  },

  getWitnessedForHotspot: address => {
    if (!address) {
      throw new Error('HeliumAPI.getWitnessedForHotspot - address is required');
    }

    return instance.get(`/v1/hotspots/${address}/witnessed`);
  },

  // Cities
  getHotspotCities: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/hotspots/cities', loadingStateUpdate, config);
  },

  getCityForCityID: cityID => {
    if (!cityID) {
      throw new Error('HeliumAPI.getCityForCityID - cityID is required');
    }

    return instance.get(`/v1/cities/${cityID}`);
  },

  getHotspotForCity: (cityID, loadingStateUpdate, config = {}) => {
    if (!cityID) {
      throw new Error('HeliumAPI.getHotspotForCity - cityID is required');
    }

    return cursorData(instance, `/v1/cities/${cityID}/hotspots`, loadingStateUpdate, config);
  },

  // Locations
  getLocation: location => {
    if (!location) {
      throw new Error('HeliumAPI.getLocation - location is required');
    }

    return instance.get(`/v1/locations/${location}`);
  },

  // Transactions
  getTransactionForHash: hash => {
    if (!hash) {
      throw new Error('HeliumAPI.getTransactionForHash - hash is required');
    }

    return instance.get(`/v1/transactions/${hash}`);
  },

  // Pending Transactions
  getPendingTransactionStatus: hash => {
    if (!hash) {
      throw new Error('HeliumAPI.getPendingTransactionStatus - hash is required');
    }

    return instance.get(`/v1/pending_transactions/${hash}`);
  },

  // unnecessary
  // submitNewTransaction: hash => {
  //   return instance.post(`/v1/pending_transactions/${hash}`)
  // },

  // Oracle Prices
  getOraclePrice: () => {
    return instance.get('/v1/oracle/prices/current');
  },

  getCurrentAndHistoricalOraclePrices: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/oracle/prices', loadingStateUpdate, config);
  },

  getOraclePriceStats: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/oracle/prices/stats`, config);
    return instance.get(url);
  },

  getOraclePriceAtSpecificBlock: block => {
    if (!block) {
      throw new Error('HeliumAPI.getOraclePriceAtSpecificBlock - block is required');
    }

    return instance.get(`/v1/oracle/prices/${block}`);
  },

  getListOracleActivity: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/oracle/activity', loadingStateUpdate, config);
  },

  getListActivityForSpecificOracle: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getListActivityForSpecificOracle - address is required');
    }

    return cursorData(instance, `/v1/oracle/activity/${address}`, loadingStateUpdate, config);
  },

  getPredictedHNTOraclePrices: () => {
    return instance.get('/v1/oracle/predictions');
  },

  // Chain Variables
  getChainVariables: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/vars`, config);
    return instance.get(url);
  },

  getValueOfChainVariable: name => {
    if (!name) {
      throw new Error('HeliumAPI.getValueOfChainVariable - name is required');
    }

    return instance.get(`/v1/vars/${name}`);
  },

  getListChainVariableActivity: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/vars/activity`, config);
    return instance.get(url);
  },

  // OUIs
  getListOUIs: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/ouis', loadingStateUpdate, config);
  },

  getOUI: oui => {
    if (!oui) {
      throw new Error('HeliumAPI.getOUI - oui is required');
    }

    return instance.get(`/v1/ouis/${oui}`);
  },

  getLastAssignedOUI: () => {
    return instance.get('/v1/ouis/last');
  },

  getOUIStats: () => {
    return instance.get('/v1/ouis/stats');
  },

  // Rewards
  getRewardsTotal: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/rewards/sum`, config);
    return instance.get(url);
  },

  // DC Burns
  getDCBurnsTotal: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/dc_burns/sum`, config);
    return instance.get(url);
  },

  getDCBurnStats: () => {
    return instance.get('/v1/dc_burns/stats');
  },

  getDCBurnEvents: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/dc_burns', loadingStateUpdate, config);
  },

  // Challenges
  getListChallengeReceipts: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/challenges', loadingStateUpdate, config);
  },

  // Elections
  getListElections: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/elections', loadingStateUpdate, config);
  },

  // State Channels
  getStateChannelCloses: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/state_channel_closes', loadingStateUpdate, config);
  },

  // Assert Locations
  getListAssertLocations: (loadingStateUpdate, config = {}) => {
    return cursorData(instance, '/v1/assert_locations', loadingStateUpdate, config);
  }
};

export default HeliumAPI;
