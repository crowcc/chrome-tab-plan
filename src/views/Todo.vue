<template>
  <div class="todo">
    <div class="todo-header">Today</div>
    <Input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="todoTodayVal"/>
    <div class="todo-header">Next</div>
    <Input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="todoVal"/>
  </div>
</template>

<script>
import { Input } from 'element-ui';
import _ from 'lodash';

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
      this.$store.commit('changeTodoTodayVal', value);
    },
    changeTodoVal(value) {
      this.$store.commit('changeTodoVal', value);
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
    &:focus{
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
  margin: 10px 0;
  font-size: 14px;
  font-weight: 600;
}
</style>
