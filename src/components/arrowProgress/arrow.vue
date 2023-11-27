<template>
    <div class="step" 
        :class="{
            done: props.status === 'done',
            current: props.status === 'current',
        }"
    >
        <svg class="arrow right" viewBox="1 .9 4.9 7.9" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.9999 0L10 5V10H0L5 5L0 0L9.9999 0Z" />
        </svg>
        <div>
            <slot></slot>
        </div>
        <svg class="arrow right" viewBox="5 .9 4.9 7.9" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5L5 10H0V0L5 0L10 5Z" />
        </svg>
    </div>
</template>

<script setup lang="ts">
// props status = ['done', 'current'];
import { defineProps } from 'vue';
const props = defineProps<{
    status: string
}>();
</script>