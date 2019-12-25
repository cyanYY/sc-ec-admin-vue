<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.orderTimeRange"
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
      >
        <el-table-column prop="date" label="日期" align="center"> </el-table-column>
        <el-table-column prop="incomeJd" label="京东代收货款" align="center"> </el-table-column>
        <el-table-column prop="incomeDb" label="德邦代收货款" align="center"> </el-table-column>
        <el-table-column prop="deliverCostJd" label="京东发货成本" align="center">
        </el-table-column>
        <el-table-column prop="deliverCostDb" label="德邦发货成本" align="center">
        </el-table-column>
        <el-table-column prop="laborCost" label="人力成本" align="center"> </el-table-column>
        <el-table-column prop="adCost" label="广告成本" align="center"> </el-table-column>
        <el-table-column prop="goodsDamageCost" label="货损成本" align="center"> </el-table-column>
        <el-table-column prop="profit" label="毛利" align="center"> </el-table-column>
        <el-table-column prop="option" width="80" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="editCost(scope.row)" type="text" size="small">修改</el-button>
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

    <el-dialog title="" :close-on-click-modal="false" :visible.sync="editCostVisible">
      <el-form :model="editCostForm" label-width="160px">
        <el-form-item label="日期">
          <el-input v-model="editCostForm.orderDate" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="广告成本">
          <el-input v-model="editCostForm.adCost" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="货损成本">
          <el-input v-model="editCostForm.goodsDamageCost" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="editCostCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, editCost } from '@/api/profit.js'
import { parseTime } from '@/utils'

export default {
  name: 'SuccReport',
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    const endDate = parseTime(date, '{y}-{m}-{d}')
    date.setDate(date.getDate() - 14)
    const startDate = parseTime(date, '{y}-{m}-{d}')

    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: [startDate, endDate]
      },
      editCostVisible: false,
      editCostForm: {
        orderDate: '',
        adCost: '',
        goodsDamageCost: ''
      }
    }
  },
  methods: {
    /** 分页查询订单开始 */
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
      let orderTimeStart = ''
      let orderTimeEnd = ''
      if (this.queryForm.orderTimeRange) {
        orderTimeStart = this.queryForm.orderTimeRange[0]
        orderTimeEnd = this.queryForm.orderTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    editCost(row) {
      this.editCostVisible = true
      this.editCostForm.orderDate = row.date
      this.editCostForm.adCost = row.adCost
      this.editCostForm.goodsDamageCost = row.goodsDamageCost
    },
    editCostCommit() {
      const param = {
        orderDate: this.editCostForm.orderDate,
        adCost: this.editCostForm.adCost,
        goodsDamageCost: this.editCostForm.goodsDamageCost
      }
      editCost(param).then(res => {
        this.editCostVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
