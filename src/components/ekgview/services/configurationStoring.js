// Copyright 2022 Tampere University
// This software was developed as a part of the VISDOM project: https://iteavisdom.org/
// This source code is licensed under the MIT license. See LICENSE in the repository root directory.
// Author(s): Duc Hong <duc.hong@tuni.fi>, Nhi Tran <thuyphuongnhi.tran@tuni.fi>, Sulav Rayamajhi<sulav.rayamajhi@tuni.fi>, Ville Heikkilä <ville.heikkila@tuni.fi>, Vivian Lunnikivi <vivian.lunnikivi@tuni.fi>.

import axios from "axios";
import { configConfiguration } from "../../../services/serviceConfiguration";

const MICROFRONTEND_KEY = "ekgview";

// eslint-disable-next-line no-undef
const baseUrl = configConfiguration.createUrl(`v1/configurations/${MICROFRONTEND_KEY}`);

export const getConfigurationsList = () => {
    return axios.get(baseUrl).then(response => response.data);
};

export const getConfiguration = (configName) => {
    const requestConfig = {
        headers:{
            "config-name": configName,
        }
    };
    return axios.get(baseUrl, requestConfig).then(response => response.data);
};

export const createConfig = (configName, config) => {
    const data = {
        name: configName,
        config: config,
    };
    return axios.post(baseUrl, data).then(response => response.data);
};

export const modifyConfig = (configName, config) => {
    const data = {
        name: configName,
        config: config,
    };
    return axios.put(baseUrl, data).then(response => response.data);
}