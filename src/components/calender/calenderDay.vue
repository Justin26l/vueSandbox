<template>
    <div
    @click="consoel.log()"
        ref="dateColRef"
        class="date-col border-1"
        :class="{
            'weekly-view' : isWeekly,
            'selected-date' : isSelected,
            'selected-month' : isSameMonth,
        }"
    >
        <!-- date -->
        <div class="text-center">
            <div :class="isToday? 'today' : '' ">
                {{ calenderDate.getDate() }}
            </div>
        </div>
        <!-- monthly -->
        <p v-if="! isWeekly && (taskPending > 0 || isToday)" 
            class="task-mark"
            :class="{
                'mark-past'     :isPast  ,
                'mark-today'    :isToday ,
                'mark-future'   :isFuture,
            }"
        >{{ isToday ? (taskDone +'/'+ taskTotal) : taskPending }}</p>

    </div>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted, watch } from 'vue'
import { defineProps } from 'vue';
import type { Task, TaskByDate } from '@/types/calenderType';


const props = defineProps<{
    selectedDate: Date,
    calenderDate: Date,
    isWeekly?: boolean,
    timeFrom?: number,
    timeTo?: number,
    isSwiping?: boolean,
} & TaskByDate>();

const dateColRef   = ref<HTMLElement|null>(null);

const taskTotal     = computed<number>(()=>props.total);
const taskDone      = computed<number>(()=>props.done);
const taskPending   = computed<number>(()=>taskTotal.value - taskDone.value);
const taskList      = computed<Task[]>(()=>props.task);
const isWeekly      = computed<boolean>(()=>props.isWeekly);

const refSelected   = computed(()=>props.selectedDate);
const refCalender   = computed(()=>props.calenderDate);
const today         = new Date();

const isToday = computed<boolean>(()=>isSameDay(today, refCalender.value));

const isPast = computed<boolean>(()=> today > refCalender.value);

const isFuture = computed<boolean>(()=> today < refCalender.value );

const isSameMonth = computed<boolean>(()=>refSelected.value.getMonth() == refCalender.value.getMonth());

const isSelected = computed<boolean>(()=>isSameDay(refSelected.value, refCalender.value));

// draw task
function drawTaskItemTimeout(delay:number){
    setTimeout(()=>{
        drawTaskItem();
    }, delay);
}

function drawTaskItem(){
    // get dateColRef height
    if ( dateColRef.value == null ) {
        return;
    };

    if ( dateColRef.value.clientHeight < 100 ){
        clearTaskItem()
        return;
    }

    const timeFrom      :number = props.timeFrom||0;
    const timeTo        :number = props.timeTo||24;
    const timeLength    :number = timeTo - timeFrom;
    const clientHeight  :number = dateColRef.value.clientHeight;
    const hourHeight    :number = clientHeight / timeLength;

    clearTaskItem();
    // add element by each taskList's item start time & end time using hourHeight
    taskList.value.forEach((task)=>{
        const start = to24h(task.activityStart);
        const end = to24h(task.activityEnd);
        const height = (end - start) * hourHeight;

        const div = document.createElement('div');
        div.classList.add('task-item');
        div.style.height = height + 'px';
        div.style.top = (start - timeFrom) * hourHeight + 'px';
        div.style.backgroundColor = task.activityColor;
        // div.innerHTML = start+end.toString();

        dateColRef.value?.appendChild(div);
    });
}

function clearTaskItem(){
    // remove all .task-item element
    if( dateColRef.value == null ) { return;}
    const taskItems = dateColRef.value.querySelectorAll('.task-item');
    taskItems.forEach((item)=>{
        item.remove();
    });
}
function isSameDay(d1: Date, d2: Date): boolean {
    return Math.floor(d1.getTime()/86400000) == Math.floor(d2.getTime()/86400000)
}

function to24h(date: Date) {
    return date.getHours() + date.getMinutes()/60;
}

// if(isWeekly.value && dateColRef.value != null && !props.isSwiping) {
//         drawTaskItemTimeout(300);
//     }

watch(()=>props.isSwiping, (isSwiping)=>{
    if(isWeekly.value && dateColRef.value != null && !isSwiping) {
        drawTaskItemTimeout(300);
    }
});
</script>
