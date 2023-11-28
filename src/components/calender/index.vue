<template>
	<div class="calender-component">
		<div class="calender-header">
			<span v-for="day in days" :key="day" class="calender-header-item">
				{{ day }}
			</span>
		</div>
		<div v-if="props.displayType == calenderType.displayType.date" ref="calenderContainer" class="bg-red-500 calender-container" :class="calenderExpand ? 'expanded' : ''">

			<div v-for="(calenderMonth, i) in calenderData" :key="i" :id="'calMon' + i" class="calender">
				<div v-for="(calenderWeek, index) in calenderMonth" :key="index" :id="'calWeek' + index" class="calender-row"
					:class="calenderExpand ? 'expanded' : rowDisplayOnFold == index ? 'expanded' : ''">
					<calenderDay v-for="(days, idx) in calenderWeek" :key="idx"
						@click="updateSelectedDate(days.date, days.month, days.year)" 
						
						:selectedYear="selectedYear"
						:selectedMonth="selectedMonth" 
						:selectedDate="selectedDate" 

						:calenderYear="days.year"
						:calenderMonth="days.month" 
						:calenderDate="days.date" 
						:calenderDay="days.day" 
						
						:taskTotal="days.total"
						:taskDone="days.done">
					</calenderDay>
				</div>
			</div>

		</div>
	</div>
	<pre>
		{{ {
			isSwiping: isSwiping,
			direction: direction,
			calenderExpand: calenderExpand,
			rowDisplayOnFold: rowDisplayOnFold,
			calender: {
				month: calenderMonth,
				year: calenderYear,
			},
			selected: {
				date: selectedDate,
				month: selectedMonth,
				year: selectedYear,
			},
		} }}
	</pre>
</template>
  
<script setup lang='ts'>
import { ref, computed, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import calenderDay from './calenderDay.vue';
import { defineEmits } from 'vue';

import * as calenderType from './../../types/calenderType';

const emit = defineEmits(['selected-date']);
const props = defineProps({
	displayType: {
		type: String,
		default: calenderType.displayType.date,
		required: true,
	},
	selectedDate: {
		type: Number,
		default: new Date().getDate(),
		required: true,
	},
	selectedMonth: {
		type: Number,
		default: new Date().getMonth(),
		required: true,
	},
	selectedYear: {
		type: Number,
		default: new Date().getFullYear(),
		required: true,
	},

	// data Object
	calenderTaskData: {
		required: true,
		type: Array as () => calenderType.CalenderDataItem[],
		default: () => {
			return [
				{
					year: 2021,
					month: 0,
					taskByDate: [
						{
							total: 10,
							done: 5,
						},
					]
				}
			];
		},
	},
});
// calender data
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let calenderMonth = ref<number>(props.selectedMonth);
let calenderYear = ref<number>(props.selectedYear);

const selectedDate = ref<number>(props.selectedDate);
const selectedMonth = ref<number>(props.selectedMonth);
const selectedYear = ref<number>(props.selectedYear);

const calenderTaskDataRef = computed<calenderType.CalenderDataItem[]>(() => {
	return props.calenderTaskData;
});
const calenderData = computed<calenderType.Day[][][]>(() => {
	return [
		getMonthlyCalendar(calenderYear.value, calenderMonth.value - 1, calenderTaskDataRef.value),
		getMonthlyCalendar(calenderYear.value, calenderMonth.value    , calenderTaskDataRef.value),
		getMonthlyCalendar(calenderYear.value, calenderMonth.value + 1, calenderTaskDataRef.value)
	];
});

let rowDisplayOnFold = ref<number>(0);

function useSelectedRow(): void {
	rowDisplayOnFold.value = calenderData.value[1].findIndex((week) => {
		return week.some((day) => {
			return day.month === calenderMonth.value && day.date === selectedDate.value;
		});
	});
}
function resetRowDisplayOnFold(index?:number): void {
	rowDisplayOnFold.value = index || 0;
};

function getMonthlyCalendar(year: number, month: number, calenderTaskData?: calenderType.CalenderDataItem[]): calenderType.Day[][] {
	let calender = [];

	year = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
	month = month < 0 ? 11 : month > 11 ? 0 : month;

	const firstDayOfMonth = new Date(year, month, 1).getDay() - 1;
	const taskDataMonth = calenderTaskData?.find((data) => {
		return data.year === year && data.month === month;
	});

	console.log(taskDataMonth);

	for (let weekCount = 0; weekCount < 5; weekCount++) {
		let week = [];
		for (let dayCount = 0; dayCount < 7; dayCount++) {
			let day = new Date(year, month, (dayCount - firstDayOfMonth) + (weekCount * 7));
			const taskData = day.getMonth() == month ? taskDataMonth?.taskByDate[day.getDate()] : taskDataMonth?.taskByDate[0]
			week.push({
				day: day.getDay(),
				date: day.getDate(),
				month: day.getMonth(),
				year: day.getFullYear(),
				total: taskData?.total || 0,
				done: taskData?.done || 0,
				task: taskData?.task || [],
			});
		}
		calender.push(week);
	};

	return calender;
}

function updateSelectedDate(date: number, month: number, year: number): void {
	selectedDate.value = date;
	selectedMonth.value = month;
	selectedYear.value = year;

	useSelectedRow();

	// emit data to parent
	emit('selected-date', {
		day: new Date(year, month, date).getDay(),
		date: selectedDate.value,
		month: selectedMonth.value,
		year: selectedYear.value,
	});
	
}

// touch event

const calenderContainer = ref<Element>(); 
const { isSwiping, direction } = useSwipe(calenderContainer)
const calenderExpand = ref(false);

function calenderPrevMonth(): void {
	resetRowDisplayOnFold(4);
	calenderContainer.value?.classList.add('slide-right');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-right');
		calenderMonth.value = (calenderMonth.value == 0 ? 11 : calenderMonth.value - 1);
		calenderYear.value = (calenderMonth.value === 11 ? calenderYear.value - 1 : calenderYear.value);
	}, 200);
}

function calenderNextMonth(): void {
	resetRowDisplayOnFold(0);
	calenderContainer.value?.classList.add('slide-left');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-left');
		calenderMonth.value = (calenderMonth.value == 11 ? 0 : calenderMonth.value + 1);
		calenderYear.value = (calenderMonth.value === 0 ? calenderYear.value + 1 : calenderYear.value);
	}, 200);
}

watch([isSwiping, direction], ([isSwiping, direction]) => {
	if (!isSwiping) {
		if (direction === 'down') {
			calenderExpand.value = true
		}
		else if (direction === 'up') {
			calenderExpand.value = false
		}
		else if (!calenderExpand.value) {
			if (direction === 'left') {
				if(rowDisplayOnFold.value === 4){
					calenderNextMonth();
				}
				else{
					rowDisplayOnFold.value += 1;
				};

			}
			else if (direction === 'right') {
				if(rowDisplayOnFold.value === 0){
					calenderPrevMonth();
				}
				else{
					rowDisplayOnFold.value -= 1;
				};
			};
		}
		else if (calenderExpand.value) {
			if (direction === 'left') {
				calenderNextMonth();
			}
			else if (calenderExpand.value && direction === 'right') {
				calenderPrevMonth();
			};
		}
	}
});

// mounted
useSelectedRow();
</script>