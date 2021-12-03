import store from './index';

export default {
    getCount(state) {
        return state.count;
    },

    getCountMutl10(state) {
        return state.count * 10;
    },

    getUsers(state) {
        if (!state.users) {
            store.dispatch('getUsers');
            return 'Waiting for data...';
        }
        return state.users;
    },
};
