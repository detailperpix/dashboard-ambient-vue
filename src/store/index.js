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
    },
    modules: {},
    getters,
    actions,
    mutations,
});
