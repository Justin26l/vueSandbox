<template>
	<div class="container">
		<div class="calender-header">
			<span v-for="day in days" :key="day" class="calender-header-item">
				{{ day }}
			</span>
		</div>
		<div ref="calenderContainer" class="bg-red-500 calender-container" :class="calenderExpand ? 'expanded' : ''">

			<div v-for="(calenderMonth, i) in calenderData" :key="i" :id="'calMon' + i" class="calender">
				<div v-for="(calenderWeek, index) in calenderMonth" :key="index" :id="'calWeek' + index" class="calender-row"
					:class="calenderExpand ? 'expanded' : rowDisplayOnFold == index ? 'expanded' : ''">
					<calenderDay v-for="(days, idx) in calenderWeek" :key="idx"
						@click="updateSelectedDate(days.date, days.month, days.year)" :selectedYear="selectedYear"
						:selectedMonth="selectedMonth" :selectedDate="selectedDate" :calenderYear="days.year"
						:calenderMonth="days.month" :calenderDate="days.date" :calenderDay="days.day" :taskTotal="10"
						:taskDone="5">
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
			rowDisplayOnFoldAdj: rowDisplayOnFoldAdj,
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

<style scoped>
.container {
	overflow-x: hidden;
}

.calender-header {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	width: 100%;
}

.calender-header-item {
	flex: 1;
	text-align: center;
	border: .5px solid lightgray;
}

.calender-container {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
	height: 4rem;
	max-width: 100vw;
	overflow-x: visible;
	touch-action: none;
	transition: all 0.2s ease-in-out;
}

.calender-container.expanded {
	height: 20rem !important;
}

.calender {
	display: flex;
	height: 100%;
	flex: 0 0 100%;
	min-width: 0;
	/* Allow items to shrink beyond their content width */
	flex-direction: column;
}

.calender-row {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: green;
	opacity: 0;
	height: 0px;
	transition: all 0.2s ease-in-out;
}

.calender-row.expanded {
	opacity: 1;
	height: 4rem;
}

@keyframes slide-left-frame {
	from {
		/* Starting state of the animation */
		transform: translateX(0%);
	}

	to {
		/* Ending state of the animation */
		transform: translateX(-100%);
	}
}

@keyframes slide-right-frame {
	from {
		transform: translateX(0%);
	}

	to {
		transform: translateX(100%);
	}
}

.slide-left {
	animation: slide-left-frame .2s ease-in-out;
}

.slide-right {
	animation: slide-right-frame .2s ease-in-out;
}
</style>
  
<script setup lang='ts'>
import { ref, computed, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import calenderDay from './calenderDay.vue';

interface Day {
	day: number;
	date: number;
	month: number;
	year: number;
}

// calender data
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
let calenderMonth = ref<number>(today.getMonth());
let calenderYear = ref<number>(today.getFullYear());
let rowDisplayOnFoldAdj = ref<number>(0);

const selectedDate = ref<number>(today.getDate());
const selectedMonth = ref<number>(today.getMonth());
const selectedYear = ref<number>(today.getFullYear());

const calenderData = computed<Day[][][]>(() => {
	return [
		getMonthlyCalendar(calenderYear.value, calenderMonth.value - 1),
		getMonthlyCalendar(calenderYear.value, calenderMonth.value),
		getMonthlyCalendar(calenderYear.value, calenderMonth.value + 1)
	];
});

const rowDisplayOnFold = computed<number>((): number => {
	const targetRow = calenderData.value[1].findIndex((week) => {
		return week.findIndex((day): boolean => {
			return day.month == selectedMonth.value && day.date === selectedDate.value;
		});
	});

	if(targetRow + rowDisplayOnFoldAdj.value < 0){
		calenderPrevMonth()
	}
	else if(targetRow + rowDisplayOnFoldAdj.value > 4){
		calenderNextMonth()
	};

	return targetRow + rowDisplayOnFoldAdj.value;
});

function resetRowDisplayOnFoldAdj(index?:number): void {
	rowDisplayOnFoldAdj.value = index || 0;
};

function getMonthlyCalendar(year: number, month: number): Day[][] {
	let calender = [];

	year = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
	month = month < 0 ? 11 : month > 11 ? 0 : month;

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

function updateSelectedDate(date: number, month: number, year: number): void {
	selectedDate.value = date;
	selectedMonth.value = month;
	selectedYear.value = year;
}

// touch event

const calenderContainer = ref<Element>(); 
const { isSwiping, direction } = useSwipe(calenderContainer)
const calenderExpand = ref(false);

function calenderPrevMonth(): void {
	resetRowDisplayOnFoldAdj(4);
	calenderContainer.value?.classList.add('slide-right');
	setTimeout(() => {
		calenderContainer.value?.classList.remove('slide-right');
		calenderMonth.value = (calenderMonth.value == 0 ? 11 : calenderMonth.value - 1);
		calenderYear.value = (calenderMonth.value === 11 ? calenderYear.value - 1 : calenderYear.value);
	}, 200);
}

function calenderNextMonth(): void {
	resetRowDisplayOnFoldAdj();
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
					rowDisplayOnFoldAdj.value += 1;
				};

			}
			else if (direction === 'right') {
				if(rowDisplayOnFold.value === 0){
					calenderPrevMonth();
				}
				else{
					rowDisplayOnFoldAdj.value -= 1;
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

</script>