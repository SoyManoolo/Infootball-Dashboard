<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard de Negocio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Negocio Infootball</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="dashboard-container">
        <ion-grid class="dashboard-grid">
          <ion-row class="ion-row-1">
            <ion-col size="6" size-lg="3">
              <div class="box">
                <SparkLine v-bind="sparkUsuariosActivos"/>
              </div>
            </ion-col>
            <ion-col size="6" size-lg="3">
              <div class="box">
                <SparkLine v-bind="sparkNuevosRegistros"/>
              </div>
            </ion-col>
            <ion-col size="6" size-lg="3">
              <div class="box">
                <SparkLine v-bind="sparkLigasSeguidas"/>
              </div>
            </ion-col>
            <ion-col size="6" size-lg="3">
              <div class="box">
                <SparkLine v-bind="sparkInteracciones"/>
              </div>
            </ion-col>
          </ion-row>

          <ion-row class="ion-row-2">
            <ion-col size="12" size-lg="9">
              <div class="box">
                <ApexMixedChart :series="seriesCrecimientoUsuarios" :options="optionsCrecimientoUsuarios" />
              </div>
            </ion-col>
            <ion-col size="12" size-lg="3">
              <div class="box">
                <EchartsGauge :value="tasaRetencion" title="TASA RETENCIÓN (%)" />
              </div>
            </ion-col>
          </ion-row>

          <ion-row class="ion-row-3">
            <ion-col size="12" size-lg="6">
              <div class="box box-map">
                <EchartsMap :data="datosMapaLigas" title="Usuarios por Liga Principal" subtitle="Distribución global de seguidores" />
              </div>
            </ion-col>
            <ion-col size="12" size-lg="6">
              <div class="box box-gauge-bottom">
                <EchartsGauge :value="featureAdoptionRate" title="ADOPCIÓN FUNCIÓN X (%)" />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { statsChartOutline, personAddOutline, trophyOutline, handRightOutline } from 'ionicons/icons';

// Componentes de Gráficos
import SparkLine from '@/components/SparkLine.vue';
import ApexMixedChart from '@/components/ApexMixedChart.vue';
import EchartsGauge from '@/components/EchartsGauge.vue';
import EchartsMap from '@/components/EchartsMap.vue';
import type { ApexOptions } from 'apexcharts';

// --- DATOS EJEMPLO PARA INFOOTBALL ---

const sparkUsuariosActivos = ref({
  title: "USUARIOS ACTIVOS HOY",
  value: "1,234",
  bgColor: "gradient-blue",
  textColor: "white",
  iconName: statsChartOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'smooth' as const, width: 3}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Actividad', data: [25, 66, 41, 89, 60, 44, 12, 36, 50, 21] }],
});

const sparkNuevosRegistros = ref({
  title: "NUEVOS USUARIOS (24H)",
  value: "58",
  bgColor: "gradient-green",
  textColor: "white",
  iconName: personAddOutline,
  chartOptions: { chart: { type: 'bar' as const }, colors:['#fff'], stroke: {width:0}, fill: {type: 'solid', opacity:0.6}},
  chartSeries: [{ name: 'Registros', data: [5, 8, 3, 12, 7, 10, 6, 2, 5] }],
});

const sparkLigasSeguidas = ref({
  title: "LIGAS MÁS SEGUIDAS",
  value: "LaLiga",
  bgColor: "gradient-orange",
  textColor: "white",
  iconName: trophyOutline,
  chartOptions: { chart: { type: 'line' as const }, stroke: { curve: 'straight' as const, width: 2}, colors:['#fff'], fill: {type:'solid', opacity:0.3}},
  chartSeries: [{ name: 'Interés', data: [60, 65, 70, 68, 72, 75, 73] }],
});

const sparkInteracciones = ref({
  title: "INTERACCIONES HOY",
  value: "10.5K",
  bgColor: "gradient-pink",
  textColor: "white",
  iconName: handRightOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'stepline' as const, width: 2}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Interacciones', data: [300, 450, 400, 600, 550, 700, 650] }],
});

const seriesCrecimientoUsuarios = ref([
  {
    name: 'Usuarios Activos Mensuales',
    type: 'column',
    data: [1200, 1500, 1300, 1800, 2200, 2500, 2300, 2800, 3100, 3000, 3300]
  },
  {
    name: 'Nuevos Registros',
    type: 'area',
    data: [150, 180, 160, 200, 250, 280, 240, 300, 320, 290, 350]
  },
]);
const optionsCrecimientoUsuarios = ref<ApexOptions>({
  title: { text: 'Crecimiento y Adquisición de Usuarios' },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
    type: 'category',
  },
  yaxis: [ { title: { text: 'Número de Usuarios' } } ],
  tooltip: { y: { formatter: (val: number) => val.toLocaleString() } },
});

const tasaRetencion = ref(75);
const featureAdoptionRate = ref(45);

const datosMapaLigas = ref([
  { name: "Spain", value: 50000 },
  { name: "United Kingdom", value: 45000 },
  { name: "Italy", value: 30000 },
  { name: "Germany", value: 28000 },
  { name: "France", value: 25000 },
  { name: "Portugal", value: 15000 },
  { name: "Netherlands", value: 12000 },
]);

onMounted(() => {
  // Simulación de actualización de datos después de un tiempo para demostración
  setTimeout(() => {
    sparkUsuariosActivos.value.value = "1,350";
    sparkUsuariosActivos.value.chartSeries = [{ name: 'Actividad', data: [30, 70, 45, 90, 65, 50, 20, 40, 55, 25] }];
    tasaRetencion.value = 78;
    featureAdoptionRate.value = 48;
  }, 3000);
});

</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

ion-grid.dashboard-grid {
  width: 100%;
}

ion-row {
  overflow: hidden;
}

ion-col {
  --ion-grid-column-padding: 10px;
}

.box {
  background: #1E1E1E;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  color: white;
  box-sizing: border-box;
  min-height: 140px;
}

.ion-row-2 .box, .ion-row-3 .box {
  padding: 0;
}

@media (min-width: 992px) {
  .ion-row-1 {
    min-height: 140px;
  }
  .ion-row-1 .box {
    min-height: 130px;
  }
  .ion-row-2 {
    min-height: 280px;
  }
  .ion-row-3 {
    min-height: 300px;
  }
  .box-map, .box-gauge-bottom {
    min-height: 300px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  ion-grid.dashboard-grid { gap: 16px; }
  .box { min-height: 180px; }
  .ion-row-1 .box { min-height: 140px; }
  .ion-row-2 .box { min-height: 280px; }
  .ion-row-3 .box { min-height: 320px; }
  .box-map, .box-gauge-bottom { min-height: 320px; }
}

@media (max-width: 767px) {
  .box { margin-bottom: 16px; min-height: 250px; }
  .ion-row-1 .box { min-height: 150px; }
  .ion-row-2 .box { min-height: 300px; }
  .ion-row-3 .box { min-height: 300px; }
  .box-map { min-height: 320px; }
  .box-gauge-bottom { min-height: 280px; }
}
</style>