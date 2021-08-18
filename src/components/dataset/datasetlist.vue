<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据集管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据集列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="根据数据集名查找" class="input-with-select" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getDatasetList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-select v-model="queryInfo.valueS" @focus="getScene" @change="sendScene(queryInfo.valueS)" multiple filterable remote style="margin-left: -400px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryInfo.valueC"  @focus="getClasscification" @change="sendClasscification(queryInfo.valueC)" multiple filterable remote style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="margin-left: -1100px;" @click="getDatasetList">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="margin-left: -100px;" @click="addDialogVisible = true">添加数据集</el-button>
        </el-col>
      </el-row>
      <!--用户列表区 -->
      <el-table :data="datasetslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="数据集名" prop="name"></el-table-column>
        <el-table-column label="大小" prop="frames"></el-table-column>
        <el-table-column label="描述" prop="remarks"></el-table-column>
        <el-table-column label="包含分类" prop="classContent"></el-table-column>
        <el-table-column label="包含场景" prop="sceneContent"></el-table-column>
        <el-table-column label="上传人" prop="recorder"></el-table-column>
        <el-table-column label="上传时间" prop="record_time"></el-table-column>
        <el-table-column label="地点" prop="record_place"></el-table-column>
        <el-table-column label="创建人" prop="create_person"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="修改人" prop="update_person"></el-table-column>
        <el-table-column label="修改时间" prop="update_time"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="目的" prop="purpose"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-left: 10px;" @click="showEditDialog(scope.row.id)"></el-button>
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
      title="添加数据集"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <!--内容主体-->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="数据集名" prop="dataset_name">
          <el-input v-model="addForm.dataset_name"></el-input>
        </el-form-item>
        <el-form-item label="大小" prop="frames">
          <el-input v-model="addForm.size"></el-input>
        </el-form-item>
        <el-form-item label="目的" prop="purpose">
          <el-input v-model="addForm.purpose"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remarks">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="录制人" prop="recorder">
          <el-input v-model="addForm.recorder"></el-input>
        </el-form-item>
        <el-form-item label="录制时间" prop="record_time">
          <el-input v-model="addForm.record_time"></el-input>
        </el-form-item>
        <el-form-item label="录制地点" prop="record_place">
          <el-input v-model="addForm.record_place"></el-input>
        </el-form-item>
<!--        <el-form-item label="创建人" prop="create_person">
          <el-input v-model="addForm.create_person" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="addForm.create_time" ></el-input>
        </el-form-item>
        <el-form-item label="修改人" prop="update_person">
          <el-input v-model="addForm.update_person"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="update_time">
          <el-input v-model="addForm.update_time"></el-input>
        </el-form-item>-->
        <el-form-item label="路径" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDataset">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改数据集"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <!--内容主体-->
      <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="数据集名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="大小" prop="frames">
          <el-input v-model="editForm.frames"></el-input>
        </el-form-item>
        <el-form-item label="目的" prop="purpose">
          <el-input v-model="editForm.purpose"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remarks">
          <el-input v-model="editForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="录制人" prop="recorder">
          <el-input v-model="editForm.recorder"></el-input>
        </el-form-item>
        <el-form-item label="录制时间" prop="record_time">
          <el-input v-model="editForm.record_time"></el-input>
        </el-form-item>
        <el-form-item label="录制地点" prop="record_place">
          <el-input v-model="editForm.record_place"></el-input>
        </el-form-item>
        <!--        <el-form-item label="创建人" prop="create_person">
                  <el-input v-model="addForm.create_person" disabled></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                  <el-input v-model="addForm.create_time" ></el-input>
                </el-form-item>
                <el-form-item label="修改人" prop="update_person">
                  <el-input v-model="addForm.update_person"></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="update_time">
                  <el-input v-model="addForm.update_time"></el-input>
                </el-form-item>-->
        <el-form-item label="路径" prop="path">
          <el-input v-model="editForm.path"></el-input>
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
      optionsS: [],
      optionsC: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 5,
        valueS: [],
        valueC: [],
        VSString: '',
        VCString: ''
      },
      datasetslist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        dataset_name: '',
        size: '',
        remark: '',
        recorder: '',
        record_time: '',
        record_place: '',
        create_person: '',
        create_time: '',
        update_person: '',
        update_time: '',
        path: '',
        purpose: ''
      },
      editForm: {
        dataset_name: '',
        size: '',
        remark: '',
        name: '',
        frames: '',
        remarks: '',
        recorder: '',
        record_time: '',
        record_place: '',
        create_person: '',
        create_time: '',
        update_person: '',
        update_time: '',
        path: '',
        purpose: '',
        modifier: ''
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
    this.getDatasetList()
  },
  methods: {
    shwoDetail(id) {
      this.$router.push({ path: '/datasetinfo', query: { id } || this.redirect })
    },
    async getDatasetList() {
      this.queryInfo.VCString = JSON.stringify(this.queryInfo.valueC)
      this.queryInfo.VSString = JSON.stringify(this.queryInfo.valueS)
      this.queryInfo.VDString = JSON.stringify(this.queryInfo.valueD)
      const { data: res } = await this.$http.get('datasets/queryDatasetsVague', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.datasetslist = res.data.datasets
      for (let i = 0; i < this.datasetslist.length; i++) {
        if (this.datasetslist[i].sceneContent == null) {
          this.datasetslist[i].sceneContent = '暂无数据'
        }
        if (this.datasetslist[i].classContent == null) {
          this.datasetslist[i].classContent = '暂无数据'
        }
      }
      this.total = res.data.totalpage
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getDatasetList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getDatasetList()
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addDataset() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.create_person = window.sessionStorage.getItem('name')
        const { data: res } = await this.$http.post('audit/addDatasetAudit', this.addForm)
        if (res.meta.status !== '201') {
          this.$message.error('添加数据集失败')
        }
        this.$message.success('已经送去审核啦！')
        this.addDialogVisible = false
        this.getDatasetList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id, status) {
      const tokenStr = window.sessionStorage.getItem('token')
      console.log(tokenStr)
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      const { data: res } = await this.$http.get('datasets/getDatasetById', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      this.editForm = res.data
      console.log(res.data)
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    async editAuditInfo() {
      console.log(this.editForm.toString())
      this.editForm.dataset_name = this.editForm.name
      this.editForm.size = this.editForm.frames
      this.editForm.remark = this.editForm.remarks
      this.editForm.modifier = window.sessionStorage.getItem('name')
      const { data: res } = await this.$http.post('audit/editDatasetAudit', this.editForm)
      if (res.meta.status !== '201') {
        return this.$message.error('修改审核信息失败')
      }
      this.$message.success('修改请求已送审核')
      this.addDialogVisible = false
      await this.getDatasetList()
    },
    async getScene () {
      const { data: res } = await this.$http.get('categorise/queryScene')
      if (res.meta.status === '200') {
        this.optionsS = res.data.scene // 把获取到的数据赋给this.data
      }
    },
    sendScene () {
      console.log(this.valueS)
    },
    async getClasscification () {
      const { data: res } = await this.$http.get('categorise/queryClasscification')
      if (res.meta.status === '200') {
        this.optionsC = res.data.Classcification // 把获取到的数据赋给this.data
      }
    },
    sendClasscification () {
      console.log(this.valueC)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
