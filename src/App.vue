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

    <!-- <calender></calender> -->

    <p>123123213</p>
    <arrowProgress>
      <arrow status="done">
        step 1 
      </arrow>
      <arrow status="current">
        step 2
      </arrow>
      <arrow status="default">
        step 3
      </arrow>
    </arrowProgress>
    <p>123123213</p>

  </span>
  <br>
  <pre class="bg-green">data</pre>
</template>

<script setup lang="ts">
import pipelineProgress from './components/pipelineProgress.vue'
import calender from './components/calender/index.vue';
import arrowProgress from './components/arrowProgress/index.vue';
import arrow from './components/arrowProgress/arrow.vue';

</script>
