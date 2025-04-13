<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGlobalState } from '../../store/store';

const { state } = useGlobalState();

const numTotal = ref(0);
const numHull = ref(0);
const numCollinear = ref(0);
const numRegular = ref(0);
const calcTime2D = ref('NaN');

watch(
  () => state.value.raw.raw2D,
  () => {
    const { calculated } = state.value;

    numHull.value = calculated.hull2D.length;
    numCollinear.value = calculated.collinear2D.length;
    numRegular.value = calculated.regular2D.length;
    numTotal.value = numHull.value + numCollinear.value + numRegular.value;
  },
  { immediate: true, deep: true }
);

watch(
  () => state.value.calculated.calcTime2D,
  () => {
    calcTime2D.value = state.value.calculated.calcTime2D?.toFixed(2) + ' ms' || 'NaN';
  },
  { immediate: true }
);

const stats = [
  {
    title: 'Total Entries',
    icon: 'pi-info-circle',
    value: numTotal,
    subtitle: 'Last 7 days',
  },
  {
    title: 'Convex Hull Nodes',
    icon: 'pi-circle-fill',
    value: numHull,
    subtitle: 'Last 7 days',
  },
  {
    title: 'Collinear Nodes',
    icon: 'pi-minus-circle',
    value: numCollinear,
    subtitle: 'Last 7 days',
  },
  {
    title: 'Computation Time',
    icon: 'pi-clock',
    value: calcTime2D.value,
    subtitle: 'Last 7 days',
  },
  //{
  //  title: 'Regular Points',
  //  icon: 'pi-circle',
  //  value: numRegular,
  //  subtitle: 'Last 7 days',
  //},
];
</script>

<template>
  <div class="stats">
    <div v-for="(stat, index) in stats" :key="index" class="layout-card">
      <div class="stats-header">
        <span class="stats-title">{{ stat.title }}</span>
        <span class="stats-icon-box">
          <i :class="['pi', stat.icon]"></i>
        </span>
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stat.value }}</div>
        <div class="stats-subtitle">{{ stat.subtitle }}</div>
      </div>
    </div>
  </div>
</template>
