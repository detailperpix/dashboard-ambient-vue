export default {
    incCount(state, count) {
        state.count += count;
    },

    users(state, users) {
        state.users = users;
    },

    resetState(state) {
        Object.assign(state, { count: 0 });
    },
};
