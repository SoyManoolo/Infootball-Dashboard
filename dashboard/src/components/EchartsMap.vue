<template>
  <VEChart class="map-chart" :option="mapOptions" autoresize />
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, defineProps, withDefaults } from 'vue'; // [cite: 147]
import VEChart from "vue-echarts"; // [cite: 147]
import * as echarts from "echarts/core"; // [cite: 147]
import { MapChart } from 'echarts/charts'; // [cite: 148]
import { CanvasRenderer } from 'echarts/renderers'; // [cite: 148]
import { TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent } from 'echarts/components'; // [cite: 149]
import europeMapData from '../assets/europe.geo.json'; // [cite: 149] (Ruta actualizada a relativa)

echarts.use([MapChart, CanvasRenderer, TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent]); // [cite: 150]

const props = withDefaults(defineProps<{ // [cite: 153]
  title?: string;
  subtitle?: string;
  data: { name: string; value: number }[];
}>(), {
  title: 'Título del gráfico', // [cite: 153]
  subtitle: 'Subtítulo', // [cite: 153]
  data: () => [] // [cite: 153]
});

onMounted(() => { // [cite: 147]
  echarts.registerMap("europe", europeMapData as any, { // [cite: 150]
    Iceland: { // [cite: 150, 151]
      left: -20,
      top: 65,
      width: 12
    }
    // Puedes añadir más ajustes para otros países si es necesario
  });
});

const mapOptions = ref({}); // [cite: 156]

watchEffect(() => { // [cite: 157, 160]
  mapOptions.value = {
    title: { // [cite: 157]
      text: props.title, // [cite: 158]
      subtext: props.subtitle, // [cite: 158]
      left: "left",
      textStyle: { color: "#8C8C8C", fontSize: 16, fontWeight: "bold" }, // [cite: 158]
      subtextStyle: { color: "#8C8C8C" }, // [cite: 158]
    },
    toolbox: { // [cite: 158]
        show: true,
        left: 'right',
        top: 'top',
        feature: {
            dataView: { readOnly: false, backgroundColor: "#1E1E1E", textareaColor: "#1E1E1E", textColor: "#8C8C8C", buttonColor: "#071c49", lang: ['Datos', 'Cerrar', 'Actualizar'] },
            restore: {},
            saveAsImage: {}
        }
    },
    tooltip: { trigger: "item" }, // [cite: 158, 162]
    visualMap: { // [cite: 158, 161]
      min: Math.min(...props.data.map(d => d.value), 3000), // Ajustado para ser dinámico o 3000 si los datos son mayores
      max: Math.max(...props.data.map(d => d.value), 16000), // Ajustado para ser dinámico o 16000 si los datos son menores
      left: "left",
      top: "bottom",
      text: ["Más", "Menos"], // [cite: 158]
      textStyle: { color: "#B9B8CE" }, // [cite: 158]
      calculable: true,
      inRange: { color: ["#e0f3f8", "#74add1", "#4575b4"] }, // [cite: 158]
      outOfRange: { color: ['rgba(200, 200, 200, 0.2)'] } // [cite: 158, 164]
    },
    series: [ // [cite: 158]
      {
        name: "Descargas", // O un nombre más genérico
        type: "map",
        map: "europe", // Nombre registrado
        roam: true, // [cite: 158, 163]
        emphasis: { // [cite: 159]
          label: { show: true },
          itemStyle: {
            areaColor: '#74add1',
            borderWidth: 1
          }
        },
        itemStyle: { // [cite: 159]
          areaColor: 'rgba(128, 128, 128, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 0.5
        },
        data: props.data, // [cite: 155, 159]
      },
    ],
  };
});
</script>

<style scoped>
.map-chart {
  min-height: 300px; /* O la altura que necesites */
  width: 100%;
  height: 100%;
}
</style>