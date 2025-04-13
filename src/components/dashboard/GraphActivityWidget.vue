<script setup lang="ts">
//import { Queue } from '../../util/queue';

const activities = [
  {
    icon: 'pi-calculator',
    text: 'New calculation #1123',
    time: '2 minutes ago',
    color: 'blue',
  },
  {
    icon: 'pi-plus',
    text: 'Inserted Point (2, 2)',
    time: '2 minutes ago',
    color: 'green',
  },
  {
    icon: 'pi-upload',
    text: 'Uploaded CSV file',
    time: '25 minutes ago',
    color: 'yellow',
  },
  {
    icon: 'pi-trash',
    text: 'Reset Data.',
    time: '40 minutes ago',
    color: 'red',
  },
];

//const activities = [
//  {
//    icon: 'pi-shopping-cart',
//    text: 'New order #1123',
//    time: '2 minutes ago',
//    color: 'pink',
//  },
//  {
//    icon: 'pi-user-plus',
//    text: 'New customer registered',
//    time: '15 minutes ago',
//    color: 'green',
//  },
//  {
//    icon: 'pi-check-circle',
//    text: 'Payment processed',
//    time: '25 minutes ago',
//    color: 'blue',
//  },
//  {
//    icon: 'pi-inbox',
//    text: 'Inventory updated',
//    time: '40 minutes ago',
//    color: 'yellow',
//  },
//];
</script>

<template>
  <div class="layout-card col-item-2">
    <span class="chart-title">Recent Activity</span>
    <div class="activity-list">
      <div v-for="(activity, index) in activities" :key="index" class="activity-item">
        <i :class="['activity-icon', activity.color, 'pi', activity.icon]"></i>
        <div class="activity-content">
          <span class="activity-text">{{ activity.text }}</span>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
