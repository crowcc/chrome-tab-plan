<template>
  <div class="tablist">
    <Card class="box-card">
      <div slot="header" class="clearfix">
        <Input v-show="editingTitle" ref="titleInput" v-model="titleVal" placeholder="请输入标题" @blur="saveTitle" @keyup.enter.native="saveTitle" />
        <div v-show="!editingTitle" class='title-line'>
          <div class='block-title-line' @click="collapseTabs">
            <i  :class="!blockItem.collapse?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
            <div class="block-title-name" @click="editTitle">{{blockItem.title||'临时'}}</div>
          </div>
          <div class='tab-action'>
            <Button round size="small" @click="openAll">Open</Button>
            <Button v-if="!isStatic" size="small" type="warning" icon="el-icon-edit" circle @click="editTitle"></Button>
            <Button size="small" type="danger" icon="el-icon-delete" circle  @click="deleteTabList"></Button>
          </div>
        </div>
      </div>
      <CollapseTransition>
        <Draggable v-show='!blockItem.collapse' class='tab-list' v-model="tablist" :options="{group:'tab-item'}">
          <div v-for="(element,index) in tablist" :key="element.url" class='tab-item'>
            <div class='tab-title' @click='()=>openTabPage(element)'>{{element.title}}</div>
            <div class='tab-action'>
              <Popover
                placement="left"
                width="200"
                class="action-btn"
                trigger="hover">
                <div v-if='!isStatic' class='tab-block-item' @click='()=>moveToBlock(index,0)'>临时</div>
                <template v-for="(value,bindex) in $store.state.tabstore">
                  <div class='tab-block-item' :key='bindex' v-if='blockIndex!==bindex' @click='()=>moveToBlock(index,bindex)'>{{value.title}}</div>
                </template>
                <Button slot="reference" size="small" type="primary" icon="el-icon-sort" circle @click="editTitle"></Button>
              </Popover>
              <Button size="small" type="warning" icon="el-icon-edit" circle @click="()=>startEditTab(element,index)"></Button>
              <Button size="small" type="danger" icon="el-icon-delete" circle @click="()=>deleteTab(index)"></Button>
            </div>
          </div>
          <div class='empty-list' v-if="!tablist||!tablist.length">拖入tab以添加</div>
        </Draggable>
      </CollapseTransition>
    </Card>
    <!-- <Dialog
      title="新建标签组"
      :visible.sync="addTabBlockVisible">
      <Form :model="tabForm" :rules="rules" ref="form" label-width="80px">
        <FormItem label="标签名称" prop="title">
          <Input v-model="tabForm.title" />
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click="editTabVisible = false; $refs.form.resetFields();">取 消</Button>
        <Button type="primary" @click="editTab">确 定</Button>
      </span>
    </Dialog> -->
    <Dialog
      title="修改标签"
      :visible.sync="editTabVisible">
      <Form :model="tabForm" :rules="rules" ref="form" label-width="80px">
        <FormItem label="标签名称" prop="title">
          <Input v-model="tabForm.title" />
        </FormItem>
        <FormItem label="url地址" prop="url">
          <Input v-model="tabForm.url" />
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click="editTabVisible = false; $refs.form.resetFields();">取 消</Button>
        <Button type="primary" @click="editTab">确 定</Button>
      </span>
    </Dialog>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import { Input, Button, Card, Dialog, Form, FormItem, Popover } from 'element-ui';
// import { cloneDeep } from 'lodash';
import _ from 'lodash';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

const { cloneDeep } = _;
export default {
  name: 'tablist',
  data() {
    return {
      titleVal: '',
      editingTitle: false,
      editTabVisible: false,
      tabForm: {
        title: '',
        url: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入url地址', trigger: 'blur' },
        ],
      },
      editingIndex: '',
    };
  },
  props: {
    isStatic: {
      type: Boolean,
      default: false,
    },
    blockItem: {
      type: Object,
      default: () => ({
        title: '临时',
        list: [],
        collapse: false,
      }),
    },
    changelist: {
      type: Function,
      default: () => {},
    },
    deleteTabList: {
      type: Function,
      default: () => {},
    },
    blockIndex: {
      type: Number,
      default: -1,
    },
  },
  components: {
    Draggable,
    Input,
    Button,
    Card,
    Dialog,
    Form,
    FormItem,
    CollapseTransition,
    Popover,
  },
  computed: {
    tablist: {
      get() {
        return this.blockItem.list;
      },
      set(value) {
        this.changelist('list', value);
      },
    },
  },
  methods: {
    editTitle() {
      if (this.isStatic) {
        return;
      }
      this.titleVal = this.blockItem.title;
      this.editingTitle = true;
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      });
    },
    saveTitle() {
      this.editingTitle = false;
      this.changelist('title', this.titleVal);
    },
    deleteTab(index) {
      const list = cloneDeep(this.blockItem.list);
      list.splice(index, 1);
      this.changelist('list', list);
    },
    openAll() {
      this.blockItem.list.forEach((item) => {
        this.openTabPage(item);
      });
    },
    openTabPage(value) {
      if (value.url.indexOf('https://') < 0 && value.url.indexOf('http://') < 0) {
        window.open(`https://${value.url}`);
      } else {
        window.open(value.url);
      }
    },
    startEditTab(value, index) {
      this.tabForm.title = value.title;
      this.tabForm.url = value.url;
      this.editingIndex = index;
      this.editTabVisible = true;
    },
    editTab() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const newlist = cloneDeep(this.blockItem.list);
          newlist[this.editingIndex].title = this.tabForm.title;
          newlist[this.editingIndex].url = this.tabForm.url;
          this.changelist('list', newlist);
          this.editTabVisible = false;
          this.$refs.form.resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    collapseTabs() {
      this.changelist('collapse', !this.blockItem.collapse);
    },
    moveToBlock(index, bindex) {
      const newBlockItemList = cloneDeep(this.blockItem.list);
      const moveitem = newBlockItemList.splice(index, 1);
      console.log(moveitem[0]);
      this.changelist('list', newBlockItemList);
      const moveTolist = cloneDeep(this.$store.state.tabstore[bindex].list);
      moveTolist.unshift(moveitem[0]);
      this.$store.commit('changeTabBlock', {
        key: 'list',
        val: moveTolist,
        index: bindex,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tab-item,
.title-line {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-line {
  &:hover {
    .tab-action {
      width: 180px;
    }
  }
}
.tab-item {
  margin-bottom: 10px;
  padding: 5px 15px;
  &:hover {
    background-color: #ecf5ff;
     color: #409eff;
    .tab-action {
      width: 130px;
    }
  }
}
.title-line {
  font-weight: 600;
  height: 32px;
}
.tab-list {
  margin: 0 1px;
  .tab-item:last-child {
    margin-bottom: 0;
  }
}
.tab-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  line-height: 38px;
  flex: auto;
  border-radius: 3px;
}
.tab-action {
  flex: none;
  text-align: right;
  width: 0;
  overflow: hidden;
  height: 38px;
  line-height: 38px;
}
.block-title-line {
  display: flex;
  align-items: center;
  flex: auto;
}
.block-title-name {
  margin-left: 10px;
}
.empty-list {
  text-align: center;
  color: rgba(0, 0, 0, 0.3);
  line-height: 100px;
}
.action-btn {
  margin-right: 10px;
}
.tab-block-item {
  line-height: 26px;
  padding: 0 10px;
  &:hover {
    cursor: pointer;
    color: #409eff;
    background-color: #ecf5ff;
  }
}
</style>

<style lang="scss">
.tablist {
  .el-card__header {
    padding: 10px 18px;
  }
  .el-card__body {
    padding: 0;
  }
}
</style>
