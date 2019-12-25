<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="物品名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.receiverMobile"
            placeholder="收件人手机号"
            @keyup.enter.native="queryHandle(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            v-model="queryForm.orderTimeRange"
            placeholder="下单时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
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
        <el-table-column prop="orderNo" label="订单号" width="100" align="center" />
        <el-table-column prop="hangReason" label="挂起历史" width="250" align="center">
          <template slot-scope="scope">
            <ol v-if="scope.row.remark">
              <li :key="item.index" v-for="item in scope.row.remark.split(',')">
                <span>{{ item }}</span>
              </li>
            </ol>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
          <template slot-scope="scope">
            <el-button @click="copy(scope.row.receiverMobile)" type="text" size="small">{{
              scope.row.receiverMobile
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column prop="channel" label="渠道" align="center"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收金额" align="center"> </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="processStatus" label="处理状态" width="110" align="center">
        </el-table-column>
        <el-table-column prop="operator" label="操作员" align="center"> </el-table-column>
        <el-table-column prop="wayBillNo" label="运单号" align="center"> </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="option" width="100" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.processStatus === '未处理' || scope.row.processStatus === '未处理|挂起'
              "
              @click="handleException(scope.row)"
              type="text"
              size="small"
              >处理</el-button
            >
            <el-button
              v-if="
                scope.row.processStatus === '未处理' || scope.row.processStatus === '未处理|挂起'
              "
              @click="hangException(scope.row)"
              type="text"
              size="small"
              >挂起</el-button
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

    <el-dialog title="" :close-on-click-modal="false" :visible.sync="waybillHandleVisible">
      <el-form :model="handleForm" label-width="160px">
        <el-form-item label="订单号">
          <el-input v-model="handleForm.orderNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="客户截图:">
          <el-upload
            class="avatar-uploader"
            :action="this.baseURL + '/file/uploadImg'"
            :show-file-list="false"
            :on-success="uploadImgSuccess"
            :before-upload="beforeImgUpload"
          >
            <img v-if="handleForm.processProof" :src="handleForm.processProof" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-select v-model="handleForm.processResult" placeholder="">
            <el-option label="用户同意撤销退款" value="用户同意撤销退款"></el-option>
            <el-option label="用户不同意撤销退款" value="用户不同意撤销退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleExceptionCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="" :close-on-click-modal="false" :visible.sync="waybillHangVisible">
      <el-form :model="hangForm" label-width="160px">
        <el-form-item label="订单号">
          <el-input v-model="hangForm.orderNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="hangForm.remark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="hangExceptionCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPageTodo, handle, hang } from '@/api/order-process.js'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: [],
        processTimeRange: []
      },
      waybillHandleVisible: false,
      handleForm: {
        processProof: '',
        processResult: ''
      },
      waybillHangVisible: false,
      hangForm: {
        remark: ''
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
        wayBillNo: this.queryForm.wayBillNo,
        goodsName: this.queryForm.goodsName,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        receiverMobile: this.queryForm.receiverMobile
      }
      listPageTodo(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    copy(value) {
      this.$copyText(value).then(
        () => {
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1000
          })
        },
        () => {
          this.$message({
            message: '复制失败，请手动复制',
            type: 'error',
            duration: 1000
          })
        }
      )
    },
    handleException(row) {
      this.waybillHandleVisible = true
      this.handleForm.orderNo = row.orderNo
      this.handleForm.processProof = ''
      this.handleForm.processResult = ''
    },
    handleExceptionCommit() {
      const param = {
        orderNo: this.handleForm.orderNo,
        processProof: this.handleForm.processProof,
        processResult: this.handleForm.processResult
      }
      handle(param).then(res => {
        this.waybillHandleVisible = false
        this.wayClaimVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    hangException(row) {
      this.waybillHangVisible = true
      this.hangForm.orderNo = row.orderNo
      this.hangForm.remark = ''
    },
    hangExceptionCommit() {
      const param = {
        orderNo: this.hangForm.orderNo,
        remark: this.hangForm.remark
      }
      hang(param).then(res => {
        this.waybillHangVisible = false
        this.wayClaimVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    beforeImgUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadImgSuccess(res) {
      this.handleForm.processProof = res.data.fileName
    }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  line-height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
