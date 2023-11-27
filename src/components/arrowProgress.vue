<template>
    <div :style="
		{
	'--default-color': props.defaultColor||'silver',
    '--default-text-color': props.defaultTextColor||'gray',
    '--current-color': props.currentColor||'gray',
    '--current-text-color': props.currentTextColor||'white',
    '--done-color': props.doneColor||'black',
    '--border-color': props.borderColor||'white',

		
		}"
    >
        <div class="arrow-progress-component">
            <div class="step done"> <span> step 1</span> </div>
            <div class="step current"> <span><b>step 2</b> long and longer</span> </div>
            <div class="step"> <span>step 3 cant be longer</span> </div>
            <div class="step"> <span>nono, step 4</span> </div>
            <div class="step"> <span>john cena</span> </div>
        </div>
    </div>
</template>

<style scoped>

/* Responsive Arrow Progress Bar */

/*  set var  */
:root{
	--default-color: silver;
    --default-text-color: grey;
    --current-color: grey;
    --current-text-color: white;
    --done-color: black;
}

.arrow-progress-component .step {

    display: flex;
    align-items: center;
    justify-content: center;

    padding-left: 16px;
    width: 100%;
    height: 40px;
    float: left;
    position: relative;
    background-color: var(--default-color);
    color: var(--default-text-color);

    border-top-right-radius: .3rem;
    border-bottom-right-radius: .3rem;
}


.arrow-progress-component .step:after,
.arrow-progress-component .step:before {
    content: "";
    position: absolute;
    top: 0;
    right: -16px;
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 19px solid var(--default-color);
    z-index: 2;
}

.arrow-progress-component .step:before {
    right: auto;
    left: 0;
    border-left: 18px solid var(--border-color);
    z-index: 0;
}

.arrow-progress-component .step:first-child:before,
.arrow-progress-component .step:last-child:after {
    border: none;
}

.arrow-progress-component .step:first-child{
    border-top-left-radius: .4rem;
    border-bottom-left-radius: .4rem;

}

.arrow-progress-component .step:last-child {
    border-top-right-radius: .4rem;
    border-bottom-right-radius: .4rem;
}

.arrow-progress-component .step span {
    position: relative;
}

*.arrow-progress-component .step.done span:before {
    opacity: 1;
    content: "";
    position: absolute;
    top: -2px;
    left: -10px;
    font-size: 11px;
    line-height: 21px;
}

.arrow-progress-component {
    display: flex;
}

.arrow-progress-component .step.current {
    color: var(--current-text-color);
    background-color: var(--current-color);
}

.arrow-progress-component .step.current a {
    color: var(--current-text-color);
    text-decoration: none;
}

.arrow-progress-component .step.current:after {
    border-left: 18px solid var(--current-color);
}

.arrow-progress-component .step.done {
    background-color: var(--done-color);
    max-width: 2rem;
}

.arrow-progress-component .step.done > * {
    display: none;
}

.arrow-progress-component .step.done:after {
    border-left: 18px solid var(--done-color);
}

</style>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
    defaultColor: String,
    defaultTextColor: String,
    currentColor: String,
    currentTextColor: String,
    doneColor: String,
    borderColor: String,
})
</script>