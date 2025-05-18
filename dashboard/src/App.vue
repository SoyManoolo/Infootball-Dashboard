<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Dashboard</ion-list-header>
            <ion-note>Data Visualization</ion-note>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url"
                lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // [cite: 22]
import { rocketOutline, rocketSharp, pulseOutline, pulseSharp, speedometerOutline, speedometerSharp } from 'ionicons/icons';

const selectedIndex = ref(0);
const appPages = [
  {
    title: 'Negocio',
    url: '/negocio',
    iosIcon: rocketOutline,
    mdIcon: rocketSharp,
  },
  {
    title: 'Técnico',
    url: '/tecnico',
    iosIcon: pulseOutline,
    mdIcon: pulseSharp,
  },
  {
    title: 'KPIs',
    url: '/kpis',
    iosIcon: speedometerOutline,
    mdIcon: speedometerSharp,
  },
];

const route = useRoute(); // [cite: 22]

// Función para actualizar el selectedIndex según la URL actual [cite: 17]
const updateSelectedIndex = () => {
  const currentPath = route.path;
  const index = appPages.findIndex(page => page.url === currentPath);
  if (index !== -1) {
    selectedIndex.value = index;
  }
};

// Ejecutar cuando la app carga [cite: 18]
onMounted(updateSelectedIndex);

// Ejecutar cada vez que cambia la ruta [cite: 19]
watch(route, updateSelectedIndex);

</script>

<style scoped>
/* Estilos del menú (simplificado del PDF) */
ion-split-pane {
  --side-max-width: 280px; /* [cite: 13] */
}

ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content { /* [cite: 23] */
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list { /* [cite: 24] */
  padding: 20px 0;
}

ion-menu.md ion-note { /* [cite: 24] */
  margin-bottom: 30px;
  padding-left: 10px;
}

ion-menu.md ion-list-header { /* [cite: 24] */
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
  padding-left: 10px;
}

ion-menu.md ion-item { /* [cite: 24] */
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected { /* [cite: 24] */
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon { /* [cite: 25] */
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon { /* [cite: 25] */
  color: #616e7e;
}

ion-menu.md ion-item ion-label { /* [cite: 25] */
  font-weight: 500;
}

/* Estilos iOS del menú (simplificado del PDF) */
ion-menu.ios ion-content { /* [cite: 25] */
  --padding-bottom: 20px;
}

ion-menu.ios ion-list { /* [cite: 26] */
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note { /* [cite: 26] */
  line-height: 24px;
  margin-bottom: 20px;
  padding-left: 16px; /* [cite: 28] */
  padding-right: 16px; /* [cite: 28] */
}

ion-menu.ios ion-item { /* [cite: 26] */
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px; /* [cite: 27] */
}

ion-menu.ios ion-item.selected ion-icon { /* [cite: 27] */
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon { /* [cite: 27] */
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list-header { /* [cite: 28] */
 padding-left: 16px;
 padding-right: 16px;
}

ion-item.selected { /* [cite: 29] */
  --color: var(--ion-color-primary);
}
</style>