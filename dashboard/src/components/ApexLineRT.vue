<template>
  <div class="line-rt-container">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <div class="chart-content">
      <VueApexCharts
        type="area"
        height="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Props para configurar el gráfico de línea en tiempo real
const props = defineProps({
  series: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Gráfico en Tiempo Real'
  },
  kpiTarget: {
    type: [String, Number],
    default: null
  },
  color: {
    type: String,
    default: '#3b82f6' // Azul por defecto
  }
});

// Opciones del gráfico
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    height: 350,
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: true
    },
    zoom: { 
      enabled: false 
    },
    background: 'transparent'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: [props.color]
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM \'yy',
        day: 'dd MMM',
        hour: 'HH:mm'
      },
      style: {
        colors: '#8C8C8C'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#8C8C8C'
      }
    }
  },
  grid: {
    borderColor: '#444',
    yaxis: {
      lines: {
        show: false
      }
    }
  },
  annotations: props.kpiTarget ? {
    yaxis: [
      {
        y: parseInt(props.kpiTarget as string),
        borderColor: '#FEB019',
        label: {
          borderColor: '#FEB019',
          style: {
            color: '#fff',
            background: '#FEB019'
          },
          text: `Meta: ${props.kpiTarget}`
        }
      }
    ]
  } : {},
  tooltip: {
    theme: 'dark',
    x: {
      format: 'HH:mm:ss'
    }
  },
  colors: [props.color]
}));
</script>

<style scoped>
.line-rt-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.chart-title {
  margin: 0 0 16px 0;
  color: #8C8C8C;
  font-size: 16px;
  font-weight: bold;
}

.chart-content {
  flex: 1;
  min-height: 0;
}
</style>