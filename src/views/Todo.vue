<template>
  <div class="todo">
    <Input
      type="textarea"
      :autosize="{ minRows: 4}"
      placeholder="请输入内容"
      v-model="textarea" />
  </div>
</template>

<script>
import { Input } from 'element-ui';
// import { debounce } from 'lodash';
import _ from 'lodash';

const { debounce } = _;

export default {
  name: 'todo',
  data() {
    return {
      textarea: '',
    };
  },
  components: {
    Input,
  },
  watch: {
    '$store.state.todoVal'(val) {
      this.textarea = val;
    },
    textarea: debounce(function () { this.changeTodoVal(); }, 300),
  },
  methods: {
    changeTodoVal() {
      console.log(this.textarea);
      this.$store.commit('changeTodoVal', this.textarea);
    },
  },
};
</script>
<style lang="scss" scoped>
.tab-card{
    margin:20px 0;
}
</style>

