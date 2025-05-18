<template>
  <div class="box-mixedChart">
    <VueApexCharts type="line" height="100%" :options="chartOptions" :series="props.series" /> </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'; // [cite: 98]
import { withDefaults, defineProps, computed } from 'vue'; // [cite: 98]
import type { ApexOptions } from 'apexcharts';

const props = withDefaults(defineProps<{ // [cite: 100]
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ApexOptions;
}>(), {
  options: () => ({}) // Proporcionar un valor por defecto vacío
});

// Opciones por defecto combinadas con las props [cite: 101]
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'line',
    stacked: false,
    background: 'transparent', // [cite: 101]
    toolbar: { show: true },
    zoom: { enabled: true }
  },
  theme: { // [cite: 101]
    mode: 'dark',
    palette: 'palette1',
  },
  title: { // [cite: 101]
    text: props.options?.title?.text || 'Mixed Chart',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#8C8C8C',
    },
  },
  stroke: { // [cite: 101]
    width: [0, 2, 4],
    curve: 'smooth'
  },
  plotOptions: { // [cite: 101]
    bar: {
      columnWidth: '50%'
    }
  },
  fill: { // [cite: 101]
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100],
    }
  },
  labels: props.options?.labels || [ // [cite: 101]
    '01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
  ],
  markers: { size: 0 }, // [cite: 101]
  xaxis: { // [cite: 101]
    type: 'datetime',
    labels: { style: { colors: '#8C8C8C'} } // [cite: 102]
  },
  yaxis: { // [cite: 102]
    labels: { style: {colors: '#8C8C8C'}},
    title: {
      text: 'Points',
      style: { color: '#BCBCBC', fontWeight: 'normal' } // [cite: 102]
    },
  },
  tooltip: { // [cite: 102]
    enabled: true,
    shared: true,
    theme: 'dark', // [cite: 103]
    intersect: false,
    y: {
      formatter: (y: number | null) => y !== null ? `${y.toFixed(0)} points` : '-' // [cite: 103]
    }
  },
  grid: { // [cite: 102]
    show: true,
    borderColor: '#555',
  },
  legend: { // [cite: 102]
    position: 'top'
  },
  ...props.options // Permite sobreescribir o añadir opciones específicas
}));
</script>

<style scoped> /* [cite: 105] */
.box-mixedChart {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 290px; /* Como en el PDF */
  width: 100%;
  padding: 16px; /* [cite: 106] */
}
</style>