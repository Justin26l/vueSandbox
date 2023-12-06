<template>
  <span style="text-align:center;">
    <!-- <stepProgress 
      linePaddingLeft='.5rem'
      lineWidth='2px'
      lineHeight='5rem'
      defaultColor="gray"
      fillColor="blue"
    >
      <div class="step-container fill">
        <p>start</p>
      </div>

      <span class="step-line fill"></span>

      <div class="step-container fill">
        <h3 class="text-base">Title</h3>
        <p>text</p>
      </div>

      <span class="step-line"></span>

      <div class="step-container">
        <h3 class="text-base">Title</h3>
        <p>text</p>
      </div>

    </stepProgress>

    <hr/> -->

    <button @click="displayType = calenderType.displayType.week">week</button>
	  <button @click="displayType = calenderType.displayType.month">month</button>
    <calender 
      @selected-date="handleSelectedDate"
      @viewing-date="handleViewingDate"
      :selected-date="selectedDate"
      :calender-task-data="calenderTaskData"
      :header="true"
      :display-type="displayType"
      :timeFrom="8"
      :timeTo="20"
    ></calender>

    <!-- <pre>calender emit "selected-date" : <br>{{selectedDate}}</pre>
    <pre>calender emit "viewing-date" : <br>{{viewingDate}}</pre> -->


    <!-- <p>123123213</p>
    <arrowProgress>
      <arrow status="done">
        step 1
      </arrow>
      <arrow status="current">
        step 2
      </arrow>
      <arrow status="default">
        step 3
      </arrow>
    </arrowProgress>
    <p>123123213</p> -->

  </span>
  <br>
  <pre class="bg-green">data</pre>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// import pipelineProgress from './components/pipelineProgress.vue'
import calender from './components/calender/index.vue';
import arrowProgress from './components/arrowProgress/index.vue';
import arrow from './components/arrowProgress/arrow.vue';

import * as calenderType from './types/calenderType';

let selectedDate = ref<Date>(new Date());
let viewingDate = ref<Date>(new Date());
let displayType = ref<calenderType.displayType>(calenderType.displayType.month);

const calenderTaskData = ref<calenderType.CalenderDataItem[]>([
  {
    year: 2023,
    month: 9,
    taskByDate: [
      { total: 3, done: 1, task: [
          {
            active: true,
            activityColor: 'red',
            activityStart: new Date('2023-10-21 12:00:00'),
            activityEnd: new Date('2023-10-21 14:00:00'),
          },
          {
            active: true,
            activityColor: 'blue',
            activityStart: new Date('2023-10-22 13:00:00'),
            activityEnd: new Date('2023-10-22 16:45:00'),
          },
          {
            active: true,
            activityColor: 'green',
            activityStart: new Date('2023-10-21 09:30:00'),
            activityEnd: new Date('2023-10-21 11:00:00'),
          },
        ]
      }
    ]
  },
  {
    year: 2023,
    month: 10,
    taskByDate: [
      {
        total: 333, done: 0, task: [
          {
            active: true,
            activityColor: 'red',
            activityStart: new Date('2023-10-21 12:00:00'),
            activityEnd: new Date('2023-10-21 14:00:00'),
          },
          {
            active: true,
            activityColor: 'blue',
            activityStart: new Date('2023-10-22 13:00:00'),
            activityEnd: new Date('2023-10-22 16:45:00'),
          },
          {
            active: true,
            activityColor: 'green',
            activityStart: new Date('2023-10-21 09:30:00'),
            activityEnd: new Date('2023-10-21 11:00:00'),
          },
        ]
      },
      { total: 3, done: 1, task: [
          {
            active: true,
            activityColor: 'red',
            activityStart: new Date('2023-10-21 12:00:00'),
            activityEnd: new Date('2023-10-21 14:00:00'),
          },
          {
            active: true,
            activityColor: 'blue',
            activityStart: new Date('2023-10-22 13:00:00'),
            activityEnd: new Date('2023-10-22 16:45:00'),
          },
          {
            active: true,
            activityColor: 'green',
            activityStart: new Date('2023-10-21 09:30:00'),
            activityEnd: new Date('2023-10-21 11:00:00'),
          },
        ]
      },
    ]
  },
  {
    year: 2023,
    month: 11,
    taskByDate: [
      { total: 5, done: 0, task: [
          {
            active: true,
            activityColor: 'red',
            activityStart: new Date('2023-10-21 12:00:00'),
            activityEnd: new Date('2023-10-21 14:00:00'),
          },
          {
            active: true,
            activityColor: 'blue',
            activityStart: new Date('2023-10-22 13:00:00'),
            activityEnd: new Date('2023-10-22 16:45:00'),
          },
          {
            active: true,
            activityColor: 'green',
            activityStart: new Date('2023-10-21 09:30:00'),
            activityEnd: new Date('2023-10-21 11:00:00'),
          },
        ]
      },
    ]
  },
])

function handleSelectedDate(date: Date) {
  selectedDate.value = date;
}

function handleViewingDate(date: Date) {
  viewingDate.value = date;
}
</script>