<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="query.userName"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加</el-button
          >
        </el-col>
      </el-row>
      <!--数据表格区-->
      <el-table :data="userList" border style="width: 100%;">
        <el-table-column prop="userName" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="userEmail" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="电话"> </el-table-column>
        <el-table-column
          prop="userGender"
          label="性别"
          :formatter="formatGender"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!--自 2.6.0 起有所更新。已废弃的使用 slot-scope,2.X虽以废弃但可以用，vue3中将不可用-->
          <!--          <template slot-scope="scope">-->
          <template v-slot:default="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="userDelete(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-dialog
        width="30%"
        title="请选择机构"
        :visible.sync="orgDialogVisible"
        append-to-body
      >
        <OrgTree
          :handleOrgTreeClick="handleOrgTreeClick"
          :checkEnable="false"
        ></OrgTree>
      </el-dialog>
      <div class="avatar_div">
        <span class="avatar_title">请上传头像</span>
        <el-upload
          name="file"
          :action="avatarPostUrl"
          :data="avatarPrefixPath"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-avatar
            :src="avatarUrl"
            :size="80"
            fit="fill"
            style="cursor: pointer;"
          >
          </el-avatar>
        </el-upload>
      </div>
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="loginName">
              <el-input v-model="addForm.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input show-password v-model="addForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="addForm.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="userGender">
              <el-radio-group v-model="addForm.userGender">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="addForm.userEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phoneNumber">
              <el-input v-model="addForm.phoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="机构" prop="orgName">
              <el-input v-model="addForm.orgName">
                <i
                  style="cursor: pointer;"
                  slot="suffix"
                  class="el-input__icon el-icon-edit"
                  @click="orgDialogVisible = true"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                style="width: 100%;"
                v-model="addForm.roleIds"
                multiple
                collapse-tags
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="用户状态" prop="userStatus">
          <el-radio-group v-model="addForm.userStatus">
            <el-radio label="0">正常</el-radio>
            <el-radio label="2">禁用</el-radio>
            <el-radio label="3">过期</el-radio>
            <el-radio label="4">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-dialog
        width="30%"
        title="请选择机构"
        :visible.sync="orgDialogVisibleInEdit"
        append-to-body
      >
        <OrgTree
          :handleOrgTreeClick="handleOrgTreeClickInEdit"
          :checkEnable="false"
        ></OrgTree>
      </el-dialog>
      <div class="avatar_div">
        <span class="avatar_title">请上传头像</span>
        <el-upload
          name="file"
          :action="avatarPostUrl"
          :data="avatarPrefixPath"
          :show-file-list="false"
          :on-success="handleAvatarSuccessWithEdit"
          :before-upload="beforeAvatarUpload"
        >
          <el-avatar :size="80" fit="fill" style="cursor: pointer;">
            <img
              style="object-fit: fill;"
              :src="avatarUrl"
              @error="avatarLoadError"
            />
          </el-avatar>
        </el-upload>
      </div>
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        @submit.native.prevent
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="loginName">
              <el-input v-model="editForm.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="editForm.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="editForm.userEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phoneNumber">
              <el-input v-model="editForm.phoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="机构" prop="orgName">
              <el-input v-model="editForm.orgName">
                <i
                  style="cursor: pointer;"
                  slot="suffix"
                  class="el-input__icon el-icon-edit"
                  @click="orgDialogVisibleInEdit = true"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                style="width: 100%;"
                v-model="editForm.roleIds"
                multiple
                collapse-tags
                placeholder="请选择"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="userGender">
              <el-radio-group v-model="editForm.userGender">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户状态" prop="userStatus">
              <el-radio-group v-model="editForm.userStatus">
                <el-radio label="0">正常</el-radio>
                <el-radio label="2">禁用</el-radio>
                <el-radio label="3">过期</el-radio>
                <el-radio label="4">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Common from '../../assets/js/common'
import OrgTree from '../common/OrgTree'
export default {
  components: {
    OrgTree
  },
  created() {
    this.getUserList()
  },
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      query: {
        userName: '',
        page: 1,
        limit: 2
      },
      avatarUrl: Common.staticSourceBaseUrl + '/image/boy-01.png',
      avatarPrefixPath: { prefixPath: 'avatarImgs' },
      avatarPostUrl: Common.staticSourceBaseUrl + '/common/uploadSingle',
      total: 0,
      // 用户列表数据
      userList: [],
      // 角色列表
      roleList: [],
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户Dialog的内层弹出框，用于展示机构树
      orgDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        loginName: '',
        password: '',
        userName: '',
        userGender: '0',
        userEmail: '',
        phoneNumber: '',
        orgCode: '',
        orgName: '',
        roleIds: [],
        headImg: '',
        userStatus: '0'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '账号的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '姓名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        userGender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        orgName: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        userStatus: [
          { required: true, message: '请选择用户状态', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户Dialog的内层弹出框，用于展示机构树
      orgDialogVisibleInEdit: false,
      // 修改用户的表单数据
      editForm: []
    }
  },
  editDialogVisible: false,
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('userManage/userList', {
        params: this.query
      })
      console.log(res)
      if (res.returnCode != '0') {
        this.userList = []
        return this.$message.error(res.returnMessage)
      }
      this.total = res.total
      this.userList = res.data
    },
    handleSizeChange(pageSize) {
      this.query.limit = pageSize
      this.getUserList()
      console.log(`每页 ${pageSize} 条`)
    },
    handleCurrentChange(pageNum) {
      this.query.page = pageNum
      this.getUserList()
      console.log(`当前页: ${pageNum}`)
    },
    formatGender(row, column) {
      return row.userGender == '0'
        ? '男'
        : row.userGender == '1'
        ? '女'
        : '未知'
    },
    async userDelete(userid) {
      console.log(userid)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((error) => error)
      // 点击确认 confirmResult = confirm
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        // 执行删除
        const { data: res } = await this.$axios.delete('userManage/user', {
          params: { ids: userid }
        })
        if (res.returnCode != '0') {
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        // 重新获取用户列表数据
        this.getUserList()
      }
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        this.addForm.roleIds = this.addForm.roleIds.join(',')
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$axios.post(
          'userManage/user',
          this.$qs.stringify(this.addForm)
        )
        if (res.returnCode != '0') {
          return this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.avatarUrl = Common.staticSourceBaseUrl + '/image/boy-01.png'
      this.addForm.headImg = ''
      this.roleList = []
    },
    async showEditDialog(userid) {
      const { data: res } = await this.$axios.get('userManage/user/' + userid)
      if (res.returnCode != '0') {
        return this.$message.error('查询用户数据失败！')
      }
      // 返回的用户信息中没有roleIds属性，默认给个空数组，后面再初始化
      res.data.roleIds = []
      // 密码不允许修改
      delete res.data.password
      this.editForm = res.data
      // 解决数字字段回显失败问题
      this.editForm.userGender = this.editForm.userGender + ''
      this.editForm.userStatus = this.editForm.userStatus + ''
      // 显示头像
      this.avatarUrl = Common.staticSourceBaseUrl + '/' + this.editForm.headImg
      this.editDialogVisible = true
      // 根据机构编码加载角色列表
      this.getRolesByOrgCode(this.editForm.orgCode)
      // 加载当前编辑用户绑定的角色列表
      const { data: roleRes } = await this.$axios.get(
        'roleManage/userRoleList/' + userid
      )
      if (roleRes.returnCode != '0') {
        return this.$message.error('查询用户角色信息失败！')
      }
      roleRes.data.forEach((item, index) => {
        this.editForm.roleIds.push(item + '')
      })
    },
    // 修改用户信息
    userEdit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        this.editForm.roleIds = this.editForm.roleIds.join(',')
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$axios.put(
          'userManage/user',
          this.$qs.stringify(this.editForm)
        )
        if (res.returnCode != '0') {
          return this.$message.error('修改用户信息失败！')
        }
        this.$message.success('修改用户信息成功！')
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.avatarUrl = Common.staticSourceBaseUrl + '/image/boy-01.png'
      this.roleList = []
    },
    // 头像上传之前的回调函数，限制上传图片的大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 添加用户弹出框中的头像上传成功回调函数
    handleAvatarSuccess(res, file) {
      if (res.returnCode != '0') {
        return this.$message.error('上传头像失败，请稍后再试!')
      }
      this.avatarUrl = Common.staticSourceBaseUrl + '/' + res.data.fileUrl
      this.addForm.headImg = res.data.fileUrl
    },
    // 修改用户弹出框中的头像上传成功回调函数
    handleAvatarSuccessWithEdit(res, file) {
      if (res.returnCode != '0') {
        return this.$message.error('上传头像失败，请稍后再试!')
      }
      this.avatarUrl = Common.staticSourceBaseUrl + '/' + res.data.fileUrl
      console.log(this.avatarUrl)
      this.editForm.headImg = res.data.fileUrl
    },
    handleOrgTreeClick(node) {
      this.addForm.orgName = node.name
      this.addForm.orgCode = node.id
      this.orgDialogVisible = false
      // 重新验证
      this.$refs.addFormRef.validateField('orgName')
      this.addForm.roleIds = []
      this.getRolesByOrgCode(this.addForm.orgCode)
    },
    // 根据机构编码获取角色列表
    async getRolesByOrgCode(orgCode) {
      this.roleList = []
      if (!Common.isEmpty(orgCode)) {
        const { data: res } = await this.$axios.get(
          'roleManage/roleList/' + orgCode
        )
        if (res.returnCode != '0') {
          if (res.returnCode != '0') {
            return this.$message.error(res.returnMessage)
          }
        }
        res.data.forEach((item, index) => {
          this.roleList.push({ value: item.id + '', label: item.roleName })
        })
      }
    },
    handleOrgTreeClickInEdit(node) {
      this.editForm.orgName = node.name
      this.editForm.orgCode = node.id
      this.orgDialogVisibleInEdit = false
      // 重新验证
      this.$refs.editFormRef.validateField('orgName')
      this.editForm.roleIds = []
      this.getRolesByOrgCode(this.editForm.orgCode)
    },
    avatarLoadError() {
      this.avatarUrl = Common.staticSourceBaseUrl + '/image/avatar.png'
    }
  }
}
</script>

<style lang="less" scoped>
.avatar_div {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  text-align: center;
  align-items: center;
  margin-bottom: 20px;
}
.avatar_title {
  font-size: 14px;
  color: #8492a6;
  margin-bottom: 10px;
}
</style>
