<template>
  <VEChart class="gauge-chart" :option="options" autoresize /> </template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from 'vue';
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent } from "echarts/components";
import VEChart from "vue-echarts";

use([GaugeChart, CanvasRenderer, TooltipComponent]);

const props = defineProps<{ value: number, title?: string }>();

const options = ref({});

watchEffect(() => {
  options.value = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '95%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.2, "#ff4d4d"],
              [0.69, "#ffa500"],
              [1, "#4caf50"],
            ]
          }
        },
        pointer: { itemStyle: { color: 'auto' }, length: '60%' },
        axisTick: { distance: -20, length: 4, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: {
          color: 'inherit',
          distance: 28,
          fontSize: 15,
          formatter: function (value: number) {
            return value % 20 === 0 ? value.toString() : "";
          }
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: 'inherit',
          fontSize: 25,
          offsetCenter: [0, '20%']
        },
        data: [
          {
            value: props.value,
            name: props.title ?? 'KPI',
            title: {
              color: '#8C8C8C',
              offsetCenter: [0, "72%"]
            }
          }
        ]
      }
    ]
  };
});
</script>

<style scoped>
.gauge-chart {
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