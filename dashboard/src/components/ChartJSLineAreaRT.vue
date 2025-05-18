<template>
  <div class="chart-container">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, withDefaults } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import StreamingPlugin from 'chartjs-plugin-streaming';

// Registramos el plugin de streaming para Chart.js
Chart.register(StreamingPlugin);

// Props con valores por defecto
const props = withDefaults(defineProps<{
  chartType?: 'line' | 'area';
  title?: string;
  color?: string;
  realtime?: boolean;
  min?: number;
  max?: number;
  delay?: number;
}>(), {
  chartType: 'line',
  title: 'Gráfico en Tiempo Real',
  color: '#3b82f6', // Azul por defecto
  realtime: false,
  min: 0,
  max: 100,
  delay: 2000 // Retraso entre actualizaciones de datos en ms
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (!chartCanvas.value) return;

  // Configuración del gráfico
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Configuración de datos
  const data = {
    datasets: [
      {
        label: props.title,
        backgroundColor: props.chartType === 'area' ? 
          `${props.color}4D` : // 4D is hex for 0.3 opacity
          'transparent',
        borderColor: props.color,
        fill: props.chartType === 'area',
        tension: 0.4, // Suavizado de línea
        pointRadius: 2,
        data: []
      }
    ]
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // general animation time
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'realtime' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#8C8C8C'
        },
        realtime: {
          duration: 20000,
          refresh: props.delay,
          delay: 1000,
          onRefresh: (chart: Chart) => {
            if (props.realtime) {
              const now = Date.now();
              chart.data.datasets?.forEach(dataset => {
                // Generar datos aleatorios entre props.min y props.max
                const value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
                dataset.data.push({
                  x: now,
                  y: value
                });
              });
            }
          }
        }
      },
      y: {
        min: props.min,
        max: props.max,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#8C8C8C'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(40, 40, 40, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(80, 80, 80, 0.9)',
        borderWidth: 1
      }
    }
  };

  // Crear el gráfico
  chartInstance = new Chart(ctx, {
    type: 'line',
    data,
    options
  });

    // Si no es en tiempo real, simulamos datos iniciales
  if (!props.realtime && chartInstance) {
    // Generar algunos datos para demostración
    const now = Date.now();
    for (let i = 0; i < 20; i++) {
      const time = now - (20 - i) * 1000;
      const value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
      chartInstance.data.datasets[0].data.push({
        x: time,
        y: value
      });
    }
    chartInstance.update();

    // Actualizar datos cada cierto tiempo
    intervalId = setInterval(() => {
      if (chartInstance) {
        const value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
        chartInstance.data.datasets[0].data.push({
          x: Date.now(),
          y: value
        });
        chartInstance.update();
      }
    }, props.delay);
  }
});

onUnmounted(() => {
  // Limpieza del gráfico y el intervalo al desmontar el componente
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.chart-title {
  margin: 0 0 16px 0;
  color: #8C8C8C;
  font-size: 16px;
  font-weight: bold;
}

canvas {
  flex: 1;
}
</style>