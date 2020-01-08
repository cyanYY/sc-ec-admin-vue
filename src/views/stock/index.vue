<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="queryForm.expressType" clearable placeholder="快递类型">
            <el-option label="京东快递" value="1"></el-option>
            <el-option label="德邦快递" value="2"></el-option>
            <el-option label="韵达快递" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.dateRange"
            size="small"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
        <el-table-column
          prop="expressType"
          label="快递类型"
          align="center"
          :formatter="expressTypeFormatter"
        >
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"> </el-table-column>
        <el-table-column prop="stockNum" label="库存" align="center"> </el-table-column>
        <el-table-column prop="deliverNum" label="发货数" align="center"> </el-table-column>
        <el-table-column prop="unDeliverNum" label="未发货数" align="center"> </el-table-column>
        <el-table-column prop="backNum" label="退回数" align="center"> </el-table-column>
        <el-table-column prop="remaindNum" label="剩余数" align="center"> </el-table-column>
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
        <el-form-item label="库存数">
          <el-input v-model="updateForm.stockNum" placeholder=""></el-input>
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

export default {
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
      updateForm: {
        id: '',
        stockNum: ''
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
      let startDate = ''
      let endDate = ''
      if (this.queryForm.dateRange) {
        startDate = this.queryForm.dateRange[0]
        endDate = this.queryForm.dateRange[1]
      }
      const param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        expressType: this.queryForm.expressType,
        goodsName: this.queryForm.goodsName,
        orderTimeStart: startDate,
        orderTimeEnd: endDate
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    expressTypeFormatter(row) {
      switch (row.expressType) {
        case '1':
          return '京东快递'
        case '2':
          return '德邦快递'
        case '3':
          return '韵达快递'
        default:
          return row.expressType
      }
    },
    /** 分页查询结束 */

    /** 修改开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.id = row.id
      this.updateForm.stockNum = row.stockNum
    },
    updateHandle() {
      const param = {
        id: this.updateForm.id,
        stockNum: this.updateForm.stockNum
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
