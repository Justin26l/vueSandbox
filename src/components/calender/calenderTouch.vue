<template>
	<div ref="calenderContainer" class="bg-red-500 calender" :class="calenderExpand ? 'calender-expanded' : ''">

		<!-- monthly -->
		<div v-for="(calenderWeek, index) in calendarMonth" :key="index" class="calender-row"
			:class="calenderExpand || currentWeekIndex == index ? 'calender-row-show' : ''">
			<calenderDay 
				v-for="(days, idx) in calenderWeek" :key="idx" 
				@click="updateSelectedDate(days.date, days.month, days.year)"
				:selectedYear="selectedYear"
				:selectedMonth="selectedMonth"
				:selectedDate="selectedDate"
				:calenderYear="days.year"
				:calenderMonth="days.month"
				:calenderDate="days.date"
				:calenderDay="days.day"
				:taskTotal="10"
				:taskDone="days.date">
			</calenderDay>
		</div>

	</div>
	<pre>
		{{ {
			isSwiping: isSwiping,
			direction: direction,
			calenderExpand: calenderExpand,
			selected : {
				date: selectedDate,
				month: selectedMonth,
				year: selectedYear,
			},
		} }}
	</pre>
</template>

<style scoped>
.calender {
	display: flex;
	flex-direction: column;
	height: 4rem;
	overflow: hidden;
	touch-action: none;
	transition: all 0.3s ease-in-out;
}

.calender-expanded {
	height: 20rem;
	transition: all 0.3s ease-in-out;
}

.calender-row {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: green;
	opacity: 0;
	height: 0px;
	transition: all 0.3s ease-in-out;
}

.calender-row.calender-row-show {
	opacity: 1;
	height: 4rem;
}
</style>
  
<script setup lang='ts'>
import { ref, computed, watch } from 'vue'
import { useSwipe } from '@vueuse/core'

import calenderDay from './calenderDay.vue';

const calenderContainer = ref(null); // element ref
const { isSwiping, direction, lengthX, lengthY } = useSwipe(calenderContainer)

const calenderExpand = ref(false);

watch([isSwiping, direction], ([isSwiping, direction]) => {
	if (!isSwiping) {
		if (direction === 'down') {
			calenderExpand.value = true
		} else if (direction === 'up') {
			calenderExpand.value = false
		}
	}
});


const today = new Date();
const calendarMonth: Day[][] = getMonthlyCalendar(today.getFullYear(), today.getMonth());

const selectedDate = ref<number>(today.getDate());
const selectedMonth = ref<number>(today.getMonth());
const selectedYear = ref<number>(today.getFullYear());

const currentWeekIndex = computed(() => {
	return calendarMonth.findIndex((week) => {
		return week.some((day) => {
			return day.date === selectedDate.value && day.month === selectedMonth.value && day.year === selectedYear.value;
		});
	});
});


interface Day {
	day: number;
	date: number;
	month: number;
	year: number;
}

function getMonthlyCalendar(year: number, month: number): Day[][] {
	let calender = [];

	const firstDayOfMonth = new Date(year, month, 1).getDay() - 1;

	for (let weekCount = 0; weekCount < 5; weekCount++) {
		let week = [];
		for (let dayCount = 0; dayCount < 7; dayCount++) {
			let day = new Date(year, month, (dayCount - firstDayOfMonth) + (weekCount * 7));
			week.push({
				day: day.getDay(),
				date: day.getDate(),
				month: day.getMonth(),
				year: day.getFullYear(),
			});
		}
		calender.push(week);
	};

	return calender;
}

function updateSelectedDate( date: number, month: number, year: number) :void {
	selectedDate.value = date;
	selectedMonth.value = month;
	selectedYear.value = year;
}
</script>