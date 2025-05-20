<template>
  <VEChart class="map-chart" :option="mapOptions" autoresize />
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, defineProps, withDefaults } from 'vue';
import VEChart from "vue-echarts";
import * as echarts from "echarts/core";
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent } from 'echarts/components';
import europeMapData from '../assets/europe.geo.json'; // Asegúrate que la ruta sea correcta

echarts.use([MapChart, CanvasRenderer, TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent]);

const props = withDefaults(defineProps<{
  title?: string;
  subtitle?: string;
  data: { name: string; value: number }[];
}>(), {
  title: 'Mapa Interactivo',
  subtitle: 'Valores por país',
  data: () => []
});

onMounted(() => {
  if (!echarts.getMap("europe")) {
    echarts.registerMap("europe", europeMapData as any, {
      Iceland: { left: -20, top: 65, width: 12 }
    });
  }
});

const mapOptions = ref<echarts.EChartsCoreOption>({});

watchEffect(() => {
  const values = props.data.map(d => d.value);
  // Usar 0 como min por defecto si no hay datos o todos son positivos
  // Usar un valor base como 3000 (del PDF) si el min real es mayor, para tener un inicio de escala
  const minDataValue = values.length ? Math.min(...values, 3000) : 0;
  // Usar un valor base como 16000 (del PDF) si el max real es menor, para tener un fin de escala
  const maxDataValue = values.length ? Math.max(...values, 16000) : 10000;


  mapOptions.value = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "left", // Como en el PDF
      top: "top",   // Como en el PDF
      textStyle: { color: "#8C8C8C", fontSize: 16, fontWeight: "bold" }, // Estilo del PDF
      subtextStyle: { color: "#8C8C8C", fontSize: 12 }, // Estilo del PDF
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.data && typeof params.data.value !== 'undefined') {
          return `${params.name}: ${params.data.value.toLocaleString()}`;
        }
        return `${params.name}: (Sin datos)`;
      },
      backgroundColor: 'rgba(30,30,30,0.9)',
      borderColor: '#555',
      textStyle: { color: '#E0E0E0' }
    },
    visualMap: { // Configuración restaurada más parecida al PDF
      type: 'continuous',
      min: minDataValue, // PDF usa 3000 fijo, aquí es dinámico pero con fallback
      max: maxDataValue, // PDF usa 16000 fijo, aquí es dinámico pero con fallback
      left: "left",    // Como en el PDF
      top: "bottom",   // Como en el PDF
      orient: 'vertical', // <--- ORIENTACIÓN VERTICAL
      text: ["Más", "Menos"], // Como en el PDF
      textStyle: { color: "#B9B8CE" }, // Como en el PDF
      calculable: true,
      inRange: {
        color: ["#e0f3f8", "#74add1", "#4575b4"] // Colores del PDF (de claro a oscuro)
        // Si quieres de oscuro a claro: color: ["#4575b4", "#74add1", "#e0f3f8"].reverse()
      },
      outOfRange: {
        color: ['rgba(200, 200, 200, 0.2)']
      },
      itemWidth: 20,  // Ancho de la barra de color (típico para vertical)
      itemHeight: 140, // Alto de la barra de color (típico para vertical)
      precision: 0,
      padding: 5,
    },
    series: [
      {
        name: props.title || 'Datos del Mapa',
        type: "map",
        map: "europe",
        roam: true,
        zoom: 1.2,
        selectedMode: false,
        nameProperty: 'NAME', // Mantenemos esto que es crucial para tus datos
        emphasis: {
          label: { show: true, color: '#fff', fontSize: 12 },
          itemStyle: {
            areaColor: '#FFD700',
            borderColor: '#fff',
            borderWidth: 1.5
          }
        },
        itemStyle: { // Este color base es importante si visualMap no encuentra datos
          areaColor: 'rgba(128, 128, 128, 0.3)', // Un gris más neutro si no hay datos
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 0.5
        },
        data: props.data,
      },
    ],
    // El toolbox como lo tenías, puedes ajustarlo o quitarlo si interfiere
    toolbox: {
        show: true,
        left: 'right',
        top: 'top',
        feature: {
            dataView: { readOnly: false, backgroundColor: "#1E1E1E", textareaColor: "#1E1E1E", textColor: "#8C8C8C", buttonColor: "#071c49", lang: ['Datos', 'Cerrar', 'Actualizar'] },
            restore: {},
            saveAsImage: {}
        }
    },
    // Ajuste del grid para dar espacio al visualMap vertical
    grid: {
        left: '15%', // Más espacio a la izquierda para el visualMap vertical
        right: '5%',
        top: '15%',  // Espacio para título y toolbox
        bottom: '5%',
        containLabel: true
    },
  };
});
</script>

<style scoped>
.map-chart {
  width: 100%;
  height: 100%;
}
</style>