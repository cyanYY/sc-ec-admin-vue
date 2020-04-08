<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.merchantName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.applyTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="申请开始日期"
            end-placeholder="申请结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        :data="tableDataSearch"
        border
        size="mini"
        center
        style="width: 100%;font-size: 13px;"
        highlight-current-row
      >
        <el-table-column prop="serviceId" label="服务请求ID" align="center"> </el-table-column>
        <el-table-column prop="orderNo" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" align="center"> </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" align="center"> </el-table-column>
        <el-table-column prop="replyTime" label="处理时间" align="center"> </el-table-column>
        <el-table-column prop="operator" label="处理人" align="center"> </el-table-column>
        <el-table-column prop="detail" width="250" label="服务内容" align="center">
        </el-table-column>
        <el-table-column prop="reply" label="回复内容" align="center"> </el-table-column>
        <el-table-column prop="operateStatusDesc" label="状态" align="center"> </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.operateStatus === '0'"
              @click="handleBtnHandle(scope.row)"
              type="text"
              size="small"
              >处理</el-button
            >
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>
    <div v-if="total > 0">
      <Pagination
        :total="total"
        :perpages="perpageNumber"
        :currentPage="currentPage"
        @currentPage="getCurrentPage"
      ></Pagination>
    </div>

    <el-dialog title="回复" :close-on-click-modal="false" :visible.sync="handleVisible">
      <el-form :model="handleForm" label-width="160px">
        <el-form-item label="服务请求ID：">
          {{ handleForm.serviceId }}
        </el-form-item>
        <el-form-item label="订单号：">
          {{ handleForm.orderNo }}
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ handleForm.applyTime }}
        </el-form-item>
        <el-form-item label="服务内容：">
          <el-input type="textarea" placeholder="" v-model="handleForm.detail" :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="回复内容：">
          <el-input type="textarea" placeholder="" v-model="handleForm.reply"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="applyService">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, applyService } from '@/api/order-service.js'

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
      queryForm: {
        applyTimeRange: []
      },
      handleVisible: false,
      handleForm: {
        id: '',
        serviceId: '',
        orderNo: '',
        applyTime: '',
        detail: '',
        reply: ''
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
      let applyTimeStart = ''
      let applyTimeEnd = ''
      if (this.queryForm.applyTimeRange) {
        applyTimeStart = this.queryForm.applyTimeRange[0]
        applyTimeEnd = this.queryForm.applyTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        orderNo: this.queryForm.orderNo,
        merchantName: this.queryForm.merchantName,
        applyTimeStart: applyTimeStart,
        applyTimeEnd: applyTimeEnd
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 分页查询订单结束 */

    handleBtnHandle(row) {
      this.handleVisible = true

      this.handleForm.id = row.id
      this.handleForm.serviceId = row.serviceId
      this.handleForm.orderNo = row.orderNo
      this.handleForm.applyTime = row.applyTime
      this.handleForm.detail = row.detail
      this.handleForm.reply = ''
    },

    /** 回复开始 */
    applyService() {
      const param = {
        id: this.handleForm.id,
        reply: this.handleForm.reply
      }
      applyService(param).then(res => {
        this.handleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    }
    /** 回复结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
