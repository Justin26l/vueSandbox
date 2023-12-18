<template>
  <div class="cal">
    <div>
      <h2 v-if="props.header">
        {{ selectedDate.getFullYear() + " " + months[selectedDate.getMonth()] }}
      </h2>
    </div>
    <div
      class="calender-body border-1"
      :class="calenderExpand ? 'expanded' : ''"
    >
      <div
        class="calender-side-bar"
        :class="displayWeekly && calenderExpand ? 'show' : ''"
      >
        <span class="calender-header-item"></span>
        <!-- loop (time to - timefrom) times and display timefrom + i -->
        <span v-for="i in timeLength + 1" :key="i" class="calender-header-item">
          {{ props.timeFrom + (i - 1) }}
        </span>
      </div>
      <div class="calender-main">
        <div class="calender-header">
          <span v-for="day in days" :key="day" class="calender-header-item">
            {{ day }}
          </span>
        </div>

        <div
          ref="calenderContainer"
          class="calender-grid"
          :class="{
            expanded: calenderExpand,
          }"
        >
          <div
            v-for="(calenderMonth, i) in calenderData"
            :key="i"
            :id="'calMon' + i"
            class="calender"
          >
            <div
              v-for="(calenderWeek, index) in calenderMonth.calender"
              :key="index"
              :id="'calWeek' + index"
              class="calender-row"
              :class="{
                show:
                  (!displayWeekly && calenderExpand) || rowSelected == index,
                'weekly-view': displayWeekly && rowSelected == index,
              }"
            >
              <calenderDay
                v-for="(days, idx) in calenderWeek"
                :key="idx"
                @click="updateSelectedDate(days.date, index, idx)"
                :selectedDate="selectedDate"
                :calenderDate="days.date"
                :total="days.total"
                :done="days.done"
                :task="days.task"
                :isWeekly="displayWeekly"
                :timeFrom="props.timeFrom"
                :timeTo="props.timeTo"
                :isSwiping="i == 1 ? isSwiping : false"
              >
              </calenderDay>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <pre>
    {{
      [
        calenderData[0].calender[1][0].date.toDateString(),
        calenderData[1].calender[1][0].date.toDateString(),
        calenderData[2].calender[1][0].date.toDateString(),
      ]
    }}
  </pre>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useSwipe } from "@vueuse/core";
import calenderDay from "./calenderDay.vue";
import { defineEmits } from "vue";

import * as calenderType from "~/types/calenderType";

const emit = defineEmits(["selectedDate", "viewingDate"]);
const props = defineProps<{
  displayType: calenderType.displayType;
  selectedDate: Date;
  header?: boolean;
  calenderTaskArr: calenderType.Task[];
  timeFrom: number;
  timeTo: number;
}>();

// calender data
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const calenderDate = ref<Date>(new Date());
const selectedDate = ref<Date>(props.selectedDate);

const displayWeekly = computed<boolean>(
  () => displayType.value === calenderType.displayType.week,
);
const displayType = computed<calenderType.displayType>(() => props.displayType);
watch(displayType, (newDisplayType) => {
  calenderExpand.value = newDisplayType === calenderType.displayType.week;
});

let rowSelected = ref<number>(0);
let colSelected = ref<number>(0);
let rowthreshold = computed(() =>
  calenderExpand.value && !displayWeekly.value
    ? 4
    : calenderData.value[1].rowthreshold,
);

const timeLength = computed<number>(() => props.timeTo - props.timeFrom);
// calender days event
const calenderTaskArrRef = computed<calenderType.Task[]>(() => {
  return props.calenderTaskArr;
});

const calenderData = ref<
  Array<{
    rowthreshold: number;
    calender: calenderType.dateObj[][];
  }>
>([
  getMonthlyCalendar(
    calenderDate.value.getFullYear(),
    calenderDate.value.getMonth() - 1,
    calenderTaskArrRef.value,
  ),
  getMonthlyCalendar(
    calenderDate.value.getFullYear(),
    calenderDate.value.getMonth(),
    calenderTaskArrRef.value,
  ),
  getMonthlyCalendar(
    calenderDate.value.getFullYear(),
    calenderDate.value.getMonth() + 1,
    calenderTaskArrRef.value,
  ),
]);

// touch event
const calenderContainer = ref<Element>();
const { isSwiping: isSwiping, direction: direction } =
  useSwipe(calenderContainer);

const calenderExpand = ref(false);

function getMonthlyCalendar(
  year: number,
  month: number,
  inputTaskData: calenderType.Task[],
): {
  rowthreshold: number;
  calender: calenderType.dateObj[][];
} {
  let calender: calenderType.dateObj[][] = [];
  
  // build calender matrix
  const firstDayOfMonth: number = new Date(year, month, 1).getDay() - 1;
  const lastDateOfMonth: Date = new Date(year, month + 1, 0);

  for (let weekCount = 0; weekCount < 5; weekCount++) {
    let week: calenderType.dateObj[] = [];
    for (let dayCount = 0; dayCount < 7; dayCount++) {
      const dateObj = new Date(
        year,
        month,
        dayCount - firstDayOfMonth + weekCount * 7,
      );
      const isTargetMonth = dateObj.getMonth() == month;

      week.push({
        date: dateObj,
        total: 0,
        done: 0,
        task: [],
      });
    }
    calender.push(week);
  }
  // console.log('calender matrix', calender);

  // console.log('inputTaskData.length',inputTaskData.length)
  // add task into matrix
  inputTaskData.forEach((task: calenderType.Task)=>{
    // if startDate is same year & month
    if( task.StartDate.getFullYear() == year && task.StartDate.getMonth() == month ){
      console.log('task: ' + task.StartDate.toDateString())
      let row = task.StartDate.getDate() < 7  ? 0 :
                task.StartDate.getDate() > 7  ? 1 : // if startDate.date > 7, skip searching first week's row
                task.StartDate.getDate() > 14 ? 2 : // > 14, skip 2nd row
                task.StartDate.getDate() > 21 ? 3 : // > 21, skip 3rd row
                task.StartDate.getDate() > 28 ? 4 : // > 28, skip 4th row
                0; // default

      // search and push into calender
      for(let i = row; i < calender.length; i++){
        for(let j = 0; j < calender[i].length; j++){
          if(calender[i][j].date.toDateString() === task.StartDate.toDateString()){
            console.log('matrix position of '+task.StartDate.toDateString(), {
              row: i,
              col: j,
            })
            calender[i][j].task.push(task);
            calender[i][j].total += 1;
            if(task.done){
              calender[i][j].done += 1;
            }
            break;
          }
        }
      }
    }
    else{
      console.log('task month: ' + months[task.StartDate.getMonth()] + ' is not in this month '+ months[new Date(year, month, 1).getMonth()] )
    }
  })

  // if lastDateOfMonth is not found in calender[4], monthlyRowThreshold is 4
  const rowthreshold = calender[4][6].date <= lastDateOfMonth ? 4 : 3;
  return {
    rowthreshold: rowthreshold,
    calender: calender,
  };
}

function updateSelectedDate(date: Date, row?: number, col?: number): void {
  selectedDate.value = date;
  if (col && row) {
    rowSelected.value = row;
    colSelected.value = col;
  }
  emit("selectedDate", selectedDate.value);
}

// touch event

function calenderPrevMonth(): void {
  rowSelected.value = calenderData.value[0].rowthreshold;

  if (calenderExpand.value && !displayWeekly.value) {
    updateSelectedDate(
      new Date(
        calenderDate.value.getFullYear(),
        calenderDate.value.getMonth(),
        0,
      ),
    );
  } else {
    updateSelectedDate(
      calenderData.value[0].calender[calenderData.value[0].rowthreshold][
        colSelected.value
      ].date,
    );
  }
  calenderContainer.value?.classList.add("slide-right");
  setTimeout(() => {
    calenderContainer.value?.classList.remove("slide-right");
    calenderDate.value.setMonth(calenderDate.value.getMonth() - 1);
    calenderData.value = [
      getMonthlyCalendar(
        calenderDate.value.getFullYear(),
        calenderDate.value.getMonth() - 1,
        calenderTaskArrRef.value,
      ),
      calenderData.value[0],
      calenderData.value[1],
    ];
  }, 200);
}

function calenderNextMonth(): void {
  rowSelected.value = 0;
  if (calenderExpand.value && !displayWeekly.value) {
    updateSelectedDate(
      new Date(
        calenderDate.value.getFullYear(),
        calenderDate.value.getMonth() + 1,
        1,
      ),
    );
  } else {
    updateSelectedDate(
      calenderData.value[2].calender[0][colSelected.value].date,
    );
  }

  calenderContainer.value?.classList.add("slide-left");
  setTimeout(() => {
    calenderContainer.value?.classList.remove("slide-left");
    calenderDate.value.setMonth(calenderDate.value.getMonth() + 1);
    calenderData.value = [
      calenderData.value[1],
      calenderData.value[2],
      getMonthlyCalendar(
        calenderDate.value.getFullYear(),
        calenderDate.value.getMonth() + 1,
        calenderTaskArrRef.value,
      ),
    ];
  }, 200);
}

watch([isSwiping, direction], ([isSwiping, direction]) => {
  if (!isSwiping) {
    if (direction === "down") {
      calenderExpand.value = true;
    } else if (direction === "up") {
      calenderExpand.value = false;
    }
    // monthly expanded only
    else if (calenderExpand.value && !displayWeekly.value) {
      if (direction === "left") {
        calenderNextMonth();
      } else if (calenderExpand.value && direction === "right") {
        calenderPrevMonth();
      }
    }
    // weekly & folded
    else if (!calenderExpand.value || displayWeekly.value) {
      if (direction === "left") {
        if (rowSelected.value >= rowthreshold.value) {
          calenderNextMonth();
        } else {
          updateSelectedDate(
            new Date(
              selectedDate.value.getFullYear(),
              selectedDate.value.getMonth(),
              selectedDate.value.getDate() + 7,
            ),
          );
          rowSelected.value += 1;
        }
      } else if (direction === "right") {
        if (rowSelected.value <= 0) {
          calenderPrevMonth();
        } else {
          updateSelectedDate(
            new Date(
              selectedDate.value.getFullYear(),
              selectedDate.value.getMonth(),
              selectedDate.value.getDate() - 7,
            ),
          );
          rowSelected.value -= 1;
        }
      }
    }
  }
});

onMounted(() => {
// find selected date in calenderData
for(let i = 0; i < calenderData.value.length; i++){
      for(let j = 0; j < calenderData.value[i].calender.length; j++){
        for(let k = 0; k < calenderData.value[i].calender[j].length; k++){
          if(calenderData.value[i].calender[j][k].date.toDateString() === selectedDate.value.toDateString()){
            rowSelected.value = j;
            colSelected.value = k;
            // selected grid position
            // console.log({
            //   row: j,
            //   col: k,
            // })
            break;
          }
        }
      }
    }
});
</script>
