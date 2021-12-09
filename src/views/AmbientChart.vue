<template>
    <div class="ambient">
        <v-toolbar dark>
            <v-row>
                <h1>Ambient Data Chart</h1>
            </v-row>
        </v-toolbar>
        <v-spacer> </v-spacer>
        <v-container style="margin: 1em auto">
            <v-row>
                <v-col>
                    <v-row>
                        <v-select
                            v-model="selectedDevice"
                            :items="deviceId"
                            label="Device"
                            item-text="deviceName"
                            item-value="value"
                            return-object
                        ></v-select>
                    </v-row>

                    <v-row>
                        <v-select
                            v-model="selectedField"
                            :items="fields"
                            label="Field"
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
                            label="Time start"
                            @change="timeStartUpdateRange"
                        >
                        </v-text-field>
                        <v-text-field
                            :disabled="realtime"
                            v-model="timeStop"
                            type="datetime-local"
                            label="Time stop"
                            @change="timeStopUpdateRange"
                        >
                        </v-text-field>
                    </v-row>
                </v-col>
                <v-col>
                    <v-select
                        v-model="timeRange"
                        :items="timeRangeOptions"
                        label="Time range"
                        item-text="desc"
                        item-value="value"
                        @change="timeStartUpdateRange"
                        return-object
                    >
                    </v-select>
                </v-col>
                <v-col align-self="center">
                    <v-checkbox v-model="realtime" label="Real time data"> </v-checkbox>
                </v-col>
                <v-col cols="1">
                    <v-btn rounded block dark large v-on:click="queryData">Query</v-btn>
                </v-col>
            </v-row>
            <v-col>
                <Chart ref="dataChart" />
            </v-col>
            <v-row style="margin: 1em auto 0 auto">
                <h2>Status:</h2>
            </v-row>
            <v-col>
                <v-card>
                    <v-card-title> dummy-device-1 </v-card-title>
                    <v-card-text>
                        <ul style="list-style-type: none">
                            <li><strong> Last updated: </strong>{{ this.deviceLatestTime[0] }}</li>
                            <li><strong> Temperature: </strong>{{ this.deviceLatestTemp[0] }}</li>
                            <li><strong> Humidity: </strong>{{ this.deviceLatestHumidity[0] }}</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-title> dummy-device-2 </v-card-title>
                    <v-card-text>
                        <ul style="list-style-type: none">
                            <li><strong> Last updated: </strong>{{ this.deviceLatestTime[1] }}</li>
                            <li><strong> Temperature: </strong>{{ this.deviceLatestTemp[1] }}</li>
                            <li><strong> Humidity: </strong>{{ this.deviceLatestHumidity[1] }}</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-title> dummy-device-3 </v-card-title>
                    <v-card-text>
                        <ul style="list-style-type: none">
                            <li><strong> Last updated: </strong>{{ this.deviceLatestTime[2] }}</li>
                            <li><strong> Temperature: </strong>{{ this.deviceLatestTemp[2] }}</li>
                            <li><strong> Humidity: </strong>{{ this.deviceLatestHumidity[2] }}</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
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
        deviceLatestHumidity: ['-', '-', '-'],
        deviceLatestTemp: ['-', '-', '-'],
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
            this.updateLatestDeviceData(msg);
            const deviceId = msg.deviceId;
            const msgId = Number(deviceId[deviceId.length - 1]);
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
                path: `/ambient-device-${this.selectedDevice.value}/both/${rangeStart}/${rangeStop}`, // !this.realtime ? rangeStop : ''

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
        updateLatestDeviceData(data) {
            const msgId = data.deviceId;
            const deviceId = Number(msgId[msgId.length - 1]) - 1;
            const date = new Date();
            date.setTime(data.timestamp);

            this.$set(this.deviceLatestTime, deviceId, date.toString());
            this.$set(this.deviceLatestHumidity, deviceId, data.humidity);
            this.$set(this.deviceLatestTemp, deviceId, data.temperature);
        },
    },
};
</script>
