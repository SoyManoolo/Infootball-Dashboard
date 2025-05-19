<template>
  <div class="line-rt-container">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <div class="chart-content">
      <VueApexCharts
        type="area"
        height="100%"
        :options="finalChartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';

const props = defineProps({
  series: {
    type: Array as () => ApexAxisChartSeries,
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
    default: '#10b981'
  }
});

const finalChartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    height: '100%',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
      autoSelected: 'zoom'
    },
    zoom: {
      enabled: true
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
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    },
    colors: [props.color]
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    labels: {
      colors: '#E0E0E0'
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM \'yy',
        day: 'dd MMM',
        hour: 'HH:mm',
        minute: 'HH:mm:ss'
      },
      style: {
        colors: '#B0B0B0'
      },
      datetimeUTC: false
    },
    axisBorder: { show: true, color: '#555' },
    axisTicks: { show: true, color: '#555' },
    tooltip: {
      enabled: true,
      formatter: function (val) {
        return new Date(val).toLocaleTimeString();
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#B0B0B0'
      },
      formatter: function (value) {
        return value.toFixed(0);
      }
    },
    axisBorder: { show: true, color: '#555' },
    axisTicks: { show: true, color: '#555' },
  },
  grid: {
    show: true,
    borderColor: '#444',
    strokeDashArray: 3,
    xaxis: {
        lines: {
            show: false
        }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  annotations: props.kpiTarget ? {
    yaxis: [
      {
        y: parseFloat(props.kpiTarget as string),
        borderColor: '#FEB019',
        borderWidth: 2,
        strokeDashArray: 4,
        label: {
          borderColor: '#FEB019',
          style: {
            color: '#000',
            background: '#FEB019',
            fontSize: '10px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 }
          },
          text: `Meta: ${props.kpiTarget}`,
          position: 'right',
          offsetX: 5,
          offsetY: -5,
        }
      }
    ]
  } : {},
  tooltip: {
    theme: 'dark',
    x: {
      format: 'HH:mm:ss'
    },
    y: {
      formatter: function (value) {
        return value.toFixed(0);
      }
    },
    marker: {
      show: true,
    },
  },
  colors: [props.color]
}));
</script>

<style scoped>
.line-rt-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.chart-title {
  margin: 0 0 10px 0;
  color: #C0C0C0;
  font-size: 0.9em;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-content {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/*
  Estilos GLOBALES para el menú de la toolbar de ApexCharts.
  Estos fuerzan un tema oscuro para el menú desplegable.
*/
:global(.apexcharts-menu) {
  background-color: #2a2a2a !important; /* Fondo oscuro para el menú */
  border: 1px solid #444 !important;   /* Borde oscuro */
  color: #dadada !important;           /* Texto general claro para el menú */
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; /* Sombra suave */
  z-index: 1001 !important;
}

:global(.apexcharts-menu-item) {
  color: #dadada !important; /* Texto de los ítems claro */
  background-color: transparent !important; /* Fondo transparente para que use el del menú */
  padding: 8px 12px !important; /* Un poco más de padding */
}

:global(.apexcharts-menu-item:hover) {
  color: #ffffff !important; /* Texto más brillante al pasar el ratón */
  background-color: #3c3c3c !important; /* Fondo del hover ligeramente más claro */
}

/* Específico para los iconos dentro de la toolbar (no el menú desplegable) */
:global(.apexcharts-toolbar svg) {
  fill: #b0b0b0 !important; /* Color de los iconos de la toolbar (hamburguesa, etc.) */
}
:global(.apexcharts-toolbar svg:hover) {
  fill: #ffffff !important;
}

/* Estilos para el tooltip de ApexCharts si es necesario forzarlos */
:global(.apexcharts-tooltip.apexcharts-theme-dark) {
  background: #2a2a2a !important;
  border-color: #444 !important;
  color: #dadada !important;
}

:global(.apexcharts-tooltip.apexcharts-theme-dark .apexcharts-tooltip-title) {
  background: #333 !important;
  border-color: #444 !important;
  color: #f0f0f0 !important;
}
</style>