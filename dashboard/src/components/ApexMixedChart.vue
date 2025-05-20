<template>
  <div class="box-mixedChart">
    <VueApexCharts type="line" height="100%" :options="chartOptions" :series="props.series" /> </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { withDefaults, defineProps, computed } from 'vue';
import type { ApexOptions } from 'apexcharts';

const props = withDefaults(defineProps<{
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ApexOptions;
}>(), {
  options: () => ({}) // Proporcionar un valor por defecto vacío
});

// Opciones por defecto combinadas con las props
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'line',
    stacked: false,
    background: 'transparent',
    toolbar: { show: true },
    zoom: { enabled: true }
  },
  theme: {
    mode: 'dark',
    palette: 'palette1',
  },
  title: {
    text: props.options?.title?.text || 'Mixed Chart',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#8C8C8C',
    },
  },
  stroke: {
    width: [0, 2, 4],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },
  fill: {
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
  labels: props.options?.labels || [
    '01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
  ],
  markers: { size: 0 },
  xaxis: {
    type: 'datetime',
    labels: { style: { colors: '#8C8C8C'} }
  },
  yaxis: {
    labels: { style: {colors: '#8C8C8C'}},
    title: {
      text: 'Points',
      style: { color: '#BCBCBC', fontWeight: 'normal' }
    },
  },
  tooltip: {
    enabled: true,
    shared: true,
    theme: 'dark',
    intersect: false,
    y: {
      formatter: (y: number | null) => y !== null ? `${y.toFixed(0)} points` : '-'
    }
  },
  grid: {
    show: true,
    borderColor: '#555',
  },
  legend: {
    position: 'top'
  },
  ...props.options // Permite sobreescribir o añadir opciones específicas
}));
</script>

<style scoped>
.box-mixedChart {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 290px; /* Altura mínima base */
  width: 100%;
  padding: 16px;
}

/* Ajustes responsivos para diferentes tamaños de pantalla */
@media (max-width: 768px) {
  .box-mixedChart {
    min-height: 350px; /* Mayor altura en pantallas medianas para mejor lectura */
  }
}

@media (max-width: 480px) {
  .box-mixedChart {
    min-height: 400px; /* Aún más altura en pantallas pequeñas */
    padding: 12px 8px; /* Reducir padding horizontal para aprovechar espacio */
  }
}
</style>