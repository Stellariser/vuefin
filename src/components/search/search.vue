<template>
  <div>
    <h3>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">数据管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>数据查找</el-breadcrumb-item>
      </el-breadcrumb>
    </h3>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="queryInfo.valueD" collapse-tags @focus="getDataset" @change="sendDataset(queryInfo.valueD)" multiple filterable remote style="margin-left: -50px;" placeholder="请选择数据集">
            <el-option
              v-for="item in optionsD"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
        <el-col :span="4">
          <el-select v-model="queryInfo.valueS" collapse-tags @focus="getScene" @change="sendScene(queryInfo.valueS)" multiple filterable remote style="margin-left: -250px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.valueC" collapse-tags @focus="getClasscification" @change="sendClasscification(queryInfo.valueC)" multiple filterable remote style="margin-left: -480px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
        <el-col :span="4">
          <el-select v-model="queryInfo.valueT" collapse-tags @focus="getTag" @change="sendTag(queryInfo.valueT)" multiple filterable remote style="margin-left: -700px;" placeholder="请选择标签">
            <el-option
              v-for="item in optionsT"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
          <el-button type="primary" style="margin-left: -700px;" @click="getFrameList">搜索</el-button>
        <el-col style="margin-left: 150px; margin-top: -40px">
          <el-radio v-model="queryInfo.extendLabel" @change="getFrameList" label="1" border >仅展示帧</el-radio>
          <el-radio v-model="queryInfo.extendLabel" @change="getFrameList" label="2" border>展示帧的标签</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: -10px">
        <el-col :span="8">
          <el-select v-model="queryInfo.valueNS" collapse-tags @focus="getScene" @change="sendScene(queryInfo.valueNS)" multiple filterable remote style="margin-left: 120px;" placeholder="请选择不需要的场景">
            <el-option
              v-for="item in optionsNS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.valueNC" collapse-tags @focus="getClasscification" @change="sendClasscification(queryInfo.valueNC)" multiple filterable remote style="margin-left: -480px;" placeholder="请选择不需要的分类">
            <el-option
              v-for="item in optionsNC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
        <el-col :span="4">
          <el-select v-model="queryInfo.valueNT" collapse-tags @focus="getTag" @change="sendTag(queryInfo.valueNT)" multiple filterable remote style="margin-left: -700px;" placeholder="请选择不需要的标签">
            <el-option
              v-for="item in optionsNT"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col >
      </el-row>
      <!--用户列表区 -->
      <el-table :data="Framelist" border stripe style="margin-top: 50px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="所属数据集" prop="name"></el-table-column>
        <el-table-column label="包含分类" prop="classContent"></el-table-column>
        <el-table-column label="包含场景" prop="sceneContent"></el-table-column>
        <el-table-column label="包含标签" prop="tagConTent"></el-table-column>
        <el-table-column label="创建人" prop="create_person"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="帧分类" prop="class_name"></el-table-column>
        <el-table-column label="帧场景" prop="scene_name"></el-table-column>
        <el-table-column label="包含目标" prop="target_id"></el-table-column>
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
        :current-page="queryInfo.pageNumber"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
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
      optionsS: [],
      optionsC: [],
      optionsD: [],
      optionsT: [],
      optionsNS: [],
      optionsNC: [],
      optionsNT: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 10,
        valueS: [],
        valueC: [],
        valueD: [],
        valueT: [],
        valueNS: [],
        valueNC: [],
        valueNT: [],
        VSString: '',
        VCString: '',
        VDString: '',
        VTString: '',
        VNSString: '',
        VNCString: '',
        VNTString: '',
        extendLabel: '1'
      },
      Framelist: [],
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
    this.getFrameList()
  },
  methods: {
    async getFrameList() {
      this.queryInfo.VCString = JSON.stringify(this.queryInfo.valueC)
      this.queryInfo.VSString = JSON.stringify(this.queryInfo.valueS)
      this.queryInfo.VDString = JSON.stringify(this.queryInfo.valueD)
      this.queryInfo.VTString = JSON.stringify(this.queryInfo.valueT)
      this.queryInfo.VNCString = JSON.stringify(this.queryInfo.valueNC)
      this.queryInfo.VNSString = JSON.stringify(this.queryInfo.valueNS)
      this.queryInfo.VNTString = JSON.stringify(this.queryInfo.valueNT)
      const { data: res } = await this.$http.get('search/queryFrame', { params: this.queryInfo })
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.Framelist = res.data.Frames
      this.total = res.data.totalpage
      console.log(res)
    },
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
      this.queryInfo.pageSize = newSize
      this.getFrameList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getFrameList()
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
        this.optionsS = res.data.scene // 把获取到的数据赋给this.data
        this.optionsNS = res.data.scene
      }
    },
    sendScene () {
      console.log(this.valueS)
    },
    async getDataset () {
      const { data: res } = await this.$http.get('categorise/queryDataset')
      if (res.meta.status === '200') {
        this.optionsD = res.data.dataset // 把获取到的数据赋给this.data
      }
    },
    async getClasscification () {
      const { data: res } = await this.$http.get('categorise/queryClasscification')
      if (res.meta.status === '200') {
        this.optionsC = res.data.Classcification // 把获取到的数据赋给this.data
        this.optionsNC = res.data.Classcification
      }
    },
    async getTag () {
      const { data: res } = await this.$http.get('categorise/queryTag')
      if (res.meta.status === '200') {
        this.optionsT = res.data.Tag // 把获取到的数据赋给this.data
        this.optionsNT = res.data.Tag
      }
    },
    sendClasscification () {
      console.log(this.valueC)
    },
    sendDataset () {
      console.log(this.valueD)
    },
    sendTag () {
      console.log(this.valueT)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
