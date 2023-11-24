<template>
    <div class="dateCol" 
        :class="
            xselectedMonth != calenderMonth ? 'bg-gray-300' : 
            isSelected ? 'bg-blue-200' :
            'bg-white' 
        "
    >
        <span :class="isToday? 'rounded-full bg-green-500 p-1' : '' ">{{ calenderDate }}</span>
        <p :class="
            isToday ? 'bg-green-500' : 
            isPast ? 'bg-red-500' : 
            isFuture? 'bg-blue-500': '' "
        >{{ isToday ? (taskDone +'/'+ taskTotal) : taskPending }}</p>
    </div>
</template>

<style scoped>
.dateCol{
    flex: 1;
    text-align: center;
    border: .5px solid lightgray;
}
</style>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { defineProps } from 'vue';

const props = defineProps({
    selectedDate: {
        type: Number,
        required: true
    },
    selectedMonth: {
        type: Number,
        required: true
    },
    selectedYear: {
        type: Number,
        required: true
    },

    calenderDay: {
        type: Number,
        required: true
    },
    calenderDate: {
        type: Number,
        required: true
    },
    calenderMonth: {
        type: Number,
        required: true
    },
    calenderYear: {
        type: Number,
        required: true
    },

    taskTotal: {
        type: Number,
        required: true
    },
    taskDone: {
        type: Number,
        required: true
    },
});

const taskTotal = ref(props.taskTotal);
const taskDone = ref(props.taskDone);
const taskPending = ref(taskTotal.value - taskDone.value);

const xselectedDate = computed(()=>props.selectedDate);
const xselectedMonth = computed(()=>props.selectedMonth);
const xselectedYear = computed(()=>props.selectedYear);

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();


const isToday = ref(
    todayDate == props.calenderDate && todayMonth == props.calenderMonth && todayYear == props.calenderYear
);
const isPast = ref(
    todayYear > props.calenderYear || 
    (todayYear == props.calenderYear && todayMonth > props.calenderMonth) || 
    (todayYear == props.calenderYear && todayMonth == props.calenderMonth && todayDate > props.calenderDate)
);

const isFuture = ref(
    todayYear < props.calenderYear || 
    (todayYear == props.calenderYear && todayMonth < props.calenderMonth) || 
    (todayYear == props.calenderYear && todayMonth == props.calenderMonth && todayDate < props.calenderDate)
);

const isSelected = computed(()=>{
    return xselectedDate.value == props.calenderDate && xselectedMonth.value == props.calenderMonth && xselectedYear.value == props.calenderYear;
});
</script>
