<template>
	<div class="cal">
		<div>
			<h2 v-if="props.header">{{ selectedDate.getFullYear() + ' ' + month[selectedDate.getMonth()] }}</h2>
		</div>
		<div class="calender-body border-1" :class="calenderExpand ? 'expanded' : ''">

			<div class="calender-side-bar" :class="displayWeekly && calenderExpand?'show':''">
				<span class="calender-header-item"></span>
				<!-- loop (time to - timefrom) times and display timefrom + i -->
				<span v-for="i in timeLength + 1" :key="i" class="calender-header-item">
					{{ props.timeFrom + (i-1) }}
				</span>
			</div>
			<div class="calender-main">
				<div class="calender-header">
					<span v-for="day in days" :key="day" class="calender-header-item">
						{{ day }}
					</span>
				</div>

				<div ref="calenderContainer" class="calender-grid" :class="{
					'expanded' : calenderExpand,
				}">
					<div v-for="(calenderMonth, i) in calenderData" :key="i" :id="'calMon' + i" class="calender">
						<div v-for="(calenderWeek, index) in calenderMonth.calender" :key="index" :id="'calWeek' + index" class="calender-row"
							:class="{
								'show' : (!displayWeekly && calenderExpand) || rowSelected == index, 
								'weekly-view' : displayWeekly && rowSelected == index,
							}">
							<calenderDay v-for="(days, idx) in calenderWeek" :key="idx" 
								@click="updateSelectedDate(days.date, index, idx)" 
								:selectedDate="selectedDate" 
								:calenderDate="days.date" 
								
								:total="days.total"
								:done="days.done"
								:task="days.task"

								:isWeekly="displayWeekly"
								:timeFrom="props.timeFrom"
								:timeTo="props.timeTo"

								:isSwiping="i==1 ? isSwiping :false
								"
							>
							</calenderDay>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
	<pre>
		{{ {
			cal0: calenderData[0].calender[2][2].date.toDateString(),
			cal1: calenderData[1].calender[2][2].date.toDateString(),
			cal2: calenderData[2].calender[2][2].date.toDateString(),

			rowSelected: rowSelected,
			colSelected: colSelected,
			rowthreshold: rowthreshold,

			calender: calenderDate.toDateString(),
			selected: selectedDate.toDateString(),

		} }}
	</pre>
</template>
  
<script setup lang='ts'>
import { ref, computed, watch, onMounted } from 'vue'
import { useSwipe } from '@vueuse/core'
import calenderDay from './calenderDay.vue';
import { defineEmits } from 'vue';

import * as calenderType from './../../types/calenderType';

const emit = defineEmits(['selectedDate', 'viewingDate']);
const props = defineProps<{
	displayType: calenderType.displayType,
	selectedDate: Date,
	header?: boolean,
	calenderTaskData: calenderType.CalenderDataItem[],
	timeFrom:number,
	timeTo:number,
}>();

// calender data
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const calenderDate = ref<Date>(new Date());
const selectedDate = ref<Date>(props.selectedDate);

const displayWeekly = computed<boolean>(() => displayType.value === calenderType.displayType.week);
const displayType = computed<calenderType.displayType>(()=>props.displayType);
watch(displayType, (newDisplayType) => {
  calenderExpand.value = newDisplayType === calenderType.displayType.week;
});

let rowSelected = ref<number>(0);
let colSelected = ref<number>(0);
let rowthreshold = computed(() => (calenderExpand.value && !displayWeekly.value) ? 4 : calenderData.value[1].rowthreshold);

const timeLength = computed<number>(() => props.timeTo - props.timeFrom);
// calender days event
const calenderTaskDataRef = computed<calenderType.CalenderDataItem[]>(() => {
	return props.calenderTaskData;
});

const calenderData = ref<Array<{
	rowthreshold: number;
	calender: calenderType.dateObj[][];
}>> ([
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() - 1, calenderTaskDataRef.value),
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth()    , calenderTaskDataRef.value),
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() + 1, calenderTaskDataRef.value)
]);

// touch event
const calenderContainer = ref<Element>(); 
const { isSwiping: isSwiping, direction: direction } = useSwipe(calenderContainer);

const calenderExpand = ref(false);

// function isSameDay(date1: Date, date2: Date): boolean {
// 	return Math.floor(date1.getTime()/86400000) === Math.floor(date2.getTime()/86400000);
// }

function getMonthlyCalendar(year: number, month: number, calenderTaskData: calenderType.CalenderDataItem[]): {
	rowthreshold: number;
	calender: calenderType.dateObj[][];
} {
	let calender : calenderType.dateObj[][] = [];

	const firstDayOfMonth :number = new Date(year, month, 1).getDay() - 1;
	const lastDateOfMonth :Date = new Date(year, month + 1, 0);
	const targetMonth :calenderType.CalenderDataItem|undefined = calenderTaskData?.find((data) => {
		return data.year === year && data.month === month;
	});

	const prevMonthDate :Date = new Date(year, month-1, 1);
	const prevMonth :calenderType.CalenderDataItem|undefined = calenderTaskData?.find((data) => {
		return data.year === prevMonthDate.getFullYear() && data.month === prevMonthDate.getMonth();
	});

	const nextMonthDate :Date= new Date(year, month+1, 1);
	const nextMonth :calenderType.CalenderDataItem|undefined = calenderTaskData?.find((data) => {
		return data.year === nextMonthDate.getFullYear() && data.month === nextMonthDate.getMonth();
	});

	for (let weekCount = 0; weekCount < 5; weekCount++) {
		let week :calenderType.dateObj[] = [];
		for (let dayCount = 0; dayCount < 7; dayCount++) {
			const dateObj = new Date(year, month, (dayCount - firstDayOfMonth) + (weekCount * 7));
			const isTargetMonth = dateObj.getMonth() == month;

			const dateTask = isTargetMonth ? targetMonth?.taskByDate[dateObj.getDate()-1] : 
								dateObj.getMonth() < month ? prevMonth?.taskByDate[dateObj.getDate()-1] : 
								nextMonth?.taskByDate[dateObj.getDate()-1];

			week.push({
				date: dateObj,
				total: dateTask?.total || 0,
				done: dateTask?.done || 0,
				task: dateTask?.task || [],
			});
		}
		calender.push(week);
	};

	// if lastDateOfMonth is not found in calender[4], monthlyRowThreshold is 4
	const rowthreshold = calender[4][6].date <= lastDateOfMonth ? 4 : 3;
	return {
		rowthreshold: rowthreshold,
		calender: calender
	};
}

// weekly view
// function setDisplayType(type: calenderType.displayType): void {
// 	displayType.value = type;
// 	displayWeekly.value = type === calenderType.displayType.week;
// };
function updateSelectedDate(date: Date, row?:number, col?:number): void {
	selectedDate.value = date;
	if(col){
		colSelected.value = col;
	}
	if(row){
		rowSelected.value = row;
	}
	emit('selectedDate', selectedDate.value);
}

// touch event

function calenderPrevMonth(): void {
	rowSelected.value = calenderData.value[0].rowthreshold;

	if(calenderExpand.value && ! displayWeekly.value){
		updateSelectedDate(new Date(calenderDate.value.getFullYear(), calenderDate.value.getMonth(), 0));
	}
	else {
		updateSelectedDate(calenderData.value[0].calender[calenderData.value[0].rowthreshold][colSelected.value].date);
	}
	calenderContainer.value?.classList.add('slide-right');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-right');
		calenderDate.value.setMonth(calenderDate.value.getMonth() - 1);
		calenderData.value = [
			getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth()-1, calenderTaskDataRef.value),
			calenderData.value[0],
			calenderData.value[1],
		];
	}, 200);
}

function calenderNextMonth(): void {
	rowSelected.value = 0;
	if(calenderExpand.value && ! displayWeekly.value){
		updateSelectedDate(new Date(calenderDate.value.getFullYear(), calenderDate.value.getMonth()+1, 1));
	}
	else {
		updateSelectedDate(calenderData.value[2].calender[0][colSelected.value].date);
	};
	
	calenderContainer.value?.classList.add('slide-left');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-left');
		calenderDate.value.setMonth(calenderDate.value.getMonth() + 1);
		calenderData.value = [
			calenderData.value[1],
			calenderData.value[2],
			getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth()+1, calenderTaskDataRef.value)
		];
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
		// monthly expanded only
		else if (calenderExpand.value && !displayWeekly.value) {
			if (direction === 'left') {
				calenderNextMonth();
			}
			else if (calenderExpand.value && direction === 'right') {
				calenderPrevMonth();
			};
		}
		// weekly & folded
		else if (!calenderExpand.value || displayWeekly.value) {
			if (direction === 'left') {
				if(rowSelected.value >= rowthreshold.value){
					calenderNextMonth();
				}
				else{
					updateSelectedDate(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate() +7));
					rowSelected.value += 1;
				};

			}
			else if (direction === 'right') {
				if(rowSelected.value <= 0){
					calenderPrevMonth();
				}
				else{
					updateSelectedDate(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate() -7));
					rowSelected.value -= 1;
				};
			};
		}
	}
});





</script>