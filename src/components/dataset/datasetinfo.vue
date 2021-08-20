<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据集管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据集详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20" style="margin-left: 100px">
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
        <el-button type="primary" style="margin-left: -1950px;" @click="getFrameList">搜索</el-button>
        <el-col :span="2">
          <el-button type="primary" style="margin-left: -650px;" @click="addDialogVisible = true">添加帧</el-button>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="8" style="margin-left: -277px">
            <el-select v-model="queryInfo.valueNS" collapse-tags @focus="getScene" @change="sendScene(queryInfo.valueNS)" multiple filterable remote style="margin-left: 120px;" placeholder="请选择不需要的场景">
              <el-option
                v-for="item in optionsNS"
                :key="item.id"
                :label="item.scene_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="margin-left: -15px">
            <el-select v-model="queryInfo.valueNC" collapse-tags @focus="getClasscification" @change="sendClasscification(queryInfo.valueNC)" multiple filterable remote style="margin-left: -480px;" placeholder="请选择不需要的分类">
              <el-option
                v-for="item in optionsNC"
                :key="item.id"
                :label="item.class_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col >
          <el-col :span="4" style="margin-left: -14px">
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
      <el-row :gutter="20" style="margin-top: -130px; margin-left: 1800px">
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
        <el-table-column label="包含目标" prop="target_id"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeFrameById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" style="margin-bottom: 20px;" @click="shwoDetail(scope.row.id)"></el-button>
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
      title="添加帧"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <!--内容主体-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="分类" prop="valueC">
          <el-select v-model="addForm.valueC" collapse-tags @focus="getClasscification" @change="sendClasscification(addForm.valueC)" multiple filterable remote style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景" prop="valueS">
          <el-select v-model="addForm.valueS" collapse-tags @focus="getScene" @change="sendScene(addForm.valueS)" multiple filterable remote style="margin-left: -900px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="valueT">
          <el-select v-model="addForm.valueT" collapse-tags @focus="getTag" @change="sendTag(addForm.valueT)" multiple filterable remote style="margin-left: -900px;" placeholder="请选择标签">
            <el-option
              v-for="item in optionsT"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="包含目标" prop="target">
          <el-input v-model="addForm.target"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFrame">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改帧"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <!--内容主体-->
      <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="路径" prop="path">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="包含目标" prop="target">
          <el-input v-model="editForm.target_id"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAuditInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailId: '',
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
        extendLabel: '0'
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
        tag: '',
        create_person: '',
        create_time: '',
        path: '',
        target: '',
        valueS: '',
        valueC: '',
        valueT: ''
      },
      editForm: {
        id: '',
        path: '',
        target_id: ''
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
    console.log(this.$route.query.id)
    this.queryInfo.valueD = parseInt(this.$route.query.id)
    console.log(this.queryInfo.valueD)
    this.getFrameList()
  },
  methods: {
    shwoDetail(id) {
      this.$router.push({ path: '/FrameInfo', query: { id } || this.redirect })
    },
    async getFrameList() {
      this.queryInfo.VCString = JSON.stringify(this.queryInfo.valueC)
      this.queryInfo.VSString = JSON.stringify(this.queryInfo.valueS)
      this.queryInfo.VDString = JSON.stringify(this.queryInfo.valueD)
      this.queryInfo.VTString = JSON.stringify(this.queryInfo.valueT)
      this.queryInfo.VNCString = JSON.stringify(this.queryInfo.valueNC)
      this.queryInfo.VNSString = JSON.stringify(this.queryInfo.valueNS)
      this.queryInfo.VNTString = JSON.stringify(this.queryInfo.valueNT)
      const { data: res } = await this.$http.get('search/queryFrame', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.Framelist = res.data.Frames
      this.total = res.data.totalpage
      console.log(res)
      console.log(this.queryInfo.valueD)
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
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    async addFrame() {
      this.addForm.datasetid = parseInt(this.$route.query.id)
      this.addForm.create_person = window.sessionStorage.getItem('name')
      this.addForm.classcification = JSON.stringify(this.addForm.valueC)
      this.addForm.scene = JSON.stringify(this.addForm.valueS)
      this.addForm.tag = JSON.stringify(this.addForm.valueT)
      const { data: res } = await this.$http.get('audit/addFrameAudit', { params: this.addForm })
      if (res.meta.status !== '201') {
        this.$message.error('添加数据集失败')
      }
      this.$message.success('已经送去审核啦！')
      this.addDialogVisible = false
      this.getFrameList()
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
      const { data: res } = await this.$http.get('frame/getFrameById', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('查询帧信息失败')
      }
      this.editForm = res.data
      console.log(res.data)
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    async editAuditInfo() {
      console.log(this.editForm.toString())
      const { data: res } = await this.$http.post('frame/editFrameInfo', this.editForm)
      if (res.meta.status !== '200') {
        return this.$message.error('修改帧信息失败')
      }
      this.$message.success('修改帧已送审核')
      this.editDialogVisible = false
      await this.getFrameList()
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
    },
    // 根据id删除对应的帧信息
    async removeFrameById(id) {
      const tokenStr = window.sessionStorage.getItem('token')
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该帧, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { return err })
      // 确认的话返回confirm，取消的话返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      console.log('确认删除')
      const { data: res } = await this.$http.get('frame/removeFrame', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('删除帧信息失败')
      }
      this.$message.success('删除帧成功')
      await this.getFrameList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
