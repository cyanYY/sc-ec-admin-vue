<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="queryForm.stockDate"
            placeholder="日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
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
        <el-table-column prop="stockDate" label="日期" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"> </el-table-column>
        <el-table-column prop="remaindNum" label="前日剩余" align="center"> </el-table-column>
        <el-table-column prop="incrNum" label="今日新增" align="center"> </el-table-column>
        <el-table-column prop="deliverNum" label="本地发货" align="center"> </el-table-column>
        <el-table-column prop="stockNum" label="库存" align="center"> </el-table-column>
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

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="updateFormVisible"
    >
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="前日剩余">
          <el-input v-model="updateForm.remaindNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="今日新增">
          <el-input v-model="updateForm.incrNum" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="本地发货">
          <el-input v-model="updateForm.deliverNum" placeholder=""></el-input>
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
import { listPage, updateStock } from '@/api/stock.js'
import { parseTime } from '@/utils'

export default {
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    const stockDate = parseTime(date, '{y}-{m}-{d}')

    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        stockDate: stockDate
      },
      updateForm: {
        id: '',
        remaindNum: '',
        incrNum: '',
        deliverNum: ''
      },
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
        goodsName: this.queryForm.goodsName,
        stockDate: this.queryForm.stockDate
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 分页查询结束 */

    /** 修改开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.id = row.id
      this.updateForm.remaindNum = row.remaindNum
      this.updateForm.incrNum = row.incrNum
      this.updateForm.deliverNum = row.deliverNum
    },
    updateHandle() {
      const param = {
        id: this.updateForm.id,
        remaindNum: this.updateForm.remaindNum,
        incrNum: this.updateForm.incrNum,
        deliverNum: this.updateForm.deliverNum
      }
      updateStock(param).then(res => {
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
