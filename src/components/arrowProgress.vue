<template>
    <div class="container">
        <!-- Responsive Arrow Progress Bar -->
        <div class="arrow-steps clearfix">
            <div class="step current"> <span> <a href="#">1</a></span> </div>
            <div class="step"> <span><a href="#">2</a></span> </div>
            <div class="step"> <span><a href="#">3</a></span> </div>
            <div class="step"> <span><a href="#">4</a></span> </div>
            <div class="step"> <span><a href="#">5</a></span> </div>
        </div>
        <!-- end Responsive Arrow Progress Bar -->
        <div class="nav clearfix">
            <a href="#" class="prev">Previous</a> |
            <a href="#" class="next pull-right">Next</a>
        </div>
    </div>
</template>

<style scoped>
/* jQuery Demo */

.clearfix:after {
    clear: both;
    content: "";
    display: block;
    height: 0;
}

/* Responsive Arrow Progress Bar */

.container {
    font-family: 'Lato', sans-serif;
}

.arrow-steps .step {
    font-size: 14px;
    text-align: center;
    color: #777;
    cursor: default;
    margin: 0 1px 0 0;
    padding: 10px 0px 10px 0px;
    width: 15%;
    float: left;
    position: relative;
    background-color: #ddd;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.arrow-steps .step a {
    color: #777;
    text-decoration: none;
}

.arrow-steps .step:after,
.arrow-steps .step:before {
    content: "";
    position: absolute;
    top: 0;
    right: -17px;
    width: 0;
    height: 0;
    border-top: 19px solid transparent;
    border-bottom: 17px solid transparent;
    border-left: 17px solid #ddd;
    z-index: 2;
}

.arrow-steps .step:before {
    right: auto;
    left: 0;
    border-left: 17px solid #fff;
    z-index: 0;
}

.arrow-steps .step:first-child:before {
    border: none;
}

.arrow-steps .step:last-child:after {
    // border: none;
}

.arrow-steps .step:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.arrow-steps .step:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.arrow-steps .step span {
    position: relative;
}

*.arrow-steps .step.done span:before {
    opacity: 1;
    content: "";
    position: absolute;
    top: -2px;
    left: -10px;
    font-size: 11px;
    line-height: 21px;
}

.arrow-steps {
    display: flex;
}

.arrow-steps .step.current {
    color: #fff;
    background-color: #5599e5;
}

.arrow-steps .step.current a {
    color: #fff;
    text-decoration: none;
}

.arrow-steps .step.current:after {
    border-left: 17px solid #5599e5;
}

.arrow-steps .step.done {
    color: #173352;
    background-color: #2f69aa;
    max-width: 3rem;
}

.arrow-steps .step.done a {
    color: #173352;
    text-decoration: none;
    display: none;
}

.arrow-steps .step.done:after {
    border-left: 17px solid #2f69aa;
}
</style>