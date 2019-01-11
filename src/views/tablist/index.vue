<template>
  <div>
    <div v-if="showTitleOnly" @click="scrollToView" class="tab-nav-item">
      <Draggable
        class="drag-group"
        :data-index="blockIndex"
        :id="`drag-group${blockIndex}`"
        v-model="tablist"
        :options="{group:'tab-item'}"
      >
        {{blockItem.title||'Temp'}}
        <span class="block-num">{{tablist.length}}</span>
      </Draggable>
    </div>
    <div class="tablist" v-if="!showTitleOnly&&showList" :id="'blockid'+blockIndex">
      <Card class="box-card">
        <div slot="header" class="clearfix">
          <Input
            v-show="editingTitle"
            class="title-input"
            ref="titleInput"
            v-model="titleVal"
            placeholder="please input"
            @blur="saveTitle"
            @keyup.enter.native="saveTitle"
          />
          <div v-show="!editingTitle" class="title-line">
            <div class="block-title-line" @click="collapseTabs">
              <i :class="!blockItem.collapse?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
              <div class="block-title-name">
                <span @click.stop="editTitle">{{blockItem.title||'Temp'}}</span>
              </div>
            </div>
            <div class="tab-action">
              <Button
                circle
                size="small"
                type="primary"
                icon="el-icon-caret-right
"
                @click="openAll"
              ></Button>
              <Button
                v-if="!isStatic"
                size="small"
                type="warning"
                icon="el-icon-edit"
                circle
                @click="editTitle"
              ></Button>
              <Button
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteTabList"
              ></Button>
            </div>
          </div>
        </div>
        <CollapseTransition>
          <Draggable
            v-show="!blockItem.collapse||filterVal!==''"
            class="tab-list"
            :id="`tab-list${blockIndex}`"
            :data-index="blockIndex"
            v-model="tablist"
            :options="{group:'tab-item'}"
            :move="onMoveCallback"
          >
            <div
              v-for="(element,index) in tablist"
              v-if="filterVal===''||element.title.toLowerCase().indexOf(filterVal.toLowerCase())>-1||element.url.toLowerCase().indexOf(filterVal.toLowerCase())>-1"
              :key="element.url"
              class="tab-item"
            >
              <div class="tab-title" @click="()=>openTabPage(element)">
                <div>{{element.title}}</div>
                <div>{{element.url}}</div>
              </div>
              <div class="tab-action">
                <Button
                  size="small"
                  type="warning"
                  icon="el-icon-edit"
                  circle
                  @click="()=>startEditTab(element,index)"
                ></Button>
                <Button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="()=>deleteTab(index)"
                ></Button>
              </div>
            </div>
            <div class="empty-list" v-if="!tablist||!tablist.length">drag tabs here</div>
          </Draggable>
        </CollapseTransition>
      </Card>
      <Dialog title="edit tab" :visible.sync="editTabVisible">
        <Form :model="tabForm" :rules="rules" ref="form" label-width="80px">
          <FormItem label="name" prop="title">
            <Input v-model="tabForm.title"/>
          </FormItem>
          <FormItem label="url" prop="url">
            <Input v-model="tabForm.url"/>
          </FormItem>
        </Form>
        <span slot="footer" class="dialog-footer">
          <Button @click="editTabVisible = false; $refs.form.resetFields();">cancle</Button>
          <Button type="primary" @click="editTab">submit</Button>
        </span>
      </Dialog>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import {
  Input,
  Button,
  Card,
  Dialog,
  Form,
  FormItem,
  Popover,
} from 'element-ui';
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
      showList: true,
      tabForm: {
        title: '',
        url: '',
      },
      rules: {
        title: [{ required: true, message: 'tab name is required', trigger: 'blur' }],
        url: [{ required: true, message: 'url is required', trigger: 'blur' }],
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
        title: 'Temp',
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
    filterVal: {
      type: String,
      default: '',
    },
    showTitleOnly: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    filterVal(filterVal) {
      if (filterVal !== '') {
        const filterResult = this.blockItem.list.filter(item =>
          item.title.toLowerCase().indexOf(filterVal.toLowerCase()) > -1 ||
          item.url.toLowerCase().indexOf(filterVal.toLowerCase()) > -1);
        if (filterResult.length) {
          this.showList = true;
        } else {
          this.showList = false;
        }
      } else {
        this.showList = true;
      }
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
    onMoveCallback(a) {
      //   return a.to.dataset.index !== a.from.dataset.index;
      return a.to.id.split('drag-group')[1] !== a.from.id.split('tab-list')[1];
    },
    scrollToView() {
      document
        .querySelector(`#blockid${this.blockIndex}`)
        .scrollIntoView({ block: 'start' });
    },
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
      if (
        value.url.indexOf('https://') < 0 &&
        value.url.indexOf('http://') < 0
      ) {
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
  },
};
</script>
<style lang="scss" scoped>
@import "~ui/element-variables";

.tab-nav-item {
  border: 1px solid #333;
  border-top: none;
  cursor: pointer;
}
.drag-group {
  padding: 15px 10px;
}
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
      width: auto;
      margin-right: 10px;
    }
  }
}
.title-input{
    padding:6px;
    width:calc(100% - 13px)
}
.tab-item {
  padding: 10px 15px;
  &:hover {
    background-color: darken($--color-primary, 40%);
    color: $--color-primary;
    .tab-action {
      width: auto;
    }
  }
}
.block-num {
  font-weight: normal;
  float: right;
}
.title-line {
  font-weight: 600;
  height: 52px;
}
.tab-list {
  margin: 0 1px;
  font-size: 13px;
  .tab-item:last-child {
    margin-bottom: 0;
  }
}
.tab-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  height: 38px;
  flex: auto;
  border-radius: 3px;
  line-height: 19px;
  & > div:nth-child(2) {
    color: #888;
  }
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
  padding: 10px;
}
.block-title-name {
  margin-left: 10px;
  width: calc(100% - 200px);
  line-height: 32px;
}
.empty-list {
  text-align: center;
  color: #ddd;
  line-height: 100px;
}
.action-btn {
  margin-right: 10px;
}
.el-card {
  background: #333;
  color: #eee;
}
.el-card__header {
  border-bottom: #666;
}
</style>

<style lang="scss">
.tablist {
  .el-card__header {
    padding: 0;
    border-color: #777;
  }
  .el-card__body {
    padding: 0;
  }
}
</style>
