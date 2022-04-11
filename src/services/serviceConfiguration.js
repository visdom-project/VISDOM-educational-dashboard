/* eslint-disable no-undef */
const elasticsearchHost = process.env.REACT_APP_ELASTICSEARCH_HOST;
const configurationHost = process.env.REACT_APP_CONFIG_HOST;
const adapterHost = process.env.REACT_APP_ADAPTER_HOST;

export const ElasticSearchConfiguration = {
  host: elasticsearchHost,
  createUrl: function (url) {
    return elasticsearchHost + "/" + url;
  },
};

export const configConfiguration = {
  host: configurationHost,
  createUrl: function (url) {
    return configurationHost + "/" + url;
  },
};

export const AdapterConfiguration = {
  host: adapterHost,
  createUrl: function (url) {
    return adapterHost + "/" + url;
  },
};

