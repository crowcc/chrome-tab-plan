<template>
  <div class="todo">
    <div class="todo-header">Today</div>
    <Input type="textarea" :autosize="{ minRows: 4}" placeholder="please input..." v-model="todoTodayVal"/>
    <div class="todo-header" :style="{marginTop:'10px'}">Next</div>
    <Input type="textarea" :autosize="{ minRows: 4}" placeholder="please input..." v-model="todoVal"/>
  </div>
</template>

<script>
import { Input } from 'element-ui';
import _ from 'lodash';
import browser from 'webextension-polyfill';

const { debounce } = _;

export default {
  name: 'todo',
  data() {
    return {
      todoTodayVal: this.$store.state.todoTodayVal,
      todoVal: this.$store.state.todoVal,
    };
  },
  components: {
    Input,
  },
  watch: {
    '$store.state.todoTodayVal'(val) {
      this.todoTodayVal = val;
    },
    '$store.state.todoVal'(val) {
      this.todoVal = val;
    },
    todoTodayVal: debounce(function (value) {
      this.changeTodoTodayVal(value);
    }, 300),
    todoVal: debounce(function (value) {
      this.changeTodoVal(value);
    }, 300),
  },
  methods: {
    changeTodoTodayVal(value) {
      browser.runtime.sendMessage({
        key: 'changeTodoTodayVal',
        payload: value,
      });
    },
    changeTodoVal(value) {
      browser.runtime.sendMessage({
        key: 'changeTodoVal',
        payload: value,
      });
    },
  },
};
</script>
<style lang="scss">
@import "~ui/element-variables";
.todo {
  .el-textarea__inner {
    background-color: #ddd;
    border-color: #c0c4cc;
    &:focus {
      border-color: darken($--color-primary, 10%);
    }
  }
}
</style>

<style lang="scss" scoped>
.tab-card {
  margin: 20px 0;
}
.todo-header {
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #ddd;
  background-color: #333;
  border-radius: 3px;
}
</style>
