<template>
  <div class="app-container resources">
    <el-table
      row-key="id"
      :data="tableData"
      default-expand-all
      border
      style="width: 100%;font-size: 13px;"
      size="mini"
      center
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="资源名称"> </el-table-column>
      <el-table-column
        prop="type"
        label="资源类型"
        :formatter="
          row => {
            switch (row.type) {
              case 1:
                return '菜单'
              case 2:
                return '按钮'
              default:
                return row.type
            }
          }
        "
      >
      </el-table-column>
      <el-table-column prop="url" label="URL"> </el-table-column>
      <el-table-column prop="key" label="权限"> </el-table-column>
      <el-table-column prop="operation" label="权限">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== 2"
            size="small"
            type="primary"
            class="fun-btn"
            @click="doAdd(scope.row)"
            >添加</el-button
          >
          <el-button
            v-if="scope.row.id !== 0"
            size="small"
            type="warning"
            class="fun-btn"
            @click="doEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.id !== 0"
            size="small"
            type="danger"
            class="fun-btn"
            @click="doDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogAdd" :before-close="closeAdd" title="添加" width="500px">
      <el-form ref="addForm" :model="itemAdd" :rules="rules" label-width="70px">
        <el-form-item label="名称：" prop="name">
          <el-input v-model.trim="itemAdd.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="itemAdd.type" placeholder="请选择类型" clearable>
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="URL：">
          <el-input v-model.trim="itemAdd.url" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="权限：" prop="key">
          <el-input v-model.trim="itemAdd.key" placeholder="请输入权限" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogEdit" :before-close="closeEdit" title="修改" width="500px">
      <el-form ref="editForm" :model="itemEdit" :rules="rules" label-width="70px">
        <el-form-item label="名称：" prop="name">
          <el-input v-model.trim="itemEdit.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="itemEdit.type" placeholder="请选择类型" clearable>
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="URL：">
          <el-input v-model.trim="itemEdit.url" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="权限：" prop="key">
          <el-input v-model.trim="itemEdit.key" placeholder="请输入权限" />
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
import { resourceTreeAll, resourceAdd, resourceUpdate, resourceDelete } from '@/api/resource.js'

export default {
  name: 'ResourceVue',
  data() {
    return {
      tableData: [],
      dialogAdd: false,
      itemAdd: {},
      dialogEdit: false,
      itemEdit: {},
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        key: [{ required: true, message: '请输入权限', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      resourceTreeAll().then(res => {
        this.tableData = [
          {
            id: 0,
            name: '根资源',
            timeLine: 50,
            children: res.data
          }
        ]
      })
    },
    doAdd(row) {
      this.itemAdd = { parentId: row.id }
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
          resourceAdd(this.itemAdd).then(res => {
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
      this.itemEdit = this.cleanRow({ ...row, ...{ type: row.type + '' } })
      this.dialogEdit = true
    },
    closeEdit() {
      this.$refs.editForm.clearValidate()
      this.dialogEdit = false
    },
    cancelEdit() {
      this.$refs.editForm.clearValidate()
      this.dialogEdit = false
    },
    confirmEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          resourceUpdate(this.itemEdit).then(res => {
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
      this.$confirm('确定删除资源 < ' + row.name + ' > 及所有子资源？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resourceDelete(this.cleanRow({ ...row })).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getData()
        })
      })
    },
    cleanRow(row) {
      for (const key in row) {
        if (key.startsWith('_')) delete row[key]
      }
      delete row['children']
      return row
    }
  }
}
</script>
