<template>
  <span style="text-align:center;">
    <!-- <stepProgress 
      linePaddingLeft='.5rem'
      lineWidth='2px'
      lineHeight='5rem'
      defaultColor="gray"
      fillColor="blue"
    >
      <div class="step-container fill">
        <p>start</p>
      </div>

      <span class="step-line fill"></span>

      <div class="step-container fill">
        <h3 class="text-base">Title</h3>
        <p>text</p>
      </div>

      <span class="step-line"></span>

      <div class="step-container">
        <h3 class="text-base">Title</h3>
        <p>text</p>
      </div>

    </stepProgress>

    <hr/> -->

    <calenderTouch></calenderTouch>
    
  </span>
  <br>
  <pre class="bg-green">data</pre>
</template>

<script setup lang="ts">
import stepProgress from './components/stepProgress.vue'
import calenderTouch from './components/calender/calenderTouch.vue';
</script>
