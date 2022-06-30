// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

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

export const AdapterConfiguration = {
  host: adapterHost,
  createUrl: function (url) {
    return adapterHost + "/" + url;
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

