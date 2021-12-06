import Vue from 'vue';
import Vuex from 'vuex';
import getters from '@/store/getters';
import actions from '@/store/actions';
import mutations from '@/store/mutations';
import defaultState from './default.json';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        ...defaultState,
        users: undefined,
        ambientdata: [],
        ambientdatalabel: [],
    },
    modules: {},
    getters: {
        getAmbientData: (state) => {
            return state.ambientdata;
        },
        getAmbientDataLabel: (state) => {
            return state.ambientdatalabel;
        }
    },
    actions,
    mutations: {
        addData: (state, payload) => {
            state.ambientdata.push(payload.data);
            state.ambientdatalabel.push(payload.label);
        },
        replaceData: (state, payload) => {
            state.ambientdata = payload;
        }
    },
});
