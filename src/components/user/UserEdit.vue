<template>
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
      :rules="editFormRules"
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
</template>

<script>
import Common from '../../assets/js/common'
import OrgTree from '../common/OrgTree'
export default {
  name: 'UserEdit',
  components: {
    OrgTree
  },
  props: {
    getUserList: Function
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
      avatarUrl: Common.staticSourceBaseUrl + '/image/boy-01.png',
      avatarPrefixPath: { prefixPath: 'avatarImgs' },
      avatarPostUrl: Common.staticSourceBaseUrl + '/common/uploadSingle',
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户Dialog的内层弹出框，用于展示机构树
      orgDialogVisibleInEdit: false,
      // 修改用户的表单数据
      editForm: [],
      // 角色列表
      roleList: [],
      // 编辑表单的验证规则对象
      editFormRules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '账号的长度在3~10个字符之间',
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
      }
    }
  },
  methods: {
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
    // 头像上传之前的回调函数，限制上传图片的大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
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
