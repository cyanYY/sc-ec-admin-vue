<template>
  <div class="app-container role">
    <div class="role-query">
      <el-form size="small" :inline="true">
        <el-form-item>
          <el-button size="small" type="primary" @click="doAdd">添加角色</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table style="width: 100%;font-size: 13px;" :data="tableData" border size="mini" center>
      <el-table-column prop="id" label="角色ID" align="center" />
      <el-table-column prop="name" label="角色名" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="doEdit(scope.row)">修改</el-button>
          <el-button size="small" type="danger" @click="doDelete(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialogAdd" :before-close="closeAdd" title="添加角色" width="500px">
      <el-form ref="addForm" :model="itemAdd" :rules="rules" label-width="90px">
        <el-form-item label="角色名：" prop="name">
          <el-input v-model.trim="itemAdd.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model.trim="itemAdd.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-tree
            ref="treeAdd"
            :data="treeData"
            :props="treeProps"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEdit" :before-close="closeEdit" title="修改角色" width="500px">
      <el-form ref="editForm" :model="itemEdit" :rules="rules" label-width="90px">
        <el-form-item label="角色名：" prop="name">
          <el-input v-model.trim="itemEdit.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model.trim="itemEdit.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-tree
            ref="treeEdit"
            :data="treeData"
            :props="treeProps"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
          />
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
import { roleListPage, roleAdd, roleUpdate, roleDelete } from '@/api/role.js'
import { resourceTreeAll, resourceListByRoleId } from '@/api/resource.js'

export default {
  name: 'RoleVue',
  data() {
    return {
      tableData: [],
      totalNum: 0,
      page: {
        pageNum: 1,
        numPerPage: 10
      },
      dialogAdd: false,
      itemAdd: {},
      dialogEdit: false,
      itemEdit: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      },
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getTreeData()
    this.getData()
  },
  methods: {
    getTreeData() {
      resourceTreeAll().then(res => {
        this.treeData = res.data
      })
    },
    getData() {
      roleListPage(this.page).then(res => {
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
    doAdd() {
      this.itemAdd = { resourceIds: [] }
      this.dialogAdd = true
    },
    closeAdd(done) {
      this.$refs.addForm.clearValidate()
      this.$refs.treeAdd.setCheckedKeys([])
      if (done) done()
    },
    cancelAdd() {
      this.$refs.addForm.clearValidate()
      this.$refs.treeAdd.setCheckedKeys([])
      this.dialogAdd = false
    },
    confirmAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.itemAdd.resourceIds = this.$refs.treeAdd
            .getCheckedKeys()
            .concat(this.$refs.treeAdd.getHalfCheckedKeys())
          roleAdd(this.itemAdd).then(res => {
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
    doEdit(row) {
      this.itemEdit.id = row.id
      this.itemEdit.name = row.name
      this.itemEdit.description = row.description

      this.dialogEdit = true
      resourceListByRoleId({ roleId: row.id }).then(res => {
        this.$nextTick(() => {
          this.$refs.treeEdit.setCheckedKeys(
            (res.data || [])
              .map(item => item.id)
              .filter(key => this.$refs.treeEdit.getNode(key).isLeaf)
          )
        })
      })
    },
    closeEdit(done) {
      this.$refs.editForm.clearValidate()
      this.$refs.treeEdit.setCheckedKeys([])
      if (done) done()
    },
    cancelEdit() {
      this.$refs.editForm.clearValidate()
      this.$refs.treeEdit.setCheckedKeys([])
      this.dialogEdit = false
    },
    confirmEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.itemEdit.resourceIds = this.$refs.treeEdit
            .getCheckedKeys()
            .concat(this.$refs.treeEdit.getHalfCheckedKeys())
          roleUpdate(this.itemEdit).then(res => {
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
    doDelete(row) {
      this.$confirm(
        '确定删除角色 < ' + row.name + ' - ' + row.description + ' > 及关联的所有权限？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        roleDelete(row).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getData()
        })
      })
    }
  }
}
</script>
