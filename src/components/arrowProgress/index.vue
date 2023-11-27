<template>
    <div :style="{
            '--default-color': props.defaultColor || 'silver',
            '--default-text-color': props.defaultTextColor || 'black',
            '--current-color': props.currentColor || 'gray',
            '--current-text-color': props.currentTextColor || 'white',
            '--done-color': props.doneColor || 'black',
            '--border-color': props.borderColor || 'white',
            '--arrow-height': props.arrowHeight || '30px',


        }">
        <div class="arrow-progress-component">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import arrow from './arrow.vue'

const props = defineProps({
    defaultColor: String,
    defaultTextColor: String,
    currentColor: String,
    currentTextColor: String,
    doneColor: String,
    borderColor: String,
    arrowHeight: String,
})
</script>