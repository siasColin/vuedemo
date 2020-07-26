<template>
  <div class="wrap">
    <div class="flex-1">
      <tree
        :nodes="nodes"
        :setting="setting"
        @onCreated="handleCreated"
        @onClick="onClick"
      />
    </div>
    <div>
      <el-button
        @click="getCheckedNodes"
        v-if="checkEnable"
        size="small"
        type="primary"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import tree from 'vue-giant-tree'
export default {
  name: 'OrgTree',
  componentName: 'OrgTree',
  props: {
    handleOrgTreeClick: Function,
    handleOrgTreeAllCheck: Function,
    checkEnable: Boolean
  },
  components: {
    tree
  },
  created() {
    this.getOrgTree()
  },
  data() {
    return {
      ztreeObj: null,
      nodes: [],
      setting: {
        check: {
          enable: this.checkEnable
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pId'
          }
        },
        view: {
          showIcon: false
          /* addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom */
        }
      }
    }
  },
  methods: {
    async getOrgTree() {
      const { data: res } = await this.$axios.get('orgManage/orgListTree')
      console.log(res)
      if (res.returnCode != '0') {
        this.nodes = []
        return this.$message.error(res.returnMessage)
      }
      this.nodes = res.data
    },
    addHoverDom(treeid, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`)
      if (item && !item.querySelector('.tree_extra_btn')) {
        const btn = document.createElement('sapn')
        btn.id = `${treeid}_${treeNode.id}_btn`
        btn.classList.add('tree_extra_btn')
        btn.innerText = '删除'
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          this.clickRemove(treeNode)
        })
        item.appendChild(btn)
      }
    },
    removeHoverDom(treeid, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`)
      if (item) {
        const btn = item.querySelector('.tree_extra_btn')
        if (btn) {
          item.removeChild(btn)
        }
      }
    },
    clickRemove(treeNode) {
      console.log('remove', treeNode)
      this.ztreeObj && this.ztreeObj.removeNode(treeNode)
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      // console.log(evt.type, treeNode)
      // 如果是check 那么点击事件触发选中 check 事件
      if (this.checkEnable) {
        this.ztreeObj.checkNode(treeNode, true, true)
      } else {
        // 否则调用父组件的回调函数，完成父组件的业务逻辑
        this.handleOrgTreeClick(treeNode)
      }
    },
    handleCreated: function (ztreeObj) {
      this.ztreeObj = ztreeObj
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    getCheckedNodes() {
      const checkedNodeIDs = this.getCheckedNodesWithParent(this.ztreeObj)
      this.handleOrgTreeAllCheck(checkedNodeIDs)
    },
    getCheckedNodesWithOutParent(zTree) {
      // 获取check 选中节点的id集合，逗号分隔（不包含父节点和半选节点）
      var selectedNodes = ''
      var nodes = zTree.getCheckedNodes(true)
      for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].isParent == false && nodes[i].halfCheck == false) {
          // 过滤掉父节点和半选节点
          selectedNodes += nodes[i].id + ','
        }
      }
      if (selectedNodes.length > 0) {
        selectedNodes = selectedNodes.substring(0, selectedNodes.length - 1)
      }
      return selectedNodes
    },
    getCheckedNodesWithParent(zTree) {
      // 获取check 选中节点的id集合，逗号分隔（包含父节点和半选节点）
      var selectedNodes = ''
      var nodes = zTree.getCheckedNodes(true)
      for (var i = 0, l = nodes.length; i < l; i++) {
        selectedNodes += nodes[i].id + ','
      }
      if (selectedNodes.length > 0) {
        selectedNodes = selectedNodes.substring(0, selectedNodes.length - 1)
      }
      return selectedNodes
    }
  }
}
</script>

<style lang="less">
.wrap {
  width: 100%;
  vertical-align: middle;
  text-align: center;
}
.flex-1 {
  overflow: auto;
  width: 350px;
  height: 350px;
  display: inline-block;
}
/* 自定义按钮样式 */
.tree_extra_btn {
  display: inline-block;
  padding: 0 3px;
  color: red;
}
</style>
