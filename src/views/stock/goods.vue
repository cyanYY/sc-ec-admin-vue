<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.goodsNo" placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="addBtnHandle">新增商品</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="waybill-tables">
      <el-table
        :data="tableDataSearch"
        border
        size="mini"
        center
        style="width: 100%;font-size: 13px;"
        highlight-current-row
      >
        <el-table-column prop="goodsNo" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="goodsShortName" label="商品简称" align="center"> </el-table-column>
        <el-table-column prop="goodsId" label="商品编号(鲁班)" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商户名称(鲁班)" align="center"> </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateBtnHandle(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>
    <div class="waybill-pages" v-if="total > 0">
      <Pagination
        :total="total"
        :perpages="perpageNumber"
        :currentPage="currentPage"
        @currentPage="getCurrentPage"
      ></Pagination>
    </div>

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="商品编号">
          <el-input v-model="addForm.goodsNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品简称">
          <el-input v-model="addForm.goodsShortName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品编号(鲁班)">
          <el-input v-model="addForm.goodsId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品名称(鲁班)">
          <el-input v-model="addForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="updateFormVisible"
    >
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="商品编号">
          <el-input v-model="updateForm.goodsNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品简称">
          <el-input v-model="updateForm.goodsShortName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品编号(鲁班)">
          <el-input v-model="updateForm.goodsId" placeholder="" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名称(鲁班)">
          <el-input v-model="updateForm.goodsName" placeholder="" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, update, add } from '@/api/goods.js'

export default {
  name: 'Waybill',
  components: {
    Pagination
  },
  data() {
    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {},
      addForm: {
        goodsNo: '',
        goodsShortName: '',
        goodsId: '',
        goodsName: ''
      },
      updateForm: {
        id: '',
        goodsNo: '',
        goodsShortName: '',
        goodsId: '',
        goodsName: ''
      },
      addFormVisible: false,
      updateFormVisible: false
    }
  },
  methods: {
    /** 分页查询开始 */
    queryBtnHandle(page) {
      if (page) {
        this.currentPage = page
      }
      this.getListByPage(this.perpageNumber, this.currentPage)
    },
    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.getListByPage(perPage, currPage)
    },
    // 异步获取数据
    getListByPage(numPerPage, pageNum) {
      const param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        goodsNo: this.queryForm.goodsNo,
        goodsName: this.queryForm.goodsName
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 分页查询结束 */

    /** 新增开始 */
    addBtnHandle() {
      this.addFormVisible = true

      this.addForm.goodsNo = ''
      this.addForm.goodsShortName = ''
      this.addForm.goodsId = ''
      this.addForm.goodsName = ''
    },
    addHandle() {
      const param = {
        goodsNo: this.addForm.goodsNo,
        goodsShortName: this.addForm.goodsShortName,
        goodsId: this.addForm.goodsId,
        goodsName: this.addForm.goodsName
      }
      add(param).then(res => {
        this.addFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 新增结束 */

    /** 修改开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.id = row.id
      this.updateForm.goodsNo = row.goodsNo
      this.updateForm.goodsShortName = row.goodsShortName
      this.updateForm.goodsId = row.goodsId
      this.updateForm.goodsName = row.goodsName
    },
    updateHandle() {
      const param = {
        id: this.updateForm.id,
        goodsNo: this.updateForm.goodsNo,
        goodsShortName: this.updateForm.goodsShortName,
        goodsId: this.updateForm.goodsId,
        goodsName: this.updateForm.goodsName
      }
      update(param).then(res => {
        this.updateFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    }
    /** 修改结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
