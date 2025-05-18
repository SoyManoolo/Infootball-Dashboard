<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Técnico</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Técnico</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <ion-row class="ion-row-1">
          <ion-col size="12" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkDataTech1"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkDataTech2"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkDataTech3"/>
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-2">
          <ion-col size="12" size-lg="3" push-lg="9">
            <div class="box">
              <EchartsGauge :value="currentGaugeValue" title="USUARIOS ONLINE" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="9" pull-lg="3">
            <div class="box">
              <ApexLineRT :series="apexLineSeries" title="Actividad de Usuarios (Realtime)" kpi-target="70" color="#3b82f6" />
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-3">
          <ion-col size="12" size-lg="4.5">
            <div class="box">
              <ChartJSLineAreaRT chartType="line" title="Carga CPU (%)" color="#10b981" :realtime="true" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="4.5">
            <div class="box">
              <ChartJSLineAreaRT chartType="area" title="Uso de Memoria (MB)" color="#ef4444" :min="50" :max="1000" :realtime="true" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="3">
            <div class="box">
              <EchartsGaugeMultiple :segments="ringSegmentsData" title="Rendimiento Servidores"/>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { hardwareChipOutline, serverOutline, wifiOutline } from 'ionicons/icons';

// Componentes de gráficos
import SparkLine from '../components/SparkLine.vue';
import ApexLineRT from '../components/ApexLineRT.vue';
import EchartsGauge from '../components/EchartsGauge.vue';
import EchartsGaugeMultiple from '../components/EchartsGaugeMultiple.vue';
import ChartJSLineAreaRT from '../components/ChartJSLineAreaRT.vue';

// Constantes y Variables
const UPDATE_INTERVAL = 1500; // Más lento para mejor visualización de cambios
const MAX_DATA_POINTS = 30;
let lastDate = Date.now();
let intervalId: ReturnType<typeof setInterval>;

// Datos para Sparklines
const sparkDataTech1 = ref({
  title: "CPU LOAD",
  value: "0%",
  bgColor: "gradient-blue",
  textColor: "white",
  iconName: hardwareChipOutline,
  chartOptions: { chart: { type: 'area' as const }, colors:['#fff'], stroke: {curve:'smooth' as const, width:2}, fill: {type:'gradient', gradient:{opacityFrom:0.6, opacityTo:0.1}}},
  chartSeries: [{ name: 'CPU', data: Array(10).fill(0) }],
});
const sparkDataTech2 = ref({
  title: "RAM USAGE",
  value: "0%",
  bgColor: "gradient-pink",
  textColor: "white",
  iconName: serverOutline,
  chartOptions: { chart: { type: 'bar' as const }, colors:['#fff'], plotOptions:{bar:{horizontal:false, columnWidth:'60%'}}, fill: {type: 'solid', opacity:0.7}},
  chartSeries: [{ name: 'RAM', data: Array(10).fill(0) }],
});
const sparkDataTech3 = ref({
  title: "UPTIME",
  value: "0d 0h",
  bgColor: "gradient-green",
  textColor: "white",
  iconName: wifiOutline, //
  chartOptions: { chart: { type: 'line' as const }, colors:['#fff'], stroke: {curve:'straight' as const, width:2}, fill: {type:'gradient', gradient:{opacityFrom:0.6, opacityTo:0.1}}},
  chartSeries: [{ name: 'Uptime', data: Array(10).fill(100) }], // Simula 100% uptime
});


// Datos para ApexLineRT
const apexLineData = ref<{ x: number; y: number }[]>(
  Array.from({ length: MAX_DATA_POINTS }, (_, i) => ({ x: Date.now() - (MAX_DATA_POINTS - i) * UPDATE_INTERVAL, y: 0 }))
);
const apexLineSeries = ref([{ name: 'Usuarios', data: apexLineData.value }]);

// Datos para ECharts Gauge Simple
const currentGaugeValue = ref(0);

// Datos para ECharts Gauge Múltiple
const ringSegmentsData = ref([
  { value: 0, name: 'API Latency (ms)', color: '#f97316', min: 0, max: 500 },
  { value: 0, name: 'DB Queries/s', color: '#10b981', min: 0, max: 1000 },
  { value: 0, name: 'Error Rate (%)', color: '#ef4444', min: 0, max: 10 },
]);

let uptimeSeconds = 0;

function formatUptime(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (3600 * 24));
  totalSeconds %= (3600 * 24);
  const hours = Math.floor(totalSeconds / 3600);
  return `${days}d ${hours}h`;
}

function addDataRealTime() {
  const newX = Date.now(); // Usar Date.now() para el eje X de ApexLineRT
  const newY = Math.floor(Math.random() * 90) + 10;

  // ApexLineRT
  const newData = [...apexLineData.value, { x: newX, y: newY }];
  if (newData.length > MAX_DATA_POINTS) {
    newData.shift();
  }
  apexLineData.value = newData;
  apexLineSeries.value = [{ name: 'Usuarios', data: apexLineData.value }];


  // ECharts Gauge Simple
  currentGaugeValue.value = newY;

  // ECharts Gauge Múltiple
  ringSegmentsData.value[0].value = Math.floor(Math.random() * 400) + 50; // API Latency
  ringSegmentsData.value[1].value = Math.floor(Math.random() * 800) + 100; // DB Queries
  ringSegmentsData.value[2].value = parseFloat((Math.random() * 5).toFixed(1)); // Error Rate

  // Sparklines
  uptimeSeconds += UPDATE_INTERVAL / 1000;
  sparkDataTech1.value = {...sparkDataTech1.value, value: `${newY}%`, chartSeries: [{name: sparkDataTech1.value.chartSeries[0].name, data: [...sparkDataTech1.value.chartSeries[0].data.slice(1), newY]}]};
  const newRam = Math.floor(Math.random() * 70) + 10;
  sparkDataTech2.value = {...sparkDataTech2.value, value: `${newRam}%`, chartSeries: [{name: sparkDataTech2.value.chartSeries[0].name, data: [...sparkDataTech2.value.chartSeries[0].data.slice(1), newRam]}]};
  sparkDataTech3.value = {...sparkDataTech3.value, value: formatUptime(uptimeSeconds)};
  // La serie de uptime puede ser estática o mostrar alguna variación si se desea
}

onMounted(() => {
  // Inicializar datos para ApexLineRT para evitar que empiece vacío si MAX_DATA_POINTS es grande
  lastDate = Date.now() - MAX_DATA_POINTS * UPDATE_INTERVAL;
   apexLineData.value = Array.from({ length: MAX_DATA_POINTS }, () => {
    lastDate += UPDATE_INTERVAL;
    return { x: lastDate, y: Math.floor(Math.random()*30)+10 }; // Datos iniciales aleatorios
  });
  apexLineSeries.value = [{ name: 'Usuarios', data: apexLineData.value }];
  lastDate = Date.now(); // Resetear lastDate para las nuevas actualizaciones

  intervalId = setInterval(addDataRealTime, UPDATE_INTERVAL);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
/* Mismos estilos que NegocioPage.vue para .box, ion-row, ion-col y @media */
ion-row {
  overflow: hidden;
}

ion-col {
  max-height: 100%;
  --ion-grid-column-padding: 10px;
}

.box {
  background: #1E1E1E;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  color: white;
  box-sizing: border-box;
}

@media (min-width: 992px) {
  ion-grid.dashboard-grid {
    height: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }
  .ion-row-1 {
    height: 25%;
    max-height: 25%;
  }
  /* Ajuste para la Fila 2 del dashboard técnico como en el PDF (era 50%) */
  .ion-row-2 {
    height: 40%; /* PDF especificaba 50% para dashboard técnico, pero 40% es más consistente con la otra página y deja espacio para la fila 3 */
    max-height: 40%;
  }
   /* Ajuste para la Fila 3 del dashboard técnico como en el PDF (era 30%) */
  .ion-row-3 {
    height: 35%; /* PDF especificaba 30% para dashboard técnico */
    max-height: 35%;
  }
}
</style>