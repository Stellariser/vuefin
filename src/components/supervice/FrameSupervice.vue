<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>帧审核管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--用户列表区 -->
      <el-table :data="FrameAuditlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="操作类型" prop="type"></el-table-column>
        <el-table-column label="数据集编号" prop="dataset_id"></el-table-column>
        <el-table-column label="包含场景" prop="scenecontent"></el-table-column>
        <el-table-column label="包含分类" prop="classcontent"></el-table-column>
        <el-table-column label="包含标签" prop="tagcontent"></el-table-column>
        <el-table-column label="目标号" prop="target_id"></el-table-column>
        <el-table-column label="创建人" prop="create_person"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" sortable></el-table-column>
        <el-table-column label="审核人" prop="auditor"></el-table-column>
        <el-table-column label="审核时间" prop="audit_time"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-left: 10px;"  @click="showEditDialog(scope.row.id,scope.row.status)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="通过" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-check" size="mini" style="margin-left: 60px;" @click="Approve(scope.row.id,scope.row.status)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="驳回" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-close" size="mini" style="margin-bottom: 20px;" @click="Deny(scope.row.id,scope.row.status)"></el-button>
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
        <el-form-item label="数据集名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="大小" prop="frames">
          <el-input v-model="addForm.frames"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remarks">
          <el-input v-model="addForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="上传人" prop="recorder">
          <el-input v-model="addForm.recorder"></el-input>
        </el-form-item>
        <el-form-item label="上传时间" prop="record_time">
          <el-input v-model="addForm.record_time"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="record_place">
          <el-input v-model="addForm.record_place"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="目的" prop="purpose">
          <el-input v-model="addForm.purpose"></el-input>
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
      title="修改数据帧"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <!--内容主体-->
      <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="数据集号" prop="dataset_id">
          <el-select v-model="editForm.valueD" collapse-tags @focus="getDataset" @change="datasetChange" filterable remote style="margin-left: -900px;" placeholder="请选择数据集">
            <el-option
              v-for="item in optionsD"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="valueC">
          <el-select v-model="editForm.valueC" collapse-tags @focus="getClasscification" @change="classChange" multiple filterable remote style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景" prop="valueS">
          <el-select v-model="editForm.valueS" collapse-tags @focus="getScene" @change="sceneChange" multiple filterable remote style="margin-left: -900px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="valueT">
          <el-select v-model="editForm.valueT" collapse-tags @focus="getTag" @change="tagChange" multiple filterable remote style="margin-left: -900px;" placeholder="请选择标签">
            <el-option
              v-for="item in optionsT"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标号" prop="target_id">
          <el-input v-model="editForm.target_id"></el-input>
        </el-form-item>
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
      optionsD: [],
      optionsT: [],
      optionsNS: [],
      optionsNC: [],
      optionsNT: [],
      FrameAuditlist: [],
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
        target_id: '',
        valueS: '',
        valueC: '',
        valueT: ''
      },
      editForm: {
        id: '',
        tag: '',
        dataset_id: '',
        frame_id: '',
        create_person: '',
        create_time: '',
        path: '',
        target_id: '',
        status: '',
        type: '',
        valueS: '',
        valueC: '',
        valueT: '',
        valueD: '',
        scenelist: '',
        taglist: '',
        classlist: ''
      },
      approveForm: {
        id: '',
        tag: '',
        dataset_id: '',
        frame_id: '',
        create_person: '',
        create_time: '',
        update_person: '',
        update_time: '',
        path: '',
        target_id: '',
        status: '',
        type: '',
        valueS: '',
        valueC: '',
        valueT: '',
        valueD: '',
        scenelist: '',
        taglist: '',
        classlist: ''
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
    this.getFrameAuditlist()
  },
  methods: {
    async getFrameAuditlist() {
      const { data: res } = await this.$http.get('audit/queryFrameAuditVague', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.FrameAuditlist = res.data.audit
      this.total = res.data.totalpage
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getFrameAuditlist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getFrameAuditlist()
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addDataset() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.create_person = window.sessionStorage.getItem('name')
        const { data: res } = await this.$http.post('datasets/addDataset', this.addForm)
        if (res.meta.status !== '201') {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getFrameAuditlist()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id, status) {
      if (status === '已审核') { return this.$message.error('不可重复操作已审核项') }
      if (status === '已驳回') { return this.$message.error('不可重复操作已驳回项') }
      const tokenStr = window.sessionStorage.getItem('token')
      console.log(tokenStr)
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      const { data: res } = await this.$http.get('audit/getFrameAuditById', { params: { id } })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async editAuditInfo() {
      const { data: res } = await this.$http.post('audit/editFrameAudit', this.editForm)
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('修改审核信息失败')
      }
      this.$message.success('修改审核成功')
      this.editForm = res.data
      this.editDialogVisible = false
      await this.getFrameAuditlist()
    },
    // 通过申请
    async Approve(id, status) {
      if (status === '已审核') { return this.$message.error('不可重复操作已审核项') }
      if (status === '已驳回') { return this.$message.error('不可重复操作已驳回项') }
      const tokenStr1 = window.sessionStorage.getItem('token')
      if (tokenStr1 !== '0') {
        return this.$message.error('权限不够')
      }
      const { data: res } = await this.$http.get('audit/getFrameAuditById', { params: { id } })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      const tokenStr = window.sessionStorage.getItem('name')
      this.approveForm = res.data
      this.approveForm.auditor = tokenStr
      console.log(this.approveForm)
      const { data: resa } = await this.$http.post('audit/approveFrame', this.approveForm)
      console.log(resa)
      if (resa.meta.status !== '201') {
        this.$message.error('审核失败')
      }
      this.$message.success('审核通过')
      await this.getFrameAuditlist()
    },
    // 根据id删除对应的用户信息
    async Deny(id, status) {
      if (status === '已审核') { return this.$message.error('不可重复操作已审核项') }
      if (status === '已驳回') { return this.$message.error('不可重复操作已驳回项') }
      const tokenStr = window.sessionStorage.getItem('token')
      if (tokenStr !== '0') {
        return this.$message.error('权限不够')
      }
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('确认要驳回这条修改吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { return err })
      // 确认的话返回confirm，取消的话返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      console.log('确认驳回')
      const { data: res2 } = await this.$http.get('audit/getFrameAuditById', { params: { id } })
      console.log(res2)
      if (res2.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      const tokenStr1 = window.sessionStorage.getItem('name')
      this.approveForm = res2.data
      this.approveForm.auditor = tokenStr1
      const { data: res } = await this.$http.get('frame/denyframe', { params: { id, tokenStr1 } })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('驳回失败')
      }
      this.$message.success('驳回成功')
      await this.getFrameAuditlist()
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
    },
    async getTag () {
      const { data: res } = await this.$http.get('categorise/queryTag')
      if (res.meta.status === '200') {
        this.optionsT = res.data.Tag // 把获取到的数据赋给this.data
        this.optionsNT = res.data.Tag
      }
    },
    sendTag () {
      console.log(this.valueT)
    },
    async getDataset () {
      const { data: res } = await this.$http.get('categorise/queryDataset')
      if (res.meta.status === '200') {
        this.optionsD = res.data.dataset // 把获取到的数据赋给this.data
      }
    },
    sendDataset () {
      console.log(this.valueD)
    },
    datasetChange () {
      this.editForm.dataset_id = this.editForm.valueD
    },
    classChange () {
      this.editForm.classlist = JSON.stringify(this.editForm.valueC)
    },
    sceneChange () {
      this.editForm.scenelist = JSON.stringify(this.editForm.valueS)
    },
    tagChange () {
      this.editForm.taglist = JSON.stringify(this.editForm.valueT)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
