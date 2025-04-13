<template>
  <Toast />
  <DynamicDialog />
  <!--
    <ConfirmDialog v-model:visible="showDialog">
      <ProgressBar :value="100" :style="{ width: '100%' }" />
    </ConfirmDialog>
  -->
  <div class="layout-container">
    <AppTopbar />
    <div class="layout-grid">
      <GraphStatsWidget />
      <div class="layout-grid-row">
        <GraphTrendWidget />
        <GraphActivityWidget />
      </div>
      <GraphSettingsWidget />
      <component :is="currentGraphComponent" />
      <GraphDataTableWidget />
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppTopbar from './components/AppTopbar.vue';
import AppFooter from './components/AppFooter.vue';
import GraphStatsWidget from './components/dashboard/GraphStatsWidget.vue';
import GraphTrendWidget from './components/dashboard/GraphTrendWidget.vue';
import GraphActivityWidget from './components/dashboard/GraphActivityWidget.vue';
import GraphSettingsWidget from './components/dashboard/GraphConfigWidget.vue';
import Graph2DWidget from './components/dashboard/Graph2DWidget.vue';
import Graph3DWidget from './components/dashboard/Graph3DWidget.vue';
import GraphDataTableWidget from './components/dashboard/GraphDataTableWidget.vue';
import LoadingDialog from './components/dashboard/LoadingDialog.vue';

import { useGlobalState } from './store/store';
import { computed, ref, watch } from 'vue';
import { DynamicDialog, useDialog } from 'primevue';

const { state } = useGlobalState();

const currentGraphComponent = computed(() =>
  state.value.config.dimension === '2D' ? Graph2DWidget : Graph3DWidget
);

const dialog = useDialog();
const dialogRef = ref(null);

const showProgress = () => {
  dialogRef.value = dialog.open(LoadingDialog, {
    modal: true,
    closable: false,
    data: { dialogRef },
  });
};

watch(currentGraphComponent, (newValue) => {
  if (newValue === Graph2DWidget || Graph3DWidget) {
    showProgress();
  }
});
</script>
