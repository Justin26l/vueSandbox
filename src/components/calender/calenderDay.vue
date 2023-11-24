<template>
    <div class="dateCol" 
        :class="
            refSelectedMonth != calenderMonth ? 'bg-gray-300' : 
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
