<template>
  <div class="chartjs-container">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <div class="canvas-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, withDefaults, watch } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Adaptador de fecha para Chart.js
import StreamingPlugin from 'chartjs-plugin-streaming'; // Plugin de streaming

if (!(Chart.registry.plugins as any).get('streaming')) { // Evitar registrar múltiples veces
 Chart.register(StreamingPlugin);
}


// Props con valores por defecto
const props = withDefaults(defineProps<{
  chartType?: 'line' | 'area';
  title?: string;
  color?: string;
  realtime?: boolean; // Para activar/desactivar el modo streaming del plugin
  min?: number;
  max?: number;
  delay?: number; // Retraso para el plugin de streaming (refresh)
  dataPoints?: number; // Número de puntos a mantener en el gráfico de streaming
}>(), {
  chartType: 'line',
  title: 'Gráfico en Tiempo Real',
  color: '#3b82f6', // Azul por defecto
  realtime: false,
  min: 0,
  max: 100,
  delay: 2000, // Retraso entre actualizaciones de datos en ms para el plugin
  dataPoints: 20, // Cuántos puntos mantener en la visualización de streaming
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let demoIntervalId: ReturnType<typeof setInterval> | null = null; // Intervalo para datos demo no-streaming

const chartData = {
  datasets: [
    {
      label: props.title,
      backgroundColor: props.chartType === 'area' ? `${props.color}4D` : 'transparent', // 4D para ~30% opacidad
      borderColor: props.color,
      borderWidth: 2,
      fill: props.chartType === 'area',
      tension: 0.3, // Suavizado de línea
      pointRadius: props.realtime ? 0 : 2, // Sin puntos en tiempo real para limpieza
      data: [] as { x: number, y: number }[], // Asegurar que sea un array de objetos {x, y}
    }
  ]
};

const chartOptions: any = { // 'any' para las opciones del plugin de streaming
  responsive: true,
  maintainAspectRatio: false, // MUY IMPORTANTE: permite controlar altura con CSS
  animation: props.realtime ? false : { duration: 800 }, // Desactivar animación general para streaming
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      type: 'realtime' as const, // Activa el eje de tiempo real del plugin
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#B0B0B0', // Color de las etiquetas del eje X
        maxRotation: 0,
        autoSkipPadding: 20,
      },
      realtime: { // Opciones específicas del plugin de streaming
        duration: props.dataPoints * props.delay, // Ventana de tiempo visible
        refresh: props.delay,          // Frecuencia de actualización del gráfico
        delay: props.delay,            // Retraso antes de que los datos nuevos aparezcan
        pause: false,                  // No pausar el gráfico
        ttl: undefined,                // Tiempo de vida de los datos (undefined para infinito dentro de duration)
        onRefresh: (chart: Chart) => {
          if (props.realtime && chart.data.datasets) { // Asegurarse que sea modo realtime y datasets existan
            const now = Date.now();
            chart.data.datasets.forEach(dataset => {
              // Generar datos aleatorios entre props.min y props.max
              const value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
              (dataset.data as { x: number, y: number }[]).push({
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
        borderColor: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#B0B0B0', // Color de las etiquetas del eje Y
        stepSize: (props.max - props.min) / 4 // Sugerir 4-5 ticks
      }
    }
  },
  plugins: {
    legend: {
      display: false, // Ocultar leyenda para gráficos simples
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fondo del tooltip
      titleColor: '#E0E0E0',
      bodyColor: '#E0E0E0',
      borderColor: 'rgba(80, 80, 80, 0.9)',
      borderWidth: 1,
      padding: 10,
      displayColors: false, // No mostrar el cuadrito de color en el tooltip
      callbacks: {
        label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1); // Ajusta decimales si es necesario
            }
            return label;
        }
      }
    }
  }
};

onMounted(() => {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: 'line', // El plugin de streaming funciona sobre el tipo 'line'
    data: chartData,
    options: chartOptions
  });

  // Si no es realtime (por plugin), y quieres una demo de datos que se añaden
  if (!props.realtime && chartInstance) {
    const initialData = [];
    const now = Date.now();
    for (let i = 0; i < props.dataPoints; i++) { // Generar puntos iniciales
      const time = now - (props.dataPoints - i) * props.delay;
      initialData.push({
        x: time,
        y: Math.floor(Math.random() * (props.max - props.min + 1)) + props.min
      });
    }
    chartInstance.data.datasets[0].data = initialData;
    chartInstance.update('none'); // 'none' para no animar la carga inicial

    // Simular actualización para el modo no-streaming del plugin
    demoIntervalId = setInterval(() => {
      if (chartInstance && chartInstance.data.datasets) {
        const value = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
        const currentData = chartInstance.data.datasets[0].data as { x: number, y: number }[];
        currentData.push({ x: Date.now(), y: value });
        if (currentData.length > props.dataPoints + 5) { // Mantener un buffer razonable
            currentData.shift();
        }
        chartInstance.update('none');
      }
    }, props.delay);
  }
});

onUnmounted(() => {
  if (demoIntervalId !== null) {
    clearInterval(demoIntervalId);
  }
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

// Observar cambios en props que no son manejados directamente por Chart.js
watch(() => [props.min, props.max, props.color, props.title], () => {
if (chartInstance) {
  chartInstance.options.scales!.y!.min = props.min;
  chartInstance.options.scales!.y!.max = props.max;
  if (chartInstance.options.scales!.y!.ticks) {
    (chartInstance.options.scales!.y!.ticks as any).stepSize = (props.max - props.min) / 4;
  }
  chartInstance.data.datasets[0].borderColor = props.color;
    chartInstance.data.datasets[0].backgroundColor = props.chartType === 'area' ? `${props.color}4D` : 'transparent';
    chartInstance.data.datasets[0].label = props.title;
    chartInstance.options.plugins!.tooltip!.callbacks!.label = function(context: any) {
      let label = props.title || '';
      if (label) { label += ': '; }
      if (context.parsed.y !== null) { label += context.parsed.y.toFixed(1); }
      return label;
    };
    chartInstance.update('none');
  }
});

</script>

<style scoped>
.chartjs-container {
  width: 100%;
  height: 100%; /* El contenedor principal debe tener una altura definida por el .box */
  padding: 12px; /* Padding interno del componente */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.chart-title {
  margin: 0 0 8px 0; /* Margen inferior más pequeño */
  color: #C0C0C0;   /* Color del título un poco más claro */
  font-size: 0.85em; /* Tamaño de fuente del título */
  font-weight: 600; /* Un poco más de peso */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Añadir ellipsis si el título es muy largo */
}

.canvas-wrapper {
  flex: 1; /* El wrapper toma el espacio restante */
  position: relative;
  min-height: 0; /* Para flexbox */
  overflow: hidden; /* Asegurar que el canvas no se desborde */
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>