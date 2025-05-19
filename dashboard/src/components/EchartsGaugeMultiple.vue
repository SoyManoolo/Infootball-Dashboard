<template>
  <VEChart class="gauge-multiple-chart" :option="options" autoresize />
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps, withDefaults } from 'vue';
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent, TitleComponent, LegendComponent } from "echarts/components";
import VEChart from "vue-echarts";

// Registramos los componentes necesarios para ECharts
use([GaugeChart, CanvasRenderer, TooltipComponent, TitleComponent, LegendComponent]);

// Definimos los tipos para los segmentos del gauge
interface GaugeSegment {
  value: number;
  name: string;
  color: string;
  min: number;
  max: number;
}

// Props con valores por defecto
const props = withDefaults(defineProps<{
  segments: GaugeSegment[];
  title?: string;
}>(), {
  title: 'Métricas de Rendimiento'
});

const options = ref({});

// Actualizamos las opciones cuando cambien los props
watchEffect(() => {
  const gauges = props.segments.map((segment, index) => {
    const total = props.segments.length;
    const startAngle = -180 + (-90 + index * (180 / total));
    const endAngle = -180 + (-90 + (index + 1) * (180 / total));
    const radius = 80 - (index * 5); // Reducimos ligeramente el tamaño de cada gauge
    
    return {
      type: 'gauge',
      min: segment.min,
      max: segment.max,
      startAngle: startAngle,
      endAngle: endAngle,
      center: ['50%', '60%'],
      radius: `${radius}%`,
      progress: {
        show: true,
        itemStyle: { color: segment.color }
      },
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [1, 'rgba(150, 150, 150, 0.2)'] // Color de fondo
          ]
        }
      },
      pointer: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        valueAnimation: true,
        formatter: function(value: number) {
          return `{value|${value}}\n{name|${segment.name}}`;
        },
        rich: {
          value: {
            fontSize: 18,
            fontWeight: 'bold',
            color: segment.color
          },
          name: {
            fontSize: 12,
            color: '#999',
            padding: [5, 0, 0, 0]
          }
        },
        offsetCenter: [0, `${40 + index * 40}%`],
        color: '#fff'
      },
      data: [
        {
          value: segment.value
        }
      ]
    };
  });

  options.value = {
    title: {
      text: props.title,
      left: 'center',
      top: '5%',
      textStyle: {
        color: '#8C8C8C',
        fontSize: 15
      }
    },
    tooltip: {
      formatter: '{b}: {c}'
    },
    series: gauges
  };
});
</script>

<style scoped>
.gauge-multiple-chart {
  min-height: 250px;
  width: 100%;
  height: 100%;
}

/* Ajustes responsivos para diferentes tamaños de pantalla */
@media (max-width: 992px) {
  .gauge-multiple-chart {
    min-height: 300px; /* Más altura en tablets */
  }
}

@media (max-width: 768px) {
  .gauge-multiple-chart {
    min-height: 350px; /* Mucho más altura en pantallas más pequeñas para mejor visualización */
  }
}

@media (max-width: 576px) {
  .gauge-multiple-chart {
    min-height: 320px; /* Altura optimizada para móviles */
  }
}
</style>