<template>
	<div class="cal">
		<div>
			<h2 v-if="props.header">{{ calenderDate.getFullYear() + ' ' + month[calenderDate.getMonth()] }}</h2>
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
						<div v-for="(calenderWeek, index) in calenderMonth" :key="index" :id="'calWeek' + index" class="calender-row"
							:class="{
								'show' : (!displayWeekly && calenderExpand) || rowDisplayOnFold == index, 
								'weekly-view' : displayWeekly && rowDisplayOnFold == index,
							}">
							<calenderDay v-for="(days, idx) in calenderWeek" :key="idx" 
								@click="updateSelectedDate(days.date)" 
								:selectedDate="selectedDate" 
								:calenderDate="days.date" 
								
								:total="days.total"
								:done="days.done"
								:task="days.task"

								:isWeekly="displayWeekly"
								:timeFrom="props.timeFrom"
								:timeTo="props.timeTo"

								:isSwiping="
									i==0 ? ( index==4 ? isSwiping : false ) :
									i==1 ? ( rowDisplayOnFold == index || rowDisplayOnFold == index + 1 || rowDisplayOnFold == index -1  ? isSwiping : false ) :
									i==2 ? ( index==0 ? isSwiping: false ) :
									false
								"
							>
							<!-- 
								i==0 ? index==4 ? isSwiping:
								i==1 ? rowDisplayOnFold == index || rowDisplayOnFold == index + 1 || rowDisplayOnFold == index -1  ? isSwiping:
								i==2 ? index==0 ? isSwiping:
								false
							-->
							</calenderDay>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>
	<pre>
		{{ {
			isSwiping: isSwiping,
			direction: direction,
			rowDisplayOnFold: rowDisplayOnFold,

			calender: calenderDate.toDateString(),
			selected: selectedDate.toDateString(),

			calenderExpand: calenderExpand,
			displayType: displayType,
			timeFrom: props.timeFrom,
			timeTo: props.timeTo,
			timeLength: timeLength,
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

const calenderDate = ref<Date>(props.selectedDate);
const selectedDate = ref<Date>(props.selectedDate);

const displayWeekly = computed<boolean>(() => displayType.value === calenderType.displayType.week);
const displayType = computed<calenderType.displayType>(()=>props.displayType);
watch(displayType, (newDisplayType) => {
  calenderExpand.value = newDisplayType === calenderType.displayType.week;
});
let rowDisplayOnFold = ref<number>(0);

const timeLength = computed<number>(() => props.timeTo - props.timeFrom);
// calender days event
const calenderTaskDataRef = computed<calenderType.CalenderDataItem[]>(() => {
	return props.calenderTaskData;
});

const calenderData = ref<calenderType.dateObj[][][]>([
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() - 1, calenderTaskDataRef.value),
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth()    , calenderTaskDataRef.value),
	getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() + 1, calenderTaskDataRef.value)
]);

// touch event
const calenderContainer = ref<Element>(); 
const { isSwiping: isSwiping, direction: direction } = useSwipe(calenderContainer);

const calenderExpand = ref(false);

function isSameDay(date1: Date, date2: Date): boolean {
	return Math.floor(date1.getTime()/86400000) === Math.floor(date2.getTime()/86400000);
}
function useSelectedRow(): void {
	rowDisplayOnFold.value = calenderData.value[1].findIndex((week) => {
		return week.some((day) => {
			return isSameDay(day.date, selectedDate.value);
		});
	});
}
function resetRowDisplayOnFold(index?:number): void {
	rowDisplayOnFold.value = index || 0;
};

function getMonthlyCalendar(year: number, month: number, calenderTaskData: calenderType.CalenderDataItem[]): calenderType.dateObj[][] {
	let calender = [];

	year = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
	month = month < 0 ? 11 : month > 11 ? 0 : month;

	const firstDayOfMonth = new Date(year, month, 1).getDay() - 1;
	const taskDataMonth = calenderTaskData?.find((data) => {
		return data.year === year && data.month === month;
	});

	// insert padding to match array with date [dummy, 1, 2, 3 ... 30, 31 ];
	taskDataMonth?.taskByDate.unshift({ total: 0, done: 0, task: [] });

	for (let weekCount = 0; weekCount < 5; weekCount++) {
		let week = [];
		for (let dayCount = 0; dayCount < 7; dayCount++) {
			let dateObj = new Date(year, month, (dayCount - firstDayOfMonth) + (weekCount * 7));
			const taskData = dateObj.getMonth() == month ? taskDataMonth?.taskByDate[dateObj.getDate()] : taskDataMonth?.taskByDate[0]
			week.push({
				date: dateObj,
				total: taskData?.total || 0,
				done: taskData?.done || 0,
				task: taskData?.task || [],
			});
		}
		calender.push(week);
	};

	return calender;
}

// weekly view
// function setDisplayType(type: calenderType.displayType): void {
// 	displayType.value = type;
// 	displayWeekly.value = type === calenderType.displayType.week;
// };
function updateSelectedDate(date: Date): void {
	selectedDate.value = date;
	useSelectedRow();
	emit('selectedDate', selectedDate.value);	
}

// touch event

function calenderPrevMonth(): void {
	resetRowDisplayOnFold(4);
	calenderContainer.value?.classList.add('slide-right');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-right');

		calenderDate.value.setMonth(calenderDate.value.getMonth() - 1);
		emit('viewingDate', calenderDate.value);
		calenderData.value = [
			getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() - 1, calenderTaskDataRef.value),
			calenderData.value[0],
			calenderData.value[1],
		];
	}, 200);
}

function calenderNextMonth(): void {
	resetRowDisplayOnFold(0);
	calenderContainer.value?.classList.add('slide-left');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-left');

		calenderDate.value.setMonth(calenderDate.value.getMonth() + 1);
		calenderData.value = [
			calenderData.value[1],
			calenderData.value[2],
			getMonthlyCalendar(calenderDate.value.getFullYear(), calenderDate.value.getMonth() + 1, calenderTaskDataRef.value)
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
		else if (!calenderExpand.value || displayWeekly.value) {
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
onMounted(() => {
	useSelectedRow();
});
</script>