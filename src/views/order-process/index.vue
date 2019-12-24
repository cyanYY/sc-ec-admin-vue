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
          <el-input v-model="queryForm.operator" placeholder="处理人员"></el-input>
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
        <el-form-item label="">
          <el-select v-model="queryForm.processStatus" placeholder="处理状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="未处理" value="未处理"></el-option>
            <el-option label="未处理|挂起" value="未处理|挂起"></el-option>
            <el-option label="已处理" value="已处理"></el-option>
            <el-option label="待办理" value="待办理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
          <el-button
            v-if="roles.indexOf('SYS_ADMIN') > -1"
            size="small"
            type="primary"
            @click="wayBillUploadHandle"
            >差评订单导入</el-button
          >
          <el-button size="small" type="primary" @click="batchClaim">批量认领</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="orderNo" label="订单号" width="100" align="center" />
        <el-table-column prop="hangReason" label="挂起历史" width="250" align="center">
          <template slot-scope="scope">
            <ol v-if="scope.row.hangReason">
              <li :key="item.index" v-for="item in scope.row.hangReason.split(',')">
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
        <el-table-column prop="option" width="80" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="
                !scope.row.operatorId &&
                  (scope.row.processStatus === '未处理' ||
                    scope.row.processStatus === '未处理|挂起')
              "
              @click="claimException(scope.row)"
              type="text"
              size="small"
              >办理</el-button
            >
            <el-button
              v-if="scope.row.processStatus === '已处理'"
              @click="processDetail(scope.row)"
              type="text"
              size="small"
              >处理详情</el-button
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
        <el-form-item label="备注">
          <el-input v-model="handleForm.remark" placeholder=""></el-input>
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

    <el-dialog
      width="70%"
      title="差评订单办理"
      :close-on-click-modal="false"
      :visible.sync="wayClaimVisible"
      @close="queryHandle"
    >
      <el-row :gutter="10">
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">订单号：</label>
            <div class="el-form-item__content">{{ claimForm.orderNo }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">物品名：</label>
            <div class="el-form-item__content">{{ claimForm.goodsName }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">实收金额：</label>
            <div class="el-form-item__content">{{ claimForm.acutalAmount }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">收件人：</label>
            <div class="el-form-item__content">{{ claimForm.receiver }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">收件人手机号：</label>
            <div class="el-form-item__content">{{ claimForm.receiverMobile }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">渠道：</label>
            <div class="el-form-item__content">{{ claimForm.channel }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">下单时间：</label>
            <div class="el-form-item__content">{{ claimForm.orderTime }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">运单号：</label>
            <div class="el-form-item__content">{{ claimForm.wayBillNo }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">运单状态：</label>
            <div class="el-form-item__content">{{ claimForm.wayBillStatus }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">处理状态：</label>
            <div class="el-form-item__content">{{ claimForm.processStatus }}</div>
          </div></el-col
        >
        <el-col :span="12"
          ><div>
            <label class="el-form-item__label">收件人地址：</label>
            <div class="el-form-item__content">{{ claimForm.receiverAddress }}</div>
          </div></el-col
        >
        <el-col :span="12"
          ><div>
            <label class="el-form-item__label">挂起原因：</label>
            <div v-if="claimForm.remark" class="el-form-item__content">
              <span :key="index" v-for="(item, index) in claimForm.remark.split(',')">
                {{ index + 1 + '. ' + item }}<br />
              </span>
            </div></div
        ></el-col>
      </el-row>
      <div v-if="claimForm.claimed" style="margin-top: 10px; text-align: right;">
        <el-button size="small" type="success" @click="handleException(claimForm)">处理</el-button>
        <el-button size="small" type="primary" @click="hangException(claimForm)">挂起</el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="wayBillUploadClose"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillUploadVisible"
    >
      <el-form>
        <el-form-item label="选择文件">
          <el-upload
            ref="wayBillUpload"
            :limit="1"
            :multiple="false"
            :action="this.baseURL + '/file/upload'"
            :on-success="waybillUploadSuccess"
          >
            <el-button size="small">上传差评订单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="waybillUploadLoading"
            size="small"
            type="primary"
            @click="waybillUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="处理详情" :close-on-click-modal="false" :visible.sync="processDetailVisible">
      <el-form :model="processDetailForm" label-width="160px">
        <el-form-item label="订单号">
          <el-input v-model="processDetailForm.orderNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="客户截图:">
          <img :src="processDetailForm.processProof" class="avatar" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination/index'
import { upload, listPage, handle, hang, claim, batchClaim } from '@/api/order-process.js'

export default {
  name: 'Exception',
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(['roles'])
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
        processTimeRange: [],
        processStatus: '待办理'
      },
      waybillHandleVisible: false,
      handleForm: {
        processProof: '',
        remark: ''
      },
      waybillHangVisible: false,
      hangForm: {
        remark: ''
      },
      wayClaimVisible: false,
      claimForm: {
        claimed: false
      },
      selectedWayBillNos: [],
      waybillFileName: '',
      waybillUploadVisible: false,
      waybillUploadLoading: false,
      processDetailVisible: false,
      processDetailForm: {}
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
        operator: this.queryForm.operator,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        receiverMobile: this.queryForm.receiverMobile,
        processStatus: this.queryForm.processStatus === '-1' ? '' : this.queryForm.processStatus
      }
      listPage(param).then(res => {
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
      this.handleForm.remark = ''
    },
    handleExceptionCommit() {
      const param = {
        orderNo: this.handleForm.orderNo,
        processProof: this.handleForm.processProof,
        remark: this.handleForm.remark
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
    claimException(row) {
      this.wayClaimVisible = true
      this.claimForm.orderNo = row.orderNo
      this.claimForm.goodsName = row.goodsName
      this.claimForm.actualAmount = row.actualAmount
      this.claimForm.receiver = row.receiver
      this.claimForm.receiverMobile = row.receiverMobile
      this.claimForm.receiverAddress = row.receiverAddress
      this.claimForm.channel = row.channel
      this.claimForm.orderTime = row.orderTime
      this.claimForm.wayBillNo = row.wayBillNo
      this.claimForm.wayBillStatus = row.wayBillStatus
      this.claimForm.processStatus = row.processStatus
      this.claimForm.remark = row.remark
      this.claimForm.claimed = false

      const param = {
        orderNo: this.claimForm.orderNo
      }
      claim(param).then(() => {
        this.claimForm.claimed = true
      })
    },
    batchClaim() {
      if (this.selectedWayBillNos.length === 0) {
        this.$message({
          message: '请至少选中一条数据',
          type: 'error'
        })
        return
      }
      batchClaim(this.selectedWayBillNos).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    handleSelectionChange(rows) {
      this.selectedWayBillNos = rows.map(row => row.orderNo)
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
    },
    wayBillUploadHandle() {
      this.waybillUploadVisible = true
    },
    wayBillUploadClose() {
      this.$refs['wayBillUpload'].clearFiles()
    },
    waybillUploadSuccess(res) {
      this.waybillFileName = res.data.fileName
    },
    waybillUploadHandle() {
      if (!this.waybillFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.waybillFileName
      }
      this.waybillUploadLoading = true
      upload(param)
        .then(res => {
          this.waybillUploadLoading = false
          this.waybillUploadVisible = false
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryHandle()
        })
        .catch(() => {
          this.waybillUploadLoading = false
        })
    },
    processDetail(row) {
      this.processDetailVisible = true
      this.processDetailForm.orderNo = row.orderNo
      this.processDetailForm.processProof = row.processProof
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
