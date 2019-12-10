<template>
  <div class="app-container user">
    <div class="user-query">
      <el-form
        size="small"
        ref="formQuery"
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item label="">
          <el-input v-model.trim="queryForm.account" placeholder="登录账号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getData">查询</el-button>
          <el-button size="small" type="primary" @click="doAdd">添加账号</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table style="width: 100%;font-size: 13px;" :data="tableData" border size="mini" center>
      <el-table-column prop="account" label="登录账号" align="center" />
      <el-table-column prop="name" label="昵称" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column :formatter="rolesFmt" prop="roles" align="center" label="角色" />
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="doDetail(scope.row)">详情</el-button>
          <el-button type="warning" size="mini" @click="doEdit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 50, 100]"
      :total="totalNum"
      class="page"
      layout="total,sizes,prev,pager,next,jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogAdd" :before-close="closeAdd" title="添加账号" width="500px">
      <el-form ref="addForm" :model="itemAdd" :rules="rulesAdd" label-width="100px">
        <el-form-item label="登录账号：" prop="account">
          <el-input v-model.trim="itemAdd.account" placeholder="请输入登录账号(只支持英文)" />
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model.trim="itemAdd.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPassword">
          <el-input
            v-model.trim="itemAdd.checkPassword"
            type="password"
            placeholder="请输入确认密码"
          />
        </el-form-item>
        <el-form-item label="昵称：" prop="name">
          <el-input v-model.trim="itemAdd.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model.trim="itemAdd.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model.trim="itemAdd.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="选择角色：" prop="roles">
          <el-select v-model="itemAdd.roleIds" multiple placeholder="">
            <el-option
              v-for="item in tableDataRole"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商：">
          <el-select v-model="itemAdd.agentId" placeholder="" @change="listMerchants">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户：">
          <el-select v-model="itemAdd.merchantIds" multiple placeholder="">
            <el-option
              v-for="item in dropMerchants"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetail" title="账号详情" width="500px">
      <el-form ref="detailForm" :model="itemDetail" label-width="90px">
        <el-form-item label="登录账号：">{{ itemDetail.account }}</el-form-item>
        <el-form-item label="昵称：">{{ itemDetail.name }}</el-form-item>
        <el-form-item label="邮箱：">{{ itemDetail.email }}</el-form-item>
        <el-form-item label="手机号：">{{ itemDetail.phone }}</el-form-item>
        <el-form-item label="角色：">{{ rolesFmt(null, null, itemDetail.roles) }}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetail = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEdit" :before-close="closeEdit" title="修改账号" width="500px">
      <el-form ref="editForm" :model="itemEdit" :rules="rulesEdit" label-width="100px">
        <el-form-item label="登录账号：" prop="account">
          <el-input v-model.trim="itemEdit.account" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="昵称：" prop="name">
          <el-input v-model.trim="itemEdit.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model.trim="itemEdit.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model.trim="itemEdit.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="选择角色：" prop="roles">
          <el-select v-model="itemEdit.roleIds" multiple placeholder="">
            <el-option
              v-for="item in tableDataRole"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商：">
          <el-select v-model="itemEdit.agentId" placeholder="" @change="listMerchants">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户：">
          <el-select v-model="itemEdit.merchantIds" multiple placeholder="">
            <el-option
              v-for="item in dropMerchants"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAdd, userListPage, userUpdate, listAgents, listMerchants } from '@/api/user.js'
import { roleListAll } from '@/api/role.js'

export default {
  name: 'UserVue',
  data() {
    const validateCheckPassword = (rule, v, cb) => {
      if (this.itemAdd.password !== v) {
        cb(new Error('两次输入的密码不一致'))
      } else {
        this.$refs.addForm.clearValidate(['checkPassword'])
        cb()
      }
    }
    const validateRoleAdd = (rule, v, cb) => {
      if (this.itemAdd.roleIds.length === 0) {
        cb(new Error('请选择角色'))
      } else {
        this.$refs.addForm.clearValidate(['roles'])
        cb()
      }
    }
    const validateRoleEdit = (rule, v, cb) => {
      if (this.itemEdit.roleIds.length === 0) {
        cb(new Error('请选择角色'))
      } else {
        this.$refs.editForm.clearValidate(['roles'])
        cb()
      }
    }
    return {
      queryForm: {
        account: ''
      },
      tableData: [],
      totalNum: 0,
      page: {
        pageNum: 1,
        numPerPage: 10
      },
      tableDataRole: [],
      roleSelection: [],
      dialogAdd: false,
      itemAdd: {},
      dialogDetail: false,
      itemDetail: {},
      dialogEdit: false,
      itemEdit: {
        account: '',
        name: '',
        email: '',
        phone: '',
        roleIds: [],
        agentId: '',
        merchantIds: []
      },
      rulesAdd: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '登录账号只支持英文和数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6位', trigger: ['blur', 'change'] }
        ],
        checkPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6位', trigger: ['blur', 'change'] },
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        roles: [{ validator: validateRoleAdd, trigger: 'blur' }]
      },
      rulesEdit: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        roles: [{ validator: validateRoleEdit, trigger: 'blur' }]
      },
      dropAgents: [],
      dropMerchants: []
    }
  },
  created() {
    this.initData()
    this.getData()
    this.listAgents()
  },
  methods: {
    initData() {
      roleListAll().then(res => {
        this.tableDataRole = res.data
      })
    },
    getData() {
      userListPage({ ...this.page, ...{ account: this.queryForm.account } }).then(res => {
        this.tableData = res.data.recordList
        this.totalNum = res.data.totalCount
      })
    },
    handleSizeChange(val) {
      this.page.numPerPage = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getData()
    },
    handleSelectionChange(val) {
      this.roleSelection = val
    },
    doAdd() {
      this.itemAdd = {}
      this.dialogAdd = true
    },
    closeAdd(done) {
      this.$refs.addForm.clearValidate()
      if (done) done()
    },
    cancelAdd() {
      this.$refs.addForm.clearValidate()
      this.dialogAdd = false
    },
    confirmAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          userAdd(this.itemAdd).then(res => {
            this.cancelAdd()
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getData()
          })
        }
      })
    },
    doDetail(row) {
      this.itemDetail = { ...row }
      this.dialogDetail = true
    },
    doEdit(row) {
      this.listMerchants(row.agentId)

      this.itemEdit.id = row.id
      this.itemEdit.account = row.account
      this.itemEdit.name = row.name
      this.itemEdit.email = row.email
      this.itemEdit.phone = row.phone
      this.itemEdit.roleIds = row.roles.map(role => role.id)
      this.itemEdit.agentId = row.agentId
      this.itemEdit.merchantIds = row.merchantIds
      this.dialogEdit = true
    },
    closeEdit(done) {
      this.$refs.editForm.clearValidate()
      if (done) done()
    },
    cancelEdit() {
      this.$refs.editForm.clearValidate()
      this.dialogEdit = false
    },
    confirmEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          userUpdate(this.itemEdit).then(res => {
            this.cancelEdit()
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getData()
          })
        }
      })
    },
    rolesFmt(row, column, value = []) {
      value = value || []
      return value.map(item => item.description).join('，')
    },
    listAgents() {
      listAgents().then(res => {
        this.dropAgents = res.data
      })
    },
    listMerchants(value) {
      const param = {
        agentId: value
      }
      listMerchants(param).then(res => {
        this.dropMerchants = res.data
      })
    }
  }
}
</script>
