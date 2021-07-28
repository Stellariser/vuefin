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
          <el-select v-model="value1" multiple style="margin-left: -400px;" placeholder="请选择场景">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="value2" multiple style="margin-left: -900px;" placeholder="请选择分类">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" style="margin-left: 180px;" @click="addDialogVisible = true">添加数据集</el-button>
        </el-col>
      </el-row>
      <!--用户列表区 -->
      <el-table :data="datasetslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="数据集名" prop="name"></el-table-column>
        <el-table-column label="大小" prop="frames"></el-table-column>
        <el-table-column label="描述" prop="remarks"></el-table-column>
        <el-table-column label="上传人" prop="recorder"></el-table-column>
        <el-table-column label="上传时间" prop="record_time"></el-table-column>
        <el-table-column label="地点" prop="record_place"></el-table-column>
        <el-table-column label="创建人" prop="create_person"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="修改人" prop="update_person"></el-table-column>
        <el-table-column label="修改时间" prop="update_time"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="目的" prop="purpose"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            {{scope.nodes}}
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-left: 10px;" @click="showEditDialog"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 60px;"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" style="margin-bottom: 20px;"></el-button>
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
        <el-form-item label="创建人" prop="create_person">
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
      title="修改数据集"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <!--内容主体-->
      <el-form ref="editFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
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
        <el-form-item label="创建人" prop="create_person">
          <el-input v-model="addForm.create_person"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="addForm.create_time"></el-input>
        </el-form-item>
        <el-form-item label="修改人" prop="update_person">
          <el-input v-model="addForm.update_person"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="update_time">
          <el-input v-model="addForm.update_time"></el-input>
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
      options1: [],
      value1: [],
      value2: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 5
      },
      datasetslist: [],
      totalpage: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
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
        purpose: ''
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
    this.getTime()
  },
  methods: {
    async getDatasetList() {
      const { data: res } = await this.$http.get('datasets/queryDatasetsVague', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== '200') {
        return this.$message.error('数据获取失败')
      }
      this.datasetslist = res.data.datasets
      this.totalpage = res.data.totalpage
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
    // 监听switch状态的改变
    async userStateChange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== '200') {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addDataset() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.create_person = window.sessionStorage.getItem('token')
        const { data: res } = await this.$http.post('datasets/addDataset', this.addForm)
        if (res.meta.status !== '201') {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getDatasetList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog() {
      this.editDialogVisible = true
    },
    async getScene () {
      const { data: res } = await this.$http.get('categorise/queryScene')
      if (res.meta.status === '200') {
        this.options1 = res.data.scene // 把获取到的数据赋给this.data
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
