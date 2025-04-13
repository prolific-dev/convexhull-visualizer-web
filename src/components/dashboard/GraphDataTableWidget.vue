<template>
  <div class="layout-card">
    <div class="products-header">
      <span class="products-title">Data Table Overview</span>
      <IconField class="search-field">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Search data..."
          class="products-search"
          @keyup.enter="searchPoints"
        />
      </IconField>
    </div>
    <DataTable
      v-if="getDimension() === '2D' && points2D.length"
      :value="points2D"
      scrollable
      scrollHeight="400px"
      tableStyle="min-width: 30rem"
    >
      <Column field="x" header="X-Value" sortable></Column>
      <Column field="y" header="Y-Value" sortable></Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }">
          <Tag
            :severity="
              data.type === 'Default' ? 'info' : data.type === 'Collinear' ? 'warn' : 'success'
            "
          >
            {{ data.type }}
          </Tag>
        </template>
      </Column>
    </DataTable>
    <DataTable
      v-else-if="getDimension() === '3D' && points3D.length"
      :value="points3D"
      scrollable
      scrollHeight="400px"
      tableStyle="min-width: 30rem"
    >
      <Column field="x" header="X-Value" sortable></Column>
      <Column field="y" header="Y-Value" sortable></Column>
      <Column field="z" header="Z-Value" sortable></Column>
      <Column field="type" header="Type" sortable>
        <template #body="{ data }">
          <Tag
            :severity="
              data.type === 'Default' ? 'info' : data.type === 'Collinear' ? 'warn' : 'success'
            "
          >
            {{ data.type }}
          </Tag>
        </template>
      </Column>
    </DataTable>
    <p v-else>No data available</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { DataTable, Column } from 'primevue';
import { useGlobalState } from '../../store/store';

const { state, getDimension } = useGlobalState();

const searchQuery = ref('');
const loading = ref(false);
const points2D = ref<Array<{ x: number; y: number; type: string }>>([]);
const points3D = ref<Array<{ x: number; y: number; z: number; type: string }>>([]);
const filteredData2D = ref<Array<{ x: number; y: number; type: string }>>([]);
const filteredData3D = ref<Array<{ x: number; y: number; z: number; type: string }>>([]);

const searchPoints = () => {
  loading.value = true;

  if (getDimension() === '2D') {
    filteredData2D.value = points2D.value.filter(
      (point) =>
        point.x.toString().includes(searchQuery.value) ||
        point.y.toString().includes(searchQuery.value) ||
        point.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    filteredData3D.value = points3D.value.filter(
      (point) =>
        point.x.toString().includes(searchQuery.value) ||
        point.y.toString().includes(searchQuery.value) ||
        point.z.toString().includes(searchQuery.value) ||
        point.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  setTimeout(() => {
    loading.value = false;
  }, 300);
};

const buildDataEntries = () => {
  const calculated = state.value.calculated;

  if (getDimension() === '2D') {
    points2D.value = [];

    calculated.regular2D?.forEach((p) => {
      points2D.value.push({ x: p.x, y: p.y, type: 'Default' });
    });

    calculated.collinear2D?.forEach((p) => {
      points2D.value.push({ x: p.x, y: p.y, type: 'Collinear' });
    });

    calculated.hull2D?.forEach((p) => {
      points2D.value.push({ x: p.x, y: p.y, type: 'Convex Hull' });
    });

    filteredData2D.value = [...points2D.value];
  } else {
    points3D.value = [];

    calculated.regular3D?.forEach((p) => {
      points3D.value.push({ x: p.x, y: p.y, z: p.z, type: 'Default' });
    });

    calculated.collinear3D?.forEach((p) => {
      points3D.value.push({ x: p.x, y: p.y, z: p.z, type: 'Collinear' });
    });

    calculated.hull3D?.forEach((p) => {
      points3D.value.push({ x: p.x, y: p.y, z: p.z, type: 'Convex Hull' });
    });

    filteredData3D.value = [...points3D.value];
  }
};

watch(searchQuery, searchPoints);

watch(
  () => state.value.raw.raw2D || state.value.raw.raw3D,
  () => {
    buildDataEntries();
  },
  { deep: true }
);

onMounted(() => {
  buildDataEntries();
});
</script>
