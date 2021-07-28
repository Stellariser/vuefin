<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据集管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据集详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="value3" multiple style="margin-left: -50px;" placeholder="请选择数据集">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
        <el-col :span="4">
          <el-select v-model="value1" @focus="getScene" @change="sendScene(value1)" multiple filterable remote style="margin-left: -250px;" placeholder="请选择场景" >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="value2" multiple filterable remote style="margin-left: -450px;" placeholder="请选择分类" :remote-method="getClasscification">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col >
        <el-col :span="8">
          <el-input placeholder="请输入内容" style="margin-left: 40px;" class="input-with-select" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">批量上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip" style="margin-left: 10px;">只能上传CAM文件，且不超过1TB</div>
        </el-upload>
        </el-col >
      </el-row>

      <!--用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="数据集名" prop="datasetid"></el-table-column>
        <el-table-column label="分类" prop="classcification"></el-table-column>
        <el-table-column label="场景" prop="scene"></el-table-column>
        <el-table-column label="创建人" prop="create_person"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="包含目标" prop="target"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
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
        <el-form-item label="数据集名" prop="datasetid">
          <el-input v-model="addForm.datasetid"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classcification">
          <el-input v-model="addForm.classcification"></el-input>
        </el-form-item>
        <el-form-item label="场景" prop="scene">
          <el-input v-model="addForm.scene"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="create_person">
          <el-input v-model="addForm.create_person"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="addForm.scene"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addForm.scene"></el-input>
        </el-form-item>
        <el-form-item label="包含目标" prop="target">
          <el-input v-model="addForm.target"></el-input>
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
      <el-form ref="editFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      options1: [],
      options3: [],
      value1: [],
      value2: [],
      value3: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        datasetid: '',
        classcification: '',
        scene: '',
        create_person: '',
        create_time: '',
        path: '',
        target: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blue'
          },
          { min: 3, max: 10, message: '用户名的长度再3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blue'
          },
          { min: 6, max: 15, message: '密码的长度再6-15个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch状态的改变
    async userStateChange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog() {
      this.editDialogVisible = true
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    async getScene () {
      const { data: res } = await this.$http.get('categorise/queryScene')
      if (res.meta.status === '200') {
        this.options1 = res.data.scene // 把获取到的数据赋给this.data
      }
    },
    sendScene () {
      console.log(this.value1)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
