<template>
  <div class="sparkline-card" :class="bgColorClass">
    <div class="card-content">
      <div class="icon-container">
        <ion-icon :icon="iconName" :style="{ color: textColor }"></ion-icon>
      </div>
      <div class="data-container">
        <div class="title" :style="{ color: textColor }">{{ title }}</div>
        <div class="value" :style="{ color: textColor }">{{ value }}</div>
      </div>
    </div>
    <div class="chart-container">
      <VueApexCharts
        :options="finalChartOptions"
        :series="chartSeries"
        :height="chartHeight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { IonIcon } from '@ionic/vue';
import type { ApexOptions } from 'apexcharts';

const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  bgColor: { type: String, default: 'gradient-default' }, // Clase CSS para el fondo
  textColor: { type: String, default: 'white' },
  iconName: { type: String, required: true },  chartOptions: { type: Object as () => ApexOptions, default: () => ({}) },
  chartSeries: { type: Array as () => any[], required: true },
  chartHeight: { type: [String, Number], default: 70 }, // Altura del gráfico
});

const bgColorClass = computed(() => {
  // Permite pasar clases CSS directamente para fondos con gradientes
  if (props.bgColor.startsWith('gradient-')) {
    return props.bgColor;
  }
  return ''; // O puedes tener un color por defecto aquí si no es un gradiente
});

const defaultChartOptions: ApexOptions = {
  chart: {
    type: 'area', // tipo por defecto, puede ser sobreescrito
    sparkline: {
      enabled: true,
    },
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 0,
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    opacity: 0.3,
  },
  yaxis: {
    show: false,
  },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  tooltip: {
    enabled: false, // Deshabilitado por defecto para sparklines
  },
  colors: [props.textColor || '#ffffff'], // Color de la línea/barra del gráfico
};

const finalChartOptions = computed<ApexOptions>(() => {
  // Fusiona las opciones por defecto con las proporcionadas
  return {
    ...defaultChartOptions,
    ...props.chartOptions,
    chart: {
      ...defaultChartOptions.chart,
      ...props.chartOptions?.chart,
    },
    colors: props.chartOptions?.colors || [props.textColor || '#ffffff'],
  };
});
</script>

<style scoped>
.sparkline-card {
  position: relative; /* Para el posicionamiento absoluto del gráfico */
  border-radius: 8px;
  padding: 16px;
  color: white;
  overflow: hidden; /* Para que el gráfico no se salga si es más grande */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Asegura que el chart-container esté abajo */
  height: 100%; /* Asegura que la tarjeta ocupe toda la altura del .box */
  box-sizing: border-box;
}

.card-content {
  display: flex;
  align-items: flex-start; /* Alinea el icono y los datos en la parte superior */
  position: relative;
  z-index: 1; /* Para que el contenido esté sobre el gráfico */
}

.icon-container {
  margin-right: 12px;
  font-size: 28px; /* Tamaño del icono */
}

.icon-container ion-icon {
  font-size: 28px;
}


.data-container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 0.8em;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 2px;
}

.value {
  font-size: 1.8em;
  font-weight: bold;
  line-height: 1.1;
}

.chart-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.5; /* Opacidad del gráfico como en el PDF */
  z-index: 0; /* Para que el gráfico esté detrás del contenido */
  line-height: 0; /* Evita espacio extra debajo del gráfico */
}

/* Clases de ejemplo para gradientes (debes definirlas globalmente o aquí) */
.gradient-blue {
  background: linear-gradient(45deg, #2980b9, #6dd5fa);
}
.gradient-pink {
  background: linear-gradient(45deg, #ff7eb3, #ff758c);
}
.gradient-orange {
  background: linear-gradient(45deg, #f09819, #edde5d);
}
.gradient-green {
  background: linear-gradient(45deg, #11998e, #38ef7d);
}
.gradient-purple {
  background: linear-gradient(45deg, #8E2DE2, #4A00E0);
}
.gradient-red {
  background: linear-gradient(45deg, #cb2d3e, #ef473a);
}
.gradient-default {
  background: #424242; /* Un color por defecto si no se especifica gradiente */
}
</style>