import api from '@/interfaces/api';

export default {
    async incCount(state, params = {}) {
        const { count = 1 } = params;
        state.commit('incCount', count);
    },

    async getUsers(state) {
        const users = await api.users();
        state.commit('users', users);
    },

    refreshCache(state) {
        state.commit('resetState');
    },
};
