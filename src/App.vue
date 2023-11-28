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

    <calender 
      @selected-date="handleSelectedDate"
      :selected-date="selectedDate.date"
      :selected-month="selectedDate.month"
      :selected-year="selectedDate.year"
      :calender-task-data="calenderTaskData"
      :display-type="calenderType.displayType.date"
    ></calender>

    <pre>calender emit "selected-date" : {{selectedDate}}</pre>


    <p>123123213</p>
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
    <p>123123213</p>

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

let selectedDate = ref({
  day: new Date().getDay(),
  date: new Date().getDate(),
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
});

const calenderTaskData = ref<calenderType.CalenderDataItem[]>([
  {
    year: 2023,
    month: 9,
    taskByDate: [
      { total: 0, done: 0, task: [] },
      { total: 3, done: 1, task: [] },
      { total: 6, done: 6, task: [] },
      { total: 6, done: 5, task: [] },
      { total: 6, done: 8, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 6, done: 1, task: [] },
    ]
  },
    {
    year: 2023,
    month: 10,
    taskByDate: [
      { total: 0, done: 0, task: [] },
      { total: 3, done: 1, task: [] },
      { total: 6, done: 6, task: [] },
      { total: 6, done: 5, task: [] },
      { total: 6, done: 8, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 6, done: 1, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 2, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 5, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 17, done: 0, task: [] },
      { total: 3, done: 0, task: [
          {
            active: true,
            activityColor: 'red',
            activityStartDate: '2023-11-25',
            activityStartTime: '12:00:00',
            activityEndDate: '2023-11-25',
            activityEndTime: '12:30:00',
          },
          {
            active: true,
            activityColor: 'blue',
            activityStartDate: '2023-11-26',
            activityStartTime: '11:00:00',
            activityEndDate: '2023-11-26',
            activityEndTime: '16:00:00',
          },
          {
            active: true,
            activityColor: 'green',
            activityStartDate: '2023-11-26',
            activityStartTime: '18:00:00',
            activityEndDate: '2023-11-26',
            activityEndTime: '19:00:00',
          },
        ]
      },
    ]
  },
    {
    year: 2023,
    month: 11,
    taskByDate: [
      { total: 0, done: 0, task: [] },
      { total: 5, done: 0, task: [] },
      { total: 0, done: 0, task: [] },
      { total: 3, done: 0, task: [] },
    ]
  },
])

function handleSelectedDate(data: { day: number; date: number; month: number; year: number}) {
  selectedDate.value = data;
}
</script>