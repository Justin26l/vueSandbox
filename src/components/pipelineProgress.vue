
<template>
	<!-- make a step progress bar vertical -->
	<div 
	:style="
		{
			'--stepProgress-padding-left': props.linePaddingLeft || '.5rem',
			'--stepProgress-line-width': props.lineWidth || '.3rem',
			'--stepProgress-line-height': props.lineHeight || '5rem',
			'--stepProgress-bullet-size': props.bulletSize || 'calc( calc( var(--stepProgress-padding-left) * 2) + var(--stepProgress-line-width) )',
			'--stepProgress-block-padding':  'calc( calc( var(--stepProgress-padding-left) * 2) + var(--stepProgress-line-width) )',
			'--default-color': props.defaultColor || 'gray',
			'--fill-color': props.fillColor || 'black'
		
		}"
		style="display: flex; justify-content: center; align-items: center;"
	>

		<div class="step-progress-component">
			<slot>
			</slot>
		</div>
	</div>
</template>

<!-- style with scss -->
<style>

/*  set var  */
:root{
	--stepProgress-padding-left: .5rem;
	--stepProgress-line-width: .3rem;
	--stepProgress-line-height: 5rem;
	--stepProgress-bullet-size : calc( calc( var(--stepProgress-padding-left) * 2) + var(--stepProgress-line-width) );
	--stepProgress-block-padding: calc( calc( var(--stepProgress-padding-left) * 2) + var(--stepProgress-line-width) );
	--default-color: gray;
	--fill-color: black;
}

.step-progress-component{
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: left;
	max-width: max-content;
}

.step-progress-component .step-line{
	margin-left: var(--stepProgress-padding-left);
	margin-top: var(--stepProgress-line-width);
	margin-bottom: var(--stepProgress-line-width);
	width: var(--stepProgress-line-width);
	height: var(--stepProgress-line-height);
	background-color: var(--default-color);
	border-radius: 100vw;
}

.step-progress-component .step-container{
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	min-height: var(--stepProgress-bullet-size);
}
/* step container align ltr */
.step-progress-component .step-container{
	display: block;
	position: relative;
	text-align: left;
	padding-left: var(--stepProgress-block-padding);
}


/* make stepcontainer with a bullet  */
.step-progress-component .step-container::before{
	content: '';
	position: absolute;
	left: calc( var(--stepProgress-block-padding) / 2 );
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: var(--stepProgress-bullet-size);
	height: var(--stepProgress-bullet-size);
	background-color: var(--default-color);
	border-radius: 50%;

}

.step-progress-component .step-container.fill::before{
	background-color: var(--fill-color);
}
.step-progress-component .step-line.fill{
	background-color: var(--fill-color);
}

</style>

<script setup lang="ts">
// props
import { defineProps } from 'vue'
const props = defineProps({
	linePaddingLeft: {
		type : String
	},
	lineWidth: {
		type : String
	},
	lineHeight: {
		type : String
	},
	bulletSize: {
		type : String
	},
	defaultColor: {
		type : String
	},
	fillColor: {
		type : String
	}
})
</script>