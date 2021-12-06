<template>
    <div class="about">
        <h1>This is an about page</h1>

        <v-container>
            <v-row>
                <v-col>
                    <v-select
                        v-model="selectedDevice"
                        :items="deviceId"
                        label="select device"
                        item-text="deviceName"
                        item-value="value"
                        return-object
                        @change="queryData"
                    ></v-select>
                </v-col>
                <v-col>
                    <v-select
                        v-model="selectedField"
                        :items="fields"
                        label="select field"
                        @change="queryData"
                    ></v-select>
                </v-col>
                <v-col>
                    <v-text-field
                        v-model="timeStart"
                        type="datetime-local"
                        label="time start"
                        @change="queryData"
                    >
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        v-model="timeStop"
                        type="datetime-local"
                        label="time stop"
                        @change="queryData"
                    >
                    </v-text-field>
                </v-col>
                <v-col>
                    <input type="checkbox" id="checkbox" v-model="realtime" />
                    <label for="checkbox">Real time data</label>
                </v-col>
                <v-col cols="1">
                    <v-btn rounded block dark large v-on:click="queryData">Query</v-btn>
                </v-col>
            </v-row>
            <v-col>
                <Chart ref="dataChart" />
                <div class="justify-center">
                    <v-col> Selected: {{ selected }}</v-col>
                </div>
            </v-col>
        </v-container>
    </div>
</template>
<script>
import Chart from '../components/Chart';

export default {
    data: () => ({
        deviceId: [
            { value: '1', deviceName: 'dummy-device-1' },
            { value: '2', deviceName: 'dummy-device-2' },
            { value: '3', deviceName: 'dummy-device-3' },
        ],
        fields: ['temperature', 'humidity', 'both'],
        selectedDevice: null,
        selectedField: '',
        selected: '',
        timeStart: '1970-01-01T00:00:00',
        timeStop: '1970-01-01T00:00:00',
        realtime: false,
    }),
    components: {
        Chart,
    },
    methods: {
        queryData() {
            this.$store.commit('addData', {
                data: 10,
                label: 'test',
            });

            const http = require('http');
            const options = {
                hostname: 'localhost',
                port: 8000,
                path: `/ambient-device-${this.selectedDevice.value}/${
                    this.selectedField == 'both' ? '' : this.selectedField + '/'
                }${Date.parse(this.timeStart)}/${Date.parse(this.timeStop)}`,
                method: 'GET',
            };
            console.log(options.path);

            const req = http.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', (d) => {
                    this.$refs.dataChart.test(d, this.selectedField);
                });
            });
            req.on('error', (error) => {
                console.error(error);
            });
            req.end();
            // this.selected = `${Date.now()} ${this.selectedDevice.value} ${this.selectedField} ${Date.parse(this.timeStart)}`;
        },
    },
};
</script>