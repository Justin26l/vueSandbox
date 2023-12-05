<template>
    <div class="date-col"
        :class="{
            'weekly-view' : isWeekly,
            'selected-date' : isSelected,
            'selected-month' : isSameMonth,
        }"
    >
        <div>
            <span :class="isToday? 'today' : '' ">{{ calenderDate.getDate() }}</span>
        </div>
        <p v-if=" taskPending > 0 || isToday" 
            class="task-mark"
            :class="isWeekly? 'weekly-view' : ''"
            :style="
                isToday ? 'background:green;' : 
                isPast ? 'background:red;' : 
                isFuture? 'background:green;': '' "
        >{{ isToday ? (taskDone +'/'+ taskTotal) : taskPending }}</p>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { defineProps } from 'vue';

const props = defineProps<{
    selectedDate: Date,
    calenderDate: Date,
    taskTotal: number,
    taskDone: number,
    isWeekly?: boolean,
}>();

const taskTotal     = computed(()=>props.taskTotal);
const taskDone      = computed(()=>props.taskDone);
const taskPending   = computed(()=>taskTotal.value - taskDone.value);
const isWeekly      = computed(()=>props.isWeekly);

const refSelected   = computed(()=>props.selectedDate);
const refCalender   = computed(()=>props.calenderDate);
const today         = new Date();

const isToday = computed<boolean>(()=>isSameDay(today, refCalender.value));

const isPast = computed<boolean>(()=> today > refCalender.value);

const isFuture = computed<boolean>(()=> today < refCalender.value );

const isSameMonth = computed<boolean>(()=>refSelected.value.getMonth() == refCalender.value.getMonth());

const isSelected = computed<boolean>(()=>isSameDay(refSelected.value, refCalender.value));

function isSameDay(d1: Date, d2: Date): boolean {
    return Math.floor(d1.getTime()/86400000) == Math.floor(d2.getTime()/86400000)
}

</script>
