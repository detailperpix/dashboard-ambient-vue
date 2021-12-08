<template>
    <v-container>
        <v-row>
            <v-col>
                <v-btn @click="incCount">Click me to increment by 1</v-btn>
            </v-col>
            <v-spacer />
            <v-col>
                <v-btn @click="incCount({ count: 5 })">Click me to increment by 5</v-btn>
            </v-col>
            <v-spacer />
            <v-col>Here's the running count: {{ getCount }}</v-col>
            <v-spacer />
            <v-col>And here's the count multiplied by 10: {{ getCountMutl10 }}</v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn @click="refreshCache">Click here to refresh the store</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>Now here's the users taken from reqres.in</v-col>
            <v-spacer />
            <v-col>{{ getUsers }}</v-col>
        </v-row>
        <v-row>
            <v-col>
                <HelloWorld />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import HelloWorld from '../components/HelloWorld';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Home',

    components: {
        HelloWorld,
    },

    computed: {
        ...mapGetters(['getCount', 'getCountMutl10', 'getUsers']),
    },

    methods: {
        ...mapActions(['incCount', 'refreshCache']),
    },
};
</script>
