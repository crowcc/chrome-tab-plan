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
import { debounce } from 'lodash';

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
  beforeMount() {
    this.textarea = this.$store.state.todoVal;
  },
  watch: {
    textarea: debounce(function () { this.changeTodoVal(); }, 1000),
    //    throttle(function(){console.log(77)}, 100)()

  },
  methods: {
    changeTodoVal() {
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

