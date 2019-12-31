<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="queryForm.type" placeholder="" @change="typeChange">
            <el-option label="重复单" value="repeat"></el-option>
            <el-option label="用户取消" value="cancel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="queryForm.orderDate"
            placeholder="下单时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.wayBillStatus" placeholder="运单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in wayBillStatus"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
          <el-button
            v-if="queryForm.type === 'cancel'"
            :loading="synLoading"
            size="small"
            type="primary"
            @click="synOrder"
            >订单同步</el-button
          >
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
        row-key="wayBillNo"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="tableRowClassName"
      >
        >
        <el-table-column prop="orderDate" width="130" label="下单时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderDate && scope.row.orderDate.substring(0, 19) }}
          </template>
        </el-table-column>
        <el-table-column prop="wayBillNo" label="运单号" align="center"> </el-table-column>
        <el-table-column
          v-if="queryForm.type === 'repeat'"
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
        <el-table-column
          v-if="queryForm.type === 'cancel'"
          prop="orderStatus"
          label="订单状态"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="170" align="center">
        </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="packageNum" label="数量" align="center"> </el-table-column>
        <el-table-column
          v-if="queryForm.type === 'repeat'"
          prop="option"
          width="100"
          fixed="right"
          align="center"
          label="操作"
        >
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
import { listPageDeliverRepeat, deleteRepeat } from '@/api/waybill.js'
import { synOrder } from '@/api/order.js'
import { parseTime } from '@/utils'

export default {
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
        orderDate: currentDate,
        type: 'repeat'
      },
      wayBillStatus: [
        '妥投',
        '拒收',
        '客户取消',
        '终止揽收',
        '订单入站',
        '配送员收货',
        '协商再投结果',
        '分拣中心发货',
        '分拣中心验货',
        '站点验货',
        '站点再投',
        '已取消',
        '再投后退回'
      ],
      synLoading: false
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
        orderDate: this.queryForm.orderDate,
        type: this.queryForm.type,
        wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus
      }
      listPageDeliverRepeat(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    tableRowClassName(row) {
      if (this.queryForm.type === 'cancel') {
        return ''
      } else {
        return row.row.children ? '' : 'warning-row'
      }
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
    },
    typeChange() {
      this.queryHandle(1)
    },
    synOrder() {
      this.synLoading = true
      synOrder({})
        .then(res => {
          this.synLoading = false
          this.$message({
            message: res.msg,
            type: 'success'
          })
        })
        .catch(() => (this.synLoading = false))
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
  background: #f09d76;
}

.el-table tr.hover-row > td {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
