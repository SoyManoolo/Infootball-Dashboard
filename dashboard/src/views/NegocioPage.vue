<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Negocio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Negocio</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <ion-row class="ion-row-1">
          <ion-col size="6" size-lg="3">
            <div class="box">
              <SparkLine v-bind="sparkData1"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="3">
            <div class="box">
              <SparkLine v-bind="sparkData2"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="3">
            <div class="box">
              <SparkLine v-bind="sparkData3"/>
            </div>
          </ion-col>
          <ion-col size="6" size-lg="3">
            <div class="box">
              <SparkLine v-bind="sparkData4"/>
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-2">
          <ion-col size="12" size-lg="9">
            <div class="box">
              <ApexMixedChart :series="dataMixedChartSeries" :options="mixedChartOptions" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="3">
            <div class="box">
              <EchartsGauge :value="dataGauge" title="SATISFACCIÓN" />
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-3">
          <ion-col size="12" size-lg="6">
            <div class="box">
              <EchartsMap :data="dataDownloadsEU" title="Descargas Globales" subtitle="KPI: Países > 1K" />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="6">
            <div class="box">
              <EchartsGauge :value="anotherGaugeData" title="KPI ADICIONAL" />
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
import { ref } from 'vue';
import { navigateOutline, eyeOutline, peopleOutline, cashOutline } from 'ionicons/icons'; // Importa los iconos que necesites

// Componentes de Gráficos
import SparkLine from '../components/SparkLine.vue';
import ApexMixedChart from '../components/ApexMixedChart.vue';
import EchartsGauge from '../components/EchartsGauge.vue';
import EchartsMap from '../components/EchartsMap.vue';
import type { ApexOptions } from 'apexcharts';

// Datos para Sparklines
const sparkData1 = ref({
  title: "CLICKS",
  value: "1234",
  bgColor: "gradient-blue",
  textColor: "white",
  iconName: navigateOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'smooth' as const, width: 3}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Clicks', data: [25, 66, 41, 89, 60, 44, 12, 36, 50, 21] }],
});

const sparkData2 = ref({
  title: "VIEWS",
  value: "1982",
  bgColor: "gradient-pink",
  textColor: "white",
  iconName: eyeOutline,
  chartOptions: { chart: { type: 'bar' as const }, colors:['#fff'], stroke: {width:0}, fill: {type: 'solid', opacity:0.6}},
  chartSeries: [{ name: 'Views', data: [25, 66, 41, 89, 60, 44, 12, 36, 50, 21, 33, 54] }],
});

const sparkData3 = ref({
  title: "LEADS",
  value: "2011",
  bgColor: "gradient-orange",
  textColor: "white",
  iconName: peopleOutline,
  chartOptions: { chart: { type: 'line' as const }, stroke: { curve: 'straight' as const, width: 3}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.3, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Leads', data: [30, 25, 60, 30, 65, 35, 74, 52, 90, 36, 60] }],
});

const sparkData4 = ref({
  title: "SALES",
  value: "627k€",
  bgColor: "gradient-green",
  textColor: "white",
  iconName: cashOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'stepline' as const, width: 2}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Sales', data: [50, 35, 70, 40, 75, 45, 84, 62, 90, 56, 70] }],
});


// Datos para ApexMixedChart
const dataMixedChartSeries = ref([
  {
    name: 'Ingresos',
    type: 'column',
    data: [2300, 1100, 2200, 2700, 1300, 2200, 3700, 2100, 4400, 2200, 3000]
  },
  {
    name: 'Gastos',
    type: 'area',
    data: [440, 550, 410, 670, 220, 430, 210, 410, 560, 270, 430]
  },
  {
    name: 'Beneficio',
    type: 'line',
    data: [1860, 550, 1790, 2030, 1080, 1770, 3490, 1690, 3840, 1930, 2570]
  }
]);
const mixedChartOptions = ref<ApexOptions>({ //
  title: { text: 'Rendimiento Financiero Mensual' },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
    type: 'category', // Cambiado de datetime
  },
  yaxis: [
    {
      title: { text: 'Euros (€)' },
    },
    {
      opposite: true,
      title: { text: 'Euros (€)' }
    },
     {
      opposite: true,
      title: { text: 'Euros (€)' }
    }
  ],
   tooltip: { //
    y: {
      formatter: (val: number) => `€${val.toLocaleString()}`,
    }
  },
});


// Datos para EchartsGauge
const dataGauge = ref(82); //
const anotherGaugeData = ref(65);

// Datos para EchartsMap
const dataDownloadsEU = ref([
  { name: "Germany", value: 15000 },
  { name: "France", value: 12000 },
  { name: "Spain", value: 16000 },
  { name: "Italy", value: 9000 },
  { name: "Netherlands", value: 8000 },
  { name: "Poland", value: 7500 },
  { name: "Portugal", value: 3000 },
  { name: "United Kingdom", value: 11000 }, //
  { name: "Ireland", value: 4500 }, //
  { name: "Sweden", value: 6000 }, //
]);

</script>

<style scoped>
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
  border-radius: 8px; /* Un poco más redondeado */
  display: flex;
  flex-direction: column; /* Para que el contenido dentro del box se organice verticalmente */
  justify-content: center;
  align-items: center; /* Centra el contenido si es más pequeño que el box */
  padding: 0; /* Quitamos padding del box si los componentes internos ya lo manejan */
  color: white;
  box-sizing: border-box; /* Importante para que el padding no aumente el tamaño */
}

/* Aplicar altura total y por filas, solo en pantallas grandes */
@media (min-width: 992px) {
  ion-grid.dashboard-grid {
    height: calc(100% - 30px); /* Ajusta si es necesario por el padding de ion-content */
    display: flex;
    flex-direction: column;
  }
  .ion-row-1 {
    height: 25%; /* Ajuste de altura para 4 sparklines */
    max-height: 25%;
  }
  .ion-row-2 {
    height: 40%;
    max-height: 40%;
  }
  .ion-row-3 {
    height: 35%; /* Ajuste de altura */
    max-height: 35%;
  }
}
</style>