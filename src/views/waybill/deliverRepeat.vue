<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="queryForm.orderDate"
            placeholder="下单时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
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
        row-key="wayBillNo"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="tableRowClassName"
      >
        >
        <el-table-column prop="orderDate" width="130" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="wayBillNo" label="运单号" align="center"> </el-table-column>
        <el-table-column
          prop="isExceed"
          label="历史超区"
          align="center"
          :formatter="isExceedFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="expressType"
          label="快递类型"
          align="center"
          :formatter="expressTypeFormatter"
        >
        </el-table-column>
        <el-table-column prop="orderNo" width="100" label="订单号" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="packageNum" label="数量" align="center"> </el-table-column>
        <el-table-column prop="option" width="100" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteRepeat(scope.row)" type="text" size="small">删除</el-button>
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
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPageDeliverRepeat, listRepeat, deleteRepeat } from '@/api/waybill.js'
import { parseTime } from '@/utils'

export default {
  name: 'Waybill',
  components: {
    Pagination
  },
  data() {
    const currentDate = parseTime(new Date(), '{y}-{m}-{d}')
    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderDate: currentDate
      }
    }
  },
  methods: {
    queryHandle(page) {
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
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        orderDate: this.queryForm.orderDate
      }
      listPageDeliverRepeat(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    load(row, treeNode, resolve) {
      const params = {
        orderDate: row.orderDate,
        goodsName: row.goodsName,
        receiverMobile: row.receiverMobile
      }
      listRepeat(params).then(res => resolve(res.data))
    },
    tableRowClassName(row) {
      return row.row.children ? '' : 'warning-row'
    },
    expressTypeFormatter(row) {
      switch (row.expressType) {
        case '1':
          return '京东快递'
        case '2':
          return '德邦快递'
        default:
          return row.expressType
      }
    },
    isExceedFormatter(row) {
      switch (row.isExceed) {
        case true:
          return '是'
        case false:
          return '否'
        default:
          return row.isExceed
      }
    },
    deleteRepeat(row) {
      this.$confirm('确认删除订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = {
          wayBillNo: row.wayBillNo
        }
        deleteRepeat(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryHandle()
        })
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

<style>
.el-table .warning-row {
  background: oldlace;
}
</style>
