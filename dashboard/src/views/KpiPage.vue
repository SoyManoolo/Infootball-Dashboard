<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>KPIs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">KPIs</ion-title>
        </ion-toolbar>
      </ion-header>

      <h1 class="ion-padding">KPIs de Negocio</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in smartGoalsNegocio" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b>: {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <br />

      <h1 class="ion-padding">KPIs Técnicos</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in smartGoalsTecnico" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b>: {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>
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
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/vue';
import { ref } from 'vue';

// Definición de la estructura de datos para un objetivo SMART
interface SmartElement {
  letter: string;
  content: string;
}

interface SmartGoal {
  id: number;
  title: string;
  description: string;
  smart: SmartElement[];
}

// Array de objetivos SMART para Negocio (ejemplo)
const smartGoalsNegocio = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Aumentar visitas",
    description: "Aumentar las visitas de nuestro sitio web en un 50%...",
    smart: [
      { letter: "S", content: "Aumentar las visitas de nuestro sitio web en un 50%" },
      { letter: "M", content: "50% (de 1,000 a 1,500)" },
      { letter: "A", content: "duplicando la distribución de contenido" },
      { letter: "R", content: "para prepararnos para el lanzamiento de nuestro nuevo producto." },
      { letter: "T", content: "en los siguientes 30 días" }
    ]
  },
]);

// Array de objetivos SMART para Técnico (ejemplo) - Deberías definir datos similares para los KPIs técnicos
const smartGoalsTecnico = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Reducir tiempo de carga",
    description: "Reducir el tiempo de carga promedio de las páginas principales en un 20%...",
    smart: [
      { letter: "S", content: "Reducir tiempo de carga" },
      { letter: "M", content: "20%" },
      { letter: "A", content: "Optimizando imágenes y scripts" },
      { letter: "R", content: "Mejorar la experiencia de usuario" },
      { letter: "T", content: "Próximos 2 meses" }
    ]
  },
]);

</script>

<style scoped>
ion-accordion.accordion-collapsing ion-item[slot='header'],
ion-accordion.accordion-collapsed ion-item[slot='header'] {
  --background: var(--ion-color-light);
  --color: var(--ion-color-light-contrast);
}

ion-accordion.accordion-expanding ion-item[slot='header'],
ion-accordion.accordion-expanded ion-item[slot='header'] {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
  --color: var(--ion-color-primary);
}
</style>