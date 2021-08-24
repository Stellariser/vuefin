<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">数据管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>标签审核管理</el-breadcrumb-item>
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
      <el-table :data="FrameAuditlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="操作" prop="type"></el-table-column>
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
        <el-table-column label="分类名" prop="classname"></el-table-column>
        <el-table-column label="场景名" prop="scenename"></el-table-column>
        <el-table-column label="审核人" prop="auditor"></el-table-column>
        <el-table-column label="审核时间" prop="audit_time"></el-table-column>
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
        <el-form-item label="分类" prop="valueC">
          <el-select v-model="editForm.valueC" collapse-tags @focus="getClasscification" @change="classChange" filterable remote style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in optionsC"
              :key="item.id"
              :label="item.class_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景" prop="valueS">
          <el-select v-model="editForm.valueS" collapse-tags @focus="getScene" @change="sceneChange" filterable remote style="margin-left: -900px;" placeholder="请选择场景">
            <el-option
              v-for="item in optionsS"
              :key="item.id"
              :label="item.scene_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="左侧x" prop="left_point_x">
          <el-input v-model="editForm.left_point_x"></el-input>
        </el-form-item>
        <el-form-item label="左侧y" prop="left_point_y">
          <el-input v-model="editForm.left_point_y"></el-input>
        </el-form-item>
        <el-form-item label="右侧x" prop="right_point_x">
          <el-input v-model="editForm.right_point_x"></el-input>
        </el-form-item>
        <el-form-item label="右侧y" prop="right_point_y">
          <el-input v-model="editForm.right_point_y"></el-input>
        </el-form-item>
        <el-form-item label="中心点x" prop="centre_point_x">
          <el-input v-model="editForm.centre_point_x"></el-input>
        </el-form-item>
        <el-form-item label="中心点y" prop="centre_point_y">
          <el-input v-model="editForm.centre_point_y"></el-input>
        </el-form-item>
        <el-form-item label="宽" prop="width">
          <el-input v-model="editForm.width"></el-input>
        </el-form-item>
        <el-form-item label="高" prop="height">
          <el-input v-model="editForm.height"></el-input>
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
        classification_id: '',
        scene_id: '',
        frame_id: '',
        create_person: '',
        create_time: '',
        path: '',
        target_id: '',
        status: '',
        type: '',
        valueS: '',
        valueC: '',
        valueD: '',
        scenelist: '',
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
      denyForm: {
        id: '',
        auditor: '',
        audit_time: '',
        status: ''
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
      const { data: res } = await this.$http.get('label/queryLabelAuditVague', { params: this.queryInfo })
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
      const { data: res } = await this.$http.get('label/getLabelAuditById', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async editAuditInfo() {
      const { data: res } = await this.$http.post('label/editLabelAudit', this.editForm)
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
      const { data: res } = await this.$http.get('label/getLabelAuditById', { params: { id } })
      if (res.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      const tokenStr = window.sessionStorage.getItem('name')
      this.approveForm = res.data
      this.approveForm.auditor = tokenStr
      console.log(this.approveForm)
      const { data: resa } = await this.$http.post('label/approveLabel', this.approveForm)
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
      const name = window.sessionStorage.getItem('name')
      const { data: res2 } = await this.$http.get('label/denyLabel', { params: { id, name } })
      if (res2.meta.status !== '200') {
        return this.$message.error('查询审核条目信息失败')
      }
      const tokenStr1 = window.sessionStorage.getItem('name')
      this.approveForm = res2.data
      this.approveForm.auditor = tokenStr1
      const { data: res } = await this.$http.post('audit/denyLabel', this.approveForm)
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
    classChange () {
      this.editForm.classification_id = JSON.stringify(this.editForm.valueC)
    },
    sceneChange () {
      this.editForm.scene_id = JSON.stringify(this.editForm.valueS)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
