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
import { ref, onMounted, onUnmounted } from 'vue'; // <--- Añadido onUnmounted
import { statsChartOutline, personAddOutline, trophyOutline, handRightOutline } from 'ionicons/icons';

// Componentes de Gráficos
import SparkLine from '@/components/SparkLine.vue';
import ApexMixedChart from '@/components/ApexMixedChart.vue';
import EchartsGauge from '@/components/EchartsGauge.vue';
import EchartsMap from '@/components/EchartsMap.vue';
import type { ApexOptions } from 'apexcharts';

const UPDATE_NEGOCIO_INTERVAL = 2500; // Intervalo para actualizar datos de negocio (más lento que técnico)
let negocioIntervalId: ReturnType<typeof setInterval>;

// --- DATOS EJEMPLO PARA INFOOTBALL ---

const sparkUsuariosActivos = ref({
  title: "USUARIOS ACTIVOS HOY",
  value: "1,234",
  bgColor: "gradient-blue",
  textColor: "white",
  iconName: statsChartOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'smooth' as const, width: 3}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Actividad', data: Array(10).fill(0).map(() => Math.floor(Math.random() * 80) + 20) }], // Datos iniciales aleatorios
});

const sparkNuevosRegistros = ref({
  title: "NUEVOS USUARIOS (24H)",
  value: "58",
  bgColor: "gradient-green",
  textColor: "white",
  iconName: personAddOutline,
  chartOptions: { chart: { type: 'bar' as const }, colors:['#fff'], stroke: {width:0}, fill: {type: 'solid', opacity:0.6}},
  chartSeries: [{ name: 'Registros', data: Array(10).fill(0).map(() => Math.floor(Math.random() * 15)) }],
});

const sparkLigasSeguidas = ref({ // Este podría no ser en tiempo real, sino actualizarse menos frecuentemente
  title: "LIGAS MÁS SEGUIDAS",
  value: "LaLiga",
  bgColor: "gradient-orange",
  textColor: "white",
  iconName: trophyOutline,
  chartOptions: { chart: { type: 'line' as const }, stroke: { curve: 'straight' as const, width: 2}, colors:['#fff'], fill: {type:'solid', opacity:0.3}},
  chartSeries: [{ name: 'Interés', data: [60, 65, 70, 68, 72, 75, 73, 70, 76, 80] }],
});

const sparkInteracciones = ref({
  title: "INTERACCIONES HOY",
  value: "10.5K",
  bgColor: "gradient-pink",
  textColor: "white",
  iconName: handRightOutline,
  chartOptions: { chart: { type: 'area' as const }, stroke: { curve: 'stepline' as const, width: 2}, colors:['#fff'], fill: {type:'gradient', gradient: {opacityFrom: 0.7, opacityTo: 0.1}}},
  chartSeries: [{ name: 'Interacciones', data: Array(10).fill(0).map(() => Math.floor(Math.random() * 500) + 100) }],
});

// Datos para ApexMixedChart (generalmente no se actualizan cada segundo)
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

// Datos para Gauges
const tasaRetencion = ref(75);
const featureAdoptionRate = ref(45);

// Datos para Mapa (generalmente no se actualizan cada segundo)
const datosMapaLigas = ref([
  { name: "Spain", value: 50000 },
  { name: "United Kingdom", value: 45000 },
  { name: "Italy", value: 30000 },
  { name: "Germany", value: 28000 },
  { name: "France", value: 25000 },
]);

function actualizarDatosNegocio() {
  // Actualizar SparkLine Usuarios Activos
  const nuevosUsuariosActivosVal = Math.floor(Math.random() * 500) + 1000;
  const nuevaSerieUsuariosActivos = [...sparkUsuariosActivos.value.chartSeries[0].data.slice(1), Math.floor(Math.random() * 80) + 20];
  sparkUsuariosActivos.value = {
    ...sparkUsuariosActivos.value,
    value: nuevosUsuariosActivosVal.toLocaleString(),
    chartSeries: [{ name: 'Actividad', data: nuevaSerieUsuariosActivos }]
  };

  // Actualizar SparkLine Nuevos Registros
  const nuevosRegistrosVal = Math.floor(Math.random() * 100);
  const nuevaSerieNuevosRegistros = [...sparkNuevosRegistros.value.chartSeries[0].data.slice(1), nuevosRegistrosVal];
  sparkNuevosRegistros.value = {
    ...sparkNuevosRegistros.value,
    value: nuevosRegistrosVal.toString(),
    chartSeries: [{ name: 'Registros', data: nuevaSerieNuevosRegistros }]
  };

  // Actualizar SparkLine Interacciones
  const nuevasInteraccionesVal = Math.floor(Math.random() * 2000) + 9000;
  const nuevaSerieInteracciones = [...sparkInteracciones.value.chartSeries[0].data.slice(1), Math.floor(Math.random() * 700) + 200];
  sparkInteracciones.value = {
    ...sparkInteracciones.value,
    value: `${(nuevasInteraccionesVal / 1000).toFixed(1)}K`,
    chartSeries: [{ name: 'Interacciones', data: nuevaSerieInteracciones }]
  };

  // Actualizar Gauges
  tasaRetencion.value = Math.floor(Math.random() * 30) + 60; // 60-90%
  featureAdoptionRate.value = Math.floor(Math.random() * 50) + 25; // 25-75%

  // Podrías actualizar sparkLigasSeguidas o datosMapaLigas con menos frecuencia o de otra forma
}

onMounted(() => {
  actualizarDatosNegocio(); // Llama una vez al montar para datos iniciales aleatorios
  negocioIntervalId = setInterval(actualizarDatosNegocio, UPDATE_NEGOCIO_INTERVAL);
});

onUnmounted(() => {
  clearInterval(negocioIntervalId); // Limpiar el intervalo al desmontar
});

</script>

<style scoped>
/* Estilos idénticos a la respuesta anterior, asegurando consistencia */
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
  .ion-row { flex-shrink: 0; }
  .ion-row-1 { height: 25%; }
  .ion-row-1 .box { min-height: 130px; }
  .ion-row-2 { height: 35%; }
  .ion-row-2 .box { min-height: 220px; } /* Reducido para dar más espacio a la fila 3 si es necesario */
  .ion-row-3 { height: 40%; }
  .ion-row-3 .box { min-height: 240px; } /* Reducido ligeramente */
  .box-map, .box-gauge-bottom {
    min-height: 240px; /* Ajustado */
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  ion-grid.dashboard-grid { gap: 16px; }
  .box { min-height: 180px; }
  .ion-row-1 .box { min-height: 140px; }
  .ion-row-2 .box { min-height: 280px; }
  .ion-row-3 .box { min-height: 300px; } /* Reducido ligeramente */
  .box-map, .box-gauge-bottom { min-height: 300px; }
}

@media (max-width: 767px) {
  .box { margin-bottom: 16px; /* No height 100% aquí */ }
  .ion-row-1 .box { min-height: 150px; height: 150px; }
  .ion-row-2 .box { min-height: 280px; } /* ApexMixedChart y EchartsGauge */
  .ion-row-2 ion-col[size-lg="3"] .box { height: 220px; min-height: 220px; } /* EchartsGauge */

  .ion-row-3 .box { min-height: 280px; } /* EchartsMap y EchartsGauge */
  .box-map { min-height: 300px; }
  .box-gauge-bottom { min-height: 260px; }
}
</style>