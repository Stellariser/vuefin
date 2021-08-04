<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">数据管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    <!--卡片视图区域-->
     <el-card class="box-card">
       <!--搜索与添加区域-->
       <el-row :gutter="10">
         <el-col :span="8">
           <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable>
             <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
           </el-input>
         </el-col>
         <el-col :span="2">
           <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
         </el-col>
       </el-row>

       <!--用户列表区 -->
       <el-table :data="userlist" border stripe>
         <el-table-column type="index"></el-table-column>
         <el-table-column label="姓名" prop="name"></el-table-column>
         <el-table-column label="密码" prop="password"></el-table-column>
         <el-table-column label="权限" prop="status"></el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
             {{scope.nodes}}
             <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
             </el-tooltip>
             <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id, scope.row.status)"></el-button>
             </el-tooltip>
             <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
               <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
             </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
       <!--分页-->
       <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pageNumber"
         :page-sizes="[1, 2, 5, 10]"
         :page-size="queryInfo.pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="totalpage">
       </el-pagination>
    </el-card>
<!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
    @close="addDialogClose">
      <!--内容主体-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="addForm.status"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
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
      @close="editDialogClose">
      <!--内容主体-->
      <el-form ref="editFormRef" :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" v-if="show"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="editForm.status"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 5
      },
      userlist: [],
      totalpage: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        name: '',
        password: '',
        status: ''
      },
      editForm: {
        id: '',
        name: '',
        password: '',
        status: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度再3-10个字符之间',
            trigger: 'blur'
          },
          {
            pattern: /^((?!\\|\/|:|\*|\?|<|>|\||'|%).){3,10}$/,
            message: '用户名不能包含特殊字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '密码的长度再3-15个字符之间',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请输入用户权限',
            trigger: 'blur'
          },
          { min: 1, max: 1, message: '用户的权限只能为0或1', trigger: 'blur' },
          {
            pattern: /0|1/,
            message: '权限只能为0或1',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('user/queryUserVague', { params: this.queryInfo })
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.userlist = res.data.users
      const tokenStr = window.sessionStorage.getItem('token')
      if (tokenStr !== '0') {
        for (let i = 0; i < this.userlist.length; i++) {
          this.userlist[i].password = '不可见'
        }
      }
      this.totalpage = res.data.totalpage
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getUserList()
    },
    // 监听switch状态的改变
    async userStateChange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/status/${userinfo.ststus}`)
      if (res.meta.status !== '200') {
        userinfo.ststus = !userinfo.ststus
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      const tokenStr = window.sessionStorage.getItem('token')
      console.log(tokenStr)
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('user/addUser', this.addForm)
        if (res.meta.status !== '201') {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        await this.getUserList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      const tokenStr = window.sessionStorage.getItem('token')
      console.log(tokenStr)
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      const { data: res } = await this.$http.get('user/getUserById', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async editUserInfo() {
      const { data: res } = await this.$http.post('user/editUser', this.editForm)
      if (res.meta.status !== '200') {
        return this.$message.error('修改用户信息失败')
      }
      this.$message.success('修改用户成功')
      this.editForm = res.data
      this.editDialogVisible = false
      await this.getUserList()
    },
    // 根据id删除对应的用户信息
    async removeUserById(id, status) {
      const tokenStr = window.sessionStorage.getItem('token')
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      if (id.toString() === window.sessionStorage.getItem('id')) {
        return this.$message.error('你不能删除你自己')
      }
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { return err })
      // 确认的话返回confirm，取消的话返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      console.log('确认删除')
      const { data: res } = await this.$http.get('user/removeUser', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('删除用户信息失败')
      }
      this.$message.success('删除用户成功')
      await this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
