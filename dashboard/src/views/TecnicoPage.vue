<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard Técnico</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Técnico Infootball</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <ion-row class="ion-row-1">
          <ion-col size="12" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkCpuLoad"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkRamUsage"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="4">
            <div class="box">
              <SparkLine v-bind="sparkApiErrors"/>
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-2">
          <ion-col size="12" size-lg="3" push-lg="9">
            <div class="box">
              <EchartsGauge :value="apiLatencyMs" title="LATENCIA API (ms)" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="9" pull-lg="3">
            <div class="box">
              <ApexLineRT :series="seriesUsuariosRealtime" title="Usuarios en Tiempo Real" kpi-target="1000" color="#10b981" />
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-3">
          <ion-col size="12" size-lg="4.5">
            <div class="box">
              <ChartJSLineAreaRT chartType="line" title="Peticiones API /min" color="#3b82f6" :realtime="true" :min="0" :max="5000" :delay="2000"/>
            </div>
          </ion-col>
          <ion-col size="12" size-lg="4.5">
            <div class="box">
              <ChartJSLineAreaRT chartType="area" title="Consultas DB /s" color="#ef4444" :min="0" :max="1000" :realtime="true" :delay="1500"/>
            </div>
          </ion-col>
          <ion-col size="12" size-lg="3">
            <div class="box">
              <EchartsGaugeMultiple :segments="segmentosSaludServidores" title="Salud Servidores (%)"/>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { hardwareChipOutline, serverOutline, alertCircleOutline } from 'ionicons/icons';

// Componentes
import SparkLine from '@/components/SparkLine.vue';
import ApexLineRT from '@/components/ApexLineRT.vue';
import EchartsGauge from '@/components/EchartsGauge.vue';
import EchartsGaugeMultiple from '@/components/EchartsGaugeMultiple.vue';
import ChartJSLineAreaRT from '@/components/ChartJSLineAreaRT.vue';

// --- DATOS EJEMPLO PARA INFOOTBALL (TÉCNICO) ---
// TODO: Reemplazar con datos reales y lógica de obtención

const UPDATE_INTERVAL = 2000;
const MAX_DATA_POINTS_REALTIME = 30;
let intervalId: ReturnType<typeof setInterval>;

// Sparklines Técnicos
const sparkCpuLoad = ref({
  title: "CARGA CPU SERVIDOR", value: "0%", bgColor: "gradient-blue", textColor: "white", iconName: hardwareChipOutline,
  chartOptions: { chart: { type: 'area' as const }, colors:['#fff'], stroke: {curve:'smooth' as const, width:2}, fill: {type:'gradient',gradient:{opacityFrom:0.6, opacityTo:0.1}}},
  chartSeries: [{ name: 'CPU', data: Array(10).fill(0) }],
});
const sparkRamUsage = ref({
  title: "USO RAM SERVIDOR", value: "0%", bgColor: "gradient-pink", textColor: "white", iconName: serverOutline,
  chartOptions: { chart: { type: 'bar' as const }, colors:['#fff'], plotOptions:{bar:{horizontal:false, columnWidth:'60%'}}, fill: {type: 'solid', opacity:0.7}},
  chartSeries: [{ name: 'RAM', data: Array(10).fill(0) }],
});
const sparkApiErrors = ref({
  title: "ERRORES API (Últ. Hora)", value: "0", bgColor: "gradient-red", textColor: "white", iconName: alertCircleOutline,
  chartOptions: { chart: { type: 'line' as const }, colors:['#fff'], stroke: {curve:'straight' as const, width:2}, fill: {type:'gradient',gradient:{opacityFrom:0.6, opacityTo:0.1}}},
  chartSeries: [{ name: 'Errores', data: Array(10).fill(0) }],
});

// ApexLineRT: Usuarios en tiempo real
const dataUsuariosRealtime = ref<{ x: number; y: number }[]>(
  Array.from({ length: MAX_DATA_POINTS_REALTIME }, (_, i) => ({ x: Date.now() - (MAX_DATA_POINTS_REALTIME - i) * UPDATE_INTERVAL, y: 0 }))
);
const seriesUsuariosRealtime = ref([{ name: 'Usuarios Conectados', data: dataUsuariosRealtime.value }]);

// EchartsGauge: Latencia API
const apiLatencyMs = ref(0);

// EchartsGaugeMultiple: Salud Servidores
const segmentosSaludServidores = ref([
  { value: 0, name: 'Servidor Web', color: '#10b981', min: 0, max: 100 },
  { value: 0, name: 'Servidor BD', color: '#f97316', min: 0, max: 100 },
  { value: 0, name: 'Servidor Cache', color: '#3b82f6', min: 0, max: 100 },
]);

function actualizarDatosTecnicos() {
  const now = Date.now();

  const cpu = Math.floor(Math.random() * 100);
  sparkCpuLoad.value = {...sparkCpuLoad.value, value: `${cpu}%`, chartSeries: [{name: 'CPU', data: [...sparkCpuLoad.value.chartSeries[0].data.slice(1), cpu]}]};

  const ram = Math.floor(Math.random() * 100);
  sparkRamUsage.value = {...sparkRamUsage.value, value: `${ram}%`, chartSeries: [{name: 'RAM', data: [...sparkRamUsage.value.chartSeries[0].data.slice(1), ram]}]};
  
  const errors = Math.floor(Math.random() * 5);
  sparkApiErrors.value = {...sparkApiErrors.value, value: `${errors}`, chartSeries: [{name: 'Errores', data: [...sparkApiErrors.value.chartSeries[0].data.slice(1), errors]}]};

  const usuarios = Math.floor(Math.random() * 1500) + 200;
  const nuevosDatosUsuarios = [...dataUsuariosRealtime.value, { x: now, y: usuarios }];
  if (nuevosDatosUsuarios.length > MAX_DATA_POINTS_REALTIME) {
    nuevosDatosUsuarios.shift();
  }
  dataUsuariosRealtime.value = nuevosDatosUsuarios;
  seriesUsuariosRealtime.value = [{ name: 'Usuarios Conectados', data: dataUsuariosRealtime.value }];

  apiLatencyMs.value = Math.floor(Math.random() * 300) + 50;

  segmentosSaludServidores.value.forEach(s => {
    s.value = Math.floor(Math.random() * 20) + 80;
  });
}

onMounted(() => {
  let initialTime = Date.now() - MAX_DATA_POINTS_REALTIME * UPDATE_INTERVAL;
  dataUsuariosRealtime.value = Array.from({ length: MAX_DATA_POINTS_REALTIME }, () => {
    initialTime += UPDATE_INTERVAL;
    return { x: initialTime, y: Math.floor(Math.random() * 500) + 50 };
  });
  seriesUsuariosRealtime.value = [{ name: 'Usuarios Conectados', data: dataUsuariosRealtime.value }];
  
  actualizarDatosTecnicos();
  intervalId = setInterval(actualizarDatosTecnicos, UPDATE_INTERVAL);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

</script>

<style scoped>
/* Estilos idénticos a NegocioPage.vue para consistencia */
ion-row { overflow: hidden; }
ion-col { max-height: 100%; --ion-grid-column-padding: 10px; }
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
  min-height: 150px;
}

@media (min-width: 992px) {
  ion-grid.dashboard-grid { height: calc(100% - 30px); display: flex; flex-direction: column; }
  .ion-row-1 { height: 25%; max-height: 25%; }
  .ion-row-1 .box { min-height: 0; }
  .ion-row-2 { height: 40%; max-height: 40%; }
  .ion-row-2 .box { min-height: 250px; }
  .ion-row-3 { height: 35%; max-height: 35%; }
  .ion-row-3 .box { min-height: 250px; }
}
@media (min-width: 768px) and (max-width: 991px) {
  ion-grid.dashboard-grid { display: flex; flex-direction: column; gap: 16px; }
  .box { min-height: 200px; }
   .ion-row-1 .box { min-height: 150px; }
  .ion-row-2 .box { min-height: 300px; }
  .ion-row-3 .box { min-height: 280px; }
}
@media (max-width: 767px) {
  .box { margin-bottom: 16px; min-height: 220px; }
  .ion-row-1 .box { min-height: 180px; }
  .ion-row-2 .box { min-height: 320px; }
  .ion-row-3 .box { min-height: 300px; }
}
</style>