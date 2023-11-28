<template>
    <div class="date-col" 
        :class="
            isSelected ? 'selected-date' :
            refSelectedMonth == calenderMonth ? 'selected-month' : 
            '' 
        "
    >
        <div>
            <span :class="isToday? 'today' : '' ">{{ calenderDate }}</span>
        </div>
        <p v-if=" taskPending > 0 || isToday" 
            class="task-mark"
            :class="
                isToday ? 'bg-green-500' : 
                isPast ? 'bg-red-500' : 
                isFuture? 'bg-green-500': '' "
        >{{ isToday ? (taskDone +'/'+ taskTotal) : taskPending }}</p>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { defineProps } from 'vue';

const props = defineProps({
    selectedDate: {
        type: Number,
        default: new Date().getDate(),
        required: true
    },
    selectedMonth: {
        type: Number,
        default: new Date().getMonth(),
        required: true
    },
    selectedYear: {
        type: Number,
        default: new Date().getFullYear(),
        required: true
    },

    calenderDay: {
        type: Number,
        default: new Date().getDay(),
        required: true
    },
    calenderDate: {
        type: Number,
        default: new Date().getDate(),
        required: true
    },
    calenderMonth: {
        type: Number,
        default: new Date().getMonth(),
        required: true
    },
    calenderYear: {
        type: Number,
        default: new Date().getFullYear(),
        required: true
    },

    taskTotal: {
        type: Number,
        default: 0,
        required: true
    },
    taskDone: {
        type: Number,
        default: 0,
        required: true
    },
});

const taskTotal = computed(()=>props.taskTotal);
const taskDone = computed(()=>props.taskDone);
const taskPending = computed(()=>taskTotal.value - taskDone.value);

const refSelectedDate  = computed(()=>props.selectedDate);
const refSelectedMonth = computed(()=>props.selectedMonth);
const refSelectedYear  = computed(()=>props.selectedYear);

const refCalenderDate  = computed(()=> props.calenderDate);
const refCalenderMonth = computed(()=> props.calenderMonth);
const refCalenderYear  = computed(()=> props.calenderYear);

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();

const isToday = computed(()=>
    todayDate == refCalenderDate.value && todayMonth == refCalenderMonth.value && todayYear == refCalenderYear.value
);
const isPast = computed(()=>
    todayYear > refCalenderYear.value || 
    (todayYear == refCalenderYear.value && todayMonth > refCalenderMonth.value) || 
    (todayYear == refCalenderYear.value && todayMonth == refCalenderMonth.value && todayDate > refCalenderDate.value)
);

const isFuture = computed(()=>
    todayYear < refCalenderYear.value || 
    (todayYear == refCalenderYear.value && todayMonth < refCalenderMonth.value) || 
    (todayYear == refCalenderYear.value && todayMonth == refCalenderMonth.value && todayDate < refCalenderDate.value)
);

const isSelected = computed(()=>{
    return refSelectedDate.value == refCalenderDate.value && 
        refSelectedMonth.value == refCalenderMonth.value && 
        refSelectedYear.value == refCalenderYear.value;
});

</script>
