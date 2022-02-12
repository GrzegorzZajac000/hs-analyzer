import axios from 'axios';
import URLBuilder from '../utilities/URLBuilder';
import * as rax from 'retry-axios';

const instance = axios.create({
  baseURL: 'https://api.helium.io',
  timeout: 60000,
  headers: {
    'Cache-Control': 'max-age=60'
  }
});

instance.defaults.raxConfig = {
  instance,
  retry: 3,
  statusCodesToRetry: [[100, 199], [429, 429], [500, 599]]
};
rax.attach(instance);

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

  getBLockDescriptions: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/blocks`, config);
    return instance.get(url);
  },

  getBlockAtHeight: height => {
    if (!height) {
      throw new Error('HeliumAPI.getBlockAtHeight - height is required');
    }

    return instance.get(`/v1/blocks/${height}`);
  },

  getBlockAtHeightTransactions: (height, config = {}) => {
    if (!height) {
      throw new Error('HeliumAPI.getBlockAtHeightTransactions - height is required');
    }

    const url = URLBuilder(`/v1/blocks/${height}/transactions`, config);
    return instance.get(url);
  },

  getBlockAtHash: hash => {
    if (!hash) {
      throw new Error('HeliumAPI.getBlockAtHash - hash is required');
    }

    return instance.get(`/v1/blocks/hash/${hash}`);
  },

  getBlockAtHashTransactions: (hash, config = {}) => {
    if (!hash) {
      throw new Error('HeliumAPI.getBlockAtHashTransactions - hash is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/blocks/hash/${hash}/transactions`, config);
    return instance.get(url);
  },

  // Accounts
  getAccounts: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts`, config);
    return instance.get(url);
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

  getHotspotsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/hotspots`, config);
    return instance.get(url);
  },

  getValidatorsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/validators`, config);
    return instance.get(url);
  },

  getOUIsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getOUIsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/ouis`, config);
    return instance.get(url);
  },

  getActivityForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getActivityForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/activity`, config);
    return instance.get(url);
  },

  getActivityCountsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getActivityCountsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/activity/count`, config);
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

  getPendingTransactionsForAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getPendingTransactionsForAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/pending_transactions`, config);
    return instance.get(url);
  },

  getRewardsForAnAccount: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForAnAccount - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/accounts/${address}/rewards`, config);
    return instance.get(url);
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

  getValidatorActivity: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorActivity - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/validators/${address}/activity`, config);
    return instance.get(url);
  },

  getValidatorActivityCounts: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getValidatorActivityCounts - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/validators/${address}/activity/count`, config);
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

  getRewardsForValidator: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForValidator - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/validators/${address}/rewards`, config);
    return instance.get(url);
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
  getListHotspots: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots`, config);
    return instance.get(url);
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

  getHotspotActivity: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotActivity - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/activity`, config);
    return instance.get(url);
  },

  getHotspotActivityAllData: (address, loadingStateUpdate, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotActivity - address is required');
    }

    const data = [];
    let url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/activity`, config);

    return instance.get(url)
      .then(async res => {
        data.push(res.data.data);

        if (loadingStateUpdate && typeof loadingStateUpdate === 'function') {
          loadingStateUpdate(data.flat().length);
        }

        while (res.data.cursor) {
          url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/activity?cursor=${res.data.cursor}`, config);
          res = await instance.get(url);
          data.push(res.data.data);

          if (loadingStateUpdate && typeof loadingStateUpdate === 'function') {
            loadingStateUpdate(data.flat().length);
          }
        }

        return data.flat();
      })
  },

  getHotspotActivityCounts: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotActivityCounts - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/activity/count`, config);
    return instance.get(url);
  },

  getHotspotElections: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotElections - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/elections`, config);
    return instance.get(url);
  },

  getCurrentlyElectedHotspots: () => {
    return instance.get('/v1/hotspots/elected');
  },

  getHotspotChallenges: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getHotspotChallenges - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/challenges`, config);
    return instance.get(url);
  },

  getRewardsForHotspot: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsForHotspot - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/hotspots/${address}/rewards`, config);
    return instance.get(url);
  },

  getRewardsInRewardsBlockForHotspot: (address, block) => {
    if (!address) {
      throw new Error('HeliumAPI.getRewardsInRewardsBlockForHotspot - address is required');
    }

    return instance.get(`/v1/hotspots/${address}/rewards/${block}`);
  },

  getTotalRewardForHotspot: (address, config = {}) => {
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
  getHotspotCities: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/cities`, config);
    return instance.get(url);
  },

  getCityForCityID: cityID => {
    if (!cityID) {
      throw new Error('HeliumAPI.getCityForCityID - cityID is required');
    }

    return instance.get(`/v1/cities/${cityID}`);
  },

  getHotspotForCity: (cityID, config = {}) => {
    if (!cityID) {
      throw new Error('HeliumAPI.getHotspotForCity - cityID is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/cities/${cityID}/hotspots`, config);
    return instance.get(url);
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

  getCurrentAndHistoricalOraclePrices: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/oracle/prices`, config);
    return instance.get(url);
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

  getListOracleActivity: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/oracle/activity`, config);
    return instance.get(url);
  },

  getListActivityForSpecificOracle: (address, config = {}) => {
    if (!address) {
      throw new Error('HeliumAPI.getListActivityForSpecificOracle - address is required');
    }

    const url = URLBuilder(`${instance.defaults.baseURL}/v1/oracle/${address}/activity`, config);
    return instance.get(url);
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
  getListOUIs: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/ouis`, config);
    return instance.get(url);
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

  getDCBurnEvents: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/dc_burns`, config);
    return instance.get(url);
  },

  // Challenges
  getListChallengeReceipts: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/challenges`, config);
    return instance.get(url);
  },

  // Elections
  getListElections: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/elections`, config);
    return instance.get(url);
  },

  // State Channels
  getStateChannelCloses: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/state_channels`, config);
    return instance.get(url);
  },

  // Assert Locations
  getListAssertLocations: (config = {}) => {
    const url = URLBuilder(`${instance.defaults.baseURL}/v1/assert_locations`, config);
    return instance.get(url);
  }
};

export default HeliumAPI;
