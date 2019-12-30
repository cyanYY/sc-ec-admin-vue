<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.goodsName"
            placeholder="商品名称"
            :editable="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.receiverMobile"
            placeholder="收件人手机号"
            :editable="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.orderTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="订单开始日期"
            end-placeholder="订单结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.merchantId" placeholder="商户">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.orderStatus" placeholder="订单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="batchConfirmHandle">订单确认</el-button>
          <el-button size="small" type="primary" @click="batchCancelHandle">订单取消</el-button>
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
        @selection-change="handleSelectionChange"
        row-key="orderNo"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="orderTime" label="订单提交时间" width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderTime && scope.row.orderTime.substring(0, 19) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="150" align="center">
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"> </el-table-column>
        <el-table-column
          :formatter="repeatTypeFmt"
          prop="repeatType"
          label="重复类型"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="orderStatusString" label="订单状态" align="center">
        </el-table-column>
        <el-table-column prop="hisOrderStatusStr" label="历史订单状态" align="center">
        </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" width="90" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="['1'].indexOf(scope.row.orderStatus) > -1"
              @click="confirmBtnHandle(scope.row)"
              type="text"
              size="small"
              >确认</el-button
            >
            <el-button
              v-if="['1', '2'].indexOf(scope.row.orderStatus) > -1"
              @click="cancelBtnHandle(scope.row)"
              type="text"
              size="small"
              >取消</el-button
            >
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
import { orderRepeatListPage, orderRepeatConfirm, orderRepeatCancel } from '@/api/order.js'

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
      queryForm: {
        orderTimeRange: [],
        merchantId: '-1'
      },
      selectedRows: [],
      merchantList: [
        {
          label: '神创未来',
          value: '1'
        },
        {
          label: '佰福莱家居',
          value: '2'
        },
        {
          label: '深圳泽泽好物',
          value: '3'
        },
        {
          label: '武汉翠泽商行',
          value: '4'
        },
        {
          label: '小优起飞',
          value: '5'
        },
        {
          label: '武汉娟娟好物',
          value: '6'
        },
        {
          label: '武汉清华好物',
          value: '7'
        },
        {
          label: '勇哥商行',
          value: '8'
        },
        {
          label: '伟平商行',
          value: '9'
        }
      ]
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
        orderNo: this.queryForm.orderNo,
        goodsName: this.queryForm.goodsName,
        receiverMobile: this.queryForm.receiverMobile,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        merchantId: this.queryForm.merchantId === '-1' ? '' : this.queryForm.merchantId,
        orderStatus: this.queryForm.orderStatus === '-1' ? '' : this.queryForm.orderStatus
      }
      orderRepeatListPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 分页查询订单结束 */
    repeatTypeFmt(row) {
      switch (row.repeatType) {
        case 'D':
          return '当日重复'
        case 'H':
          return '历史重复'
        default:
          return row.repeatType
      }
    },
    confirmBtnHandle(row) {
      this.$confirm('确认订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = [row.orderNo]
        orderRepeatConfirm(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryBtnHandle()
        })
      })
    },
    cancelBtnHandle(row) {
      this.$confirm('确认取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = [row.orderNo]
        orderRepeatCancel(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryBtnHandle()
        })
      })
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    batchCancelHandle() {
      if (this.selectedRows.length === 0) {
        this.$message({
          message: '请至少选中一条数据',
          type: 'error'
        })
        return
      }
      if (this.selectedRows.some(row => ['1', '2'].indexOf(row.orderStatus) === -1)) {
        this.$message({
          message: '存在不能取消数据',
          type: 'error'
        })
        return
      }
      this.$confirm('确认取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = this.selectedRows.map(row => row.orderNo)
        orderRepeatCancel(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryBtnHandle()
        })
      })
    },
    batchConfirmHandle() {
      if (this.selectedRows.length === 0) {
        this.$message({
          message: '请至少选中一条数据',
          type: 'error'
        })
        return
      }
      if (this.selectedRows.some(row => ['1'].indexOf(row.orderStatus) === -1)) {
        this.$message({
          message: '存在不能确认数据',
          type: 'error'
        })
        return
      }
      this.$confirm('确认订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = this.selectedRows.map(row => row.orderNo)
        orderRepeatConfirm(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryBtnHandle()
        })
      })
    },
    tableRowClassName(row) {
      console.log(row)
      return row.row.children ? '' : 'warning-row'
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
  color: #ffffff;
  background: #f56c6c;
}

.el-table .warning-row.hover-row {
  color: #606266;
}
</style>
