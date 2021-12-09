<template>
    <div>
        <canvas id="dataChart" height="500" width="1200"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
const data = {
    labels: [],
    datasets: [
        {
            label: `Ambient data`,
            backgroundColor: 'navy',
            borderColor: 'darkcyan',
            data: [],
        },
    ],
};
const config = {
    type: 'line',
    data: data,
    options: {
        animation: false,
        scales: {
            xAxes: {
                display: true,
                type: 'time',
                time: {
                    parser: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
                    unit: 'second',
                    unitStepSize: 5,
                },
            },
            humidity: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'humidity',
                    color: 'navy',
                },
            },
            temperature: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'temperature',
                    color: 'red',
                },
            },
        },
        tooltip: {
            enabled: true,
        },
    },
};
export default {
    name: 'Chart',
    data: () => ({
        chart: null,
        data: data,
        config: config,
    }),
    mounted() {
        this.chart = new Chart(document.getElementById('dataChart'), config);
    },
    methods: {
        updateChart(message, field) {
            console.log('Rendering chart');
            const parsedMessage = JSON.parse(message);
            this.data.labels = [];
            this.data.datasets = [
                {
                    label: 'humidity',
                    yAxisID: 'humidity',
                    backgroundColor: 'navy',
                    borderColor: 'lightblue',
                    data: [],
                    hidden: false,
                },
                {
                    label: 'temperature',
                    yAxisID: 'temperature',
                    backgroundColor: 'red',
                    borderColor: 'pink',
                    data: [],
                    hidden: false,
                },
            ];

            parsedMessage.forEach((data) => {
                this.data.labels.push(data.time);
                if (data.field) {
                    this.data.datasets.forEach((dataset) => {
                        if (dataset.label == data.field) {
                            dataset.data.push(data.value);
                        }
                    });
                } else {
                    this.data.datasets.forEach((dataset) => {
                        dataset.data.push(data.value);
                    });
                }
            });
            // this.chart.update();
            this.updateField(field);
        },
        updateField(field) {
            this.data.datasets.forEach((dataset) => {
                dataset.hidden = dataset.label != field && field != 'both';
            });
            this.chart.update();
        },
    },
};
</script>

<style></style>
