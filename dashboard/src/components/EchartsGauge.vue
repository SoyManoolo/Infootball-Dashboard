<template>
  <VEChart class="gauge-chart" :option="options" autoresize /> </template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from 'vue'; // [cite: 127] (onMounted no es necesario aquí como en el Geomap)
import { use } from "echarts/core"; // [cite: 116]
import { GaugeChart } from "echarts/charts"; // [cite: 116]
import { CanvasRenderer } from "echarts/renderers"; // [cite: 116]
import { TooltipComponent } from "echarts/components"; // [cite: 117]
import VEChart from "vue-echarts"; // [cite: 116]

use([GaugeChart, CanvasRenderer, TooltipComponent]); // [cite: 117]

const props = defineProps<{ value: number, title?: string }>(); // [cite: 125]

const options = ref({}); // [cite: 127]

watchEffect(() => { // [cite: 127, 130]
  options.value = {
    series: [ // [cite: 127]
      {
        type: 'gauge', // [cite: 128, 132]
        center: ['50%', '55%'], // [cite: 128, 132]
        radius: '95%', // [cite: 128, 132]
        min: 0, // [cite: 128, 133]
        max: 100, // [cite: 128, 133]
        axisLine: { // [cite: 128]
          lineStyle: {
            width: 20,
            color: [ // [cite: 128, 133]
              [0.2, "#ff4d4d"],
              [0.69, "#ffa500"], // PDF dice 0.79, pero el color cambia a naranja en 0.69
              [1, "#4caf50"],
            ]
          }
        },
        pointer: { itemStyle: { color: 'auto' }, length: '60%' }, // [cite: 128, 133]
        axisTick: { distance: -20, length: 4, lineStyle: { color: '#fff', width: 1 } }, // [cite: 128, 133]
        splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 2 } }, // [cite: 128]
        axisLabel: { // [cite: 128]
          color: 'inherit',
          distance: 28,
          fontSize: 15,
          formatter: function (value: number) { // [cite: 128, 133]
            return value % 20 === 0 ? value.toString() : "";
          }
        },
        detail: { // [cite: 129]
          valueAnimation: true, // [cite: 129, 133]
          formatter: '{value}', // [cite: 129, 133]
          color: 'inherit',
          fontSize: 25,
          offsetCenter: [0, '20%']
        },
        data: [ // [cite: 129]
          {
            value: props.value,
            name: props.title ?? 'KPI', // [cite: 129, 133]
            title: { // [cite: 129]
              color: '#8C8C8C',
              offsetCenter: [0, "72%"] // [cite: 129, 133]
            }
          }
        ]
      }
    ]
  };
});
</script>

<style scoped>
.gauge-chart { /* [cite: 123] */
  min-height: 250px; /* Altura mínima base */
  width: 100%; /* Asegura que tome el ancho del contenedor */
  height: 100%; /* Asegura que tome el alto del contenedor */
}

/* Ajustes responsivos para diferentes tamaños de pantalla */
@media (max-width: 992px) {
  .gauge-chart {
    min-height: 280px; /* Mayor altura en tablets */
  }
}

@media (max-width: 768px) {
  .gauge-chart {
    min-height: 300px; /* Aún más altura en pantallas más pequeñas */
  }
}

@media (max-width: 480px) {
  .gauge-chart {
    min-height: 260px; /* Altura optimizada para móviles */
  }
}
</style>