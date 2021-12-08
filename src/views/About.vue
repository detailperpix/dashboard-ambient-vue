<template>
    <div class="about">
        <v-container>
            <v-row justify="center">
                <h1 style="align-center">Ambient Chart</h1>
            </v-row>

            <v-row>
                <v-col>
                    <v-row>
                        <v-select
                            v-model="selectedDevice"
                            :items="deviceId"
                            label="select device"
                            item-text="deviceName"
                            item-value="value"
                            return-object
                        ></v-select>
                    </v-row>

                    <v-row>
                        <v-select
                            v-model="selectedField"
                            :items="fields"
                            label="select field"
                            @change="changeField"
                        >
                        </v-select
                    ></v-row>
                </v-col>

                <v-col>
                    <v-row>
                        <v-text-field
                            :disabled="realtime"
                            v-model="timeStart"
                            type="datetime-local"
                            label="time start"
                            @change="timeStartUpdateRange"
                        >
                        </v-text-field>
                        <v-text-field
                            :disabled="realtime"
                            v-model="timeStop"
                            type="datetime-local"
                            label="time stop"
                            @change="timeStopUpdateRange"
                        >
                        </v-text-field>
                    </v-row>
                </v-col>
                <v-col>
                    <v-select
                        v-model="timeRange"
                        :items="timeRangeOptions"
                        label="time range(minutes)"
                        item-text="desc"
                        item-value="value"
                        @change="timeStartUpdateRange"
                        return-object
                    >
                    </v-select>
                </v-col>
                <v-col align-self="center">
                    <input type="checkbox" id="checkbox" v-model="realtime" />
                    <label for="checkbox">Real time data</label>
                </v-col>
                <v-col cols="1">
                    <v-btn rounded block dark large v-on:click="queryData">Query</v-btn>
                </v-col>
            </v-row>
            <v-col>
                <Chart ref="dataChart" />
            </v-col>
            <v-row style="margin: 1em auto 0 auto">
                <h2>Dummy device latest update:</h2>
            </v-row>
            <div style="padding: 1em 1em">
                <br />
                <v-row>
                    <p>
                        dummy-device-1: <em> {{ this.deviceLatestTime[0] }} </em>
                    </p>
                </v-row>
                <v-row>
                    <p>
                        dummy-device-2: <em> {{ this.deviceLatestTime[1] }} </em>
                    </p>
                </v-row>
                <v-row>
                    <p>
                        dummy-device-3: <em> {{ this.deviceLatestTime[2] }} </em>
                    </p>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<script>
import Chart from '../components/Chart.vue';
import io from 'socket.io-client';
const ioInstance = io('http://localhost:8000');

const TIME_STOP = 0;
const TIME_START = 1;

export default {
    data: () => ({
        deviceId: [
            { value: '1', deviceName: 'dummy-temp-1' },
            { value: '2', deviceName: 'dummy-temp-2' },
            { value: '3', deviceName: 'dummy-temp-3' },
        ],
        fields: ['temperature', 'humidity', 'both'],
        selectedDevice: { value: '-1', deviceName: '' },
        selectedField: 'both',
        selected: '',
        timeStart: '1970-01-01T00:00:00',
        timeStop: '1970-01-01T00:00:00',
        realtime: false,
        deviceLatestTime: ['-', '-', '-'],
        timeRange: { value: '1', desc: '1 minute' },
        timeRangeOptions: [
            { value: '1', desc: '1 minute' },
            { value: '5', desc: '5 minutes' },
            { value: '15', desc: '15 minutes' },
            { value: '30', desc: '30 minutes' },
        ],
    }),
    components: {
        Chart,
    },
    created: function () {
        console.log('Emitter on');
        ioInstance.on('newdata', (msg) => {
            console.log('Received newdata');
            const msgId = Number(msg[msg.length - 1]);
            this.$set(this.deviceLatestTime, msgId - 1, new Date().toString());
            if (msgId == this.selectedDevice.value) {
                this.queryData();
            }
        });
    },
    methods: {
        queryData() {
            let rangeStart = Date.parse(this.timeStart);
            let rangeStop = Date.parse(this.timeStop);

            // change the time query if realtime
            if (this.realtime) {
                rangeStart = Date.now() - Number(this.timeRange.value) * 60 * 1000;
                rangeStop = '';
            }
            const http = require('http');
            const options = {
                hostname: 'localhost',
                port: 8000,
                path: `/ambient-device-${this.selectedDevice.value}/both/${rangeStart}/${rangeStop}`,  // !this.realtime ? rangeStop : ''

                method: 'GET',
            };

            const req = http.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', (d) => {
                    this.$refs.dataChart.updateChart(d, this.selectedField);
                });
            });
            req.on('error', (error) => {
                console.error(error);
            });

            req.end();
        },
        timeStopUpdateRange() {
            this.updateRange(TIME_STOP);
        },
        timeStartUpdateRange() {
            this.updateRange(TIME_START);
        },
        updateRange(caller) {
            const parsedTimeStart = Date.parse(this.timeStart);
            const parsedTimeStop = Date.parse(this.timeStop);
            const range = this.timeRange.value * 60 * 1000;

            let newDate;
            if (caller == TIME_STOP) {
                newDate = new Date(parsedTimeStop - range);
            } else {
                newDate = new Date(parsedTimeStart + range);
            }
            const year = newDate.getFullYear();
            const month =
                newDate.getMonth() + 1 < 10
                    ? '0' + (newDate.getMonth() + 1)
                    : newDate.getMonth() + 1;
            const date = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
            const hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
            const mins =
                newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();

            const newTime = `${year}-${month}-${date}T${hours}:${mins}:00`;
            if (caller == TIME_STOP) {
                this.timeStart = newTime;
            } else {
                this.timeStop = newTime;
            }
        },
        changeField() {
            this.$refs.dataChart.updateField(this.selectedField);
        },
    },
};
</script>
