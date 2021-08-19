<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据集管理</el-breadcrumb-item>
      <el-breadcrumb-item>帧详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20" style="margin-left: 100px">
        <el-col :span="2">
          <el-button type="primary" style="margin-left: -180px;" @click="addDialogVisible = true">添加标签</el-button>
        </el-col>
      </el-row>
      <!--用户列表区 -->
      <el-table :data="Labellist" border stripe style="margin-top: 50px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="帧号" prop="frame_id"></el-table-column>
        <el-table-column label="左侧x坐标" prop="left_point_x"></el-table-column>
        <el-table-column label="左侧y坐标" prop="left_point_y"></el-table-column>
        <el-table-column label="右侧x坐标" prop="right_point_x"></el-table-column>
        <el-table-column label="右侧y坐标" prop="right_point_y"></el-table-column>
        <el-table-column label="中心点x坐标" prop="centre_point_x"></el-table-column>
        <el-table-column label="中心点y坐标" prop="centre_point_y"></el-table-column>
        <el-table-column label="宽" prop="width"></el-table-column>
        <el-table-column label="高" prop="height"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="分类名" prop="class_name"></el-table-column>
        <el-table-column label="场景名" prop="scene_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
      title="添加帧"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <!--内容主体-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="分类" prop="valueC">
          <el-select v-model="addForm.valueC" collapse-tags @focus="getClasscification" @change="sendClasscification(addForm.valueC)" filterable remote style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景" prop="valueS">
          <el-select v-model="addForm.valueS" collapse-tags @focus="getScene" @change="sendScene(addForm.valueS)" filterable remote style="margin-left: -900px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="标签" prop="valueT">
          <el-select v-model="addForm.valueT" collapse-tags @focus="getTag" @change="sendTag(addForm.valueT)" filterable remote style="margin-left: -900px;" placeholder="请选择标签">
            <el-option
              v-for="item in optionsT"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="左侧x" prop="left_point_x">
          <el-input v-model="addForm.left_point_x"></el-input>
        </el-form-item>
        <el-form-item label="左侧y" prop="left_point_y">
          <el-input v-model="addForm.left_point_y"></el-input>
        </el-form-item>
        <el-form-item label="右侧x" prop="right_point_x">
          <el-input v-model="addForm.right_point_x"></el-input>
        </el-form-item>
        <el-form-item label="右侧y" prop="right_point_y">
          <el-input v-model="addForm.right_point_y"></el-input>
        </el-form-item>
        <el-form-item label="中心点x" prop="centre_point_x">
          <el-input v-model="addForm.centre_point_x"></el-input>
        </el-form-item>
        <el-form-item label="中心点y" prop="centre_point_y">
          <el-input v-model="addForm.centre_point_y"></el-input>
        </el-form-item>
        <el-form-item label="宽" prop="width">
          <el-input v-model="addForm.width"></el-input>
        </el-form-item>
        <el-form-item label="高" prop="height">
          <el-input v-model="addForm.height"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addForm.path"></el-input>
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
    <el-button type="primary" @click="addFrame">确 定</el-button>
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
        valueF: [],
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
      Labellist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        frame_id: '',
        classification_id: '',
        scene_id: '',
        path: '',
        valueS: '',
        valueC: '',
        left_point_x: '',
        left_point_y: '',
        right_point_x: '',
        right_point_y: '',
        centre_point_x: '',
        centre_point_y: '',
        width: '',
        height: ''
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
    this.queryInfo.valueF = parseInt(this.$route.query.id)
    console.log(this.queryInfo.valueF)
    this.getLabellist()
  },
  methods: {
    shwoDetail() {
    },
    async getLabellist() {
      this.queryInfo.VFString = JSON.stringify(this.queryInfo.valueF)
      const { data: res } = await this.$http.get('search/queryLabel', { params: this.queryInfo })
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.Labellist = res.data.Labels
      this.total = res.data.totalpage
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getLabellist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getLabellist()
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    async addFrame() {
      this.addForm.frame_id = parseInt(this.$route.query.id)
      this.addForm.classification_id = JSON.stringify(this.addForm.valueC)
      this.addForm.scene_id = JSON.stringify(this.addForm.valueS)
      console.log(this.addForm)
      const { data: res } = await this.$http.post('audit/addLabelAudit', this.addForm)
      if (res.meta.status !== '201') {
        this.$message.error('添加标签失败')
      }
      this.$message.success('已经送去啦！')
      this.addDialogVisible = false
      this.getLabellist()
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
