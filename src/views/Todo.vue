<template>
  <div class="todo">
    <div class='todo-header'>Today</div>
    <vue-editor v-model="todoTodayVal" :editorToolbar="customToolbar"></vue-editor>
    <div class='todo-header'>Next</div>
    <vue-editor v-model="todoVal" :editorToolbar="customToolbar"></vue-editor>
  </div>
</template>

<script>
import { Input } from 'element-ui';
// import { debounce } from 'lodash';
import _ from 'lodash';
import { VueEditor } from 'vue2-editor';

const { debounce } = _;

export default {
  name: 'todo',
  data() {
    return {
      todoTodayVal: this.$store.state.todoTodayVal,
      todoVal: this.$store.state.todoVal,
      customToolbar: [

        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        // [{ direction: 'rtl' }], // text direction

        // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        // [{ font: [] }],
        [{ align: [] }],

        ['clean'],
      ],
    };
  },
  components: {
    Input, VueEditor,
  },
  watch: {
    '$store.state.todoTodayVal'(val) {
      this.todoTodayVal = val;
    },
    '$store.state.todoVal'(val) {
      this.todoVal = val;
    },
    todoTodayVal: debounce(function (value) { this.changeTodoTodayVal(value); }, 300),
    todoVal: debounce(function (value) { this.changeTodoVal(value); }, 300),
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
<style lang="scss" scoped>
.tab-card{
    margin:20px 0;
}
.todo-header{
    margin:15px 0;
    font-size: 20px;
    font-weight:600;
}
</style>

