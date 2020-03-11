<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.buyerTel" placeholder="客户手机号" clearable></el-input>
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
        <el-table-column prop="orderNo" label="订单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="150" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" label="订单提交时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="goodsAmount" label="商品单价" align="center"> </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收款" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="200" align="center">
        </el-table-column>
        <el-table-column
          prop="payMethod"
          :formatter="payMethodFormatter"
          label="支付方式"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :formatter="orderStatusFormatter"
          label="订单状态"
          align="center"
        ></el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="aftersaleBtnHandle(scope.row)" type="text" size="small"
              >售后</el-button
            >
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>

    <el-dialog
      width="70%"
      title="处理售后"
      :close-on-click-modal="false"
      :visible.sync="handleFormVisible"
    >
      <el-card header="订单信息">
        <el-row :gutter="10">
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单号：</label>
              <div class="el-form-item__content">{{ handleForm.orderNo }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商户名称</label>
              <div class="el-form-item__content">
                {{ handleForm.merchantName }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商品名称</label>
              <div class="el-form-item__content">
                {{ handleForm.goodsName }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">下单时间：</label>
              <div class="el-form-item__content">
                {{ handleForm.orderTime }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人：</label>
              <div class="el-form-item__content">{{ handleForm.receiver }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人手机号：</label>
              <div class="el-form-item__content">{{ handleForm.receiverMobile }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人地址：</label>
              <div class="el-form-item__content">{{ handleForm.receiverAddress }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">实收款：</label>
              <div class="el-form-item__content">{{ handleForm.actualAmount }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">支付方式</label>
              <div class="el-form-item__content">
                {{ payMethodFormatter({ payMethod: handleForm.payMethod }) }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单状态：</label>
              <div class="el-form-item__content">
                {{ orderStatusFormatter({ orderStatus: handleForm.orderStatus }) }}
              </div>
            </div></el-col
          >
        </el-row>
      </el-card>
      <el-card header="售后记录" style="margin-top: 10px;">
        <el-table :data="afterSaleList" size="mini" center style="width: 100%;font-size: 13px;">
          <el-table-column prop="operatorTime" label="处理时间" align="center"> </el-table-column>
          <el-table-column prop="operator" label="处理人员" align="center"> </el-table-column>
          <el-table-column prop="remark" label="处理记录" align="center"> </el-table-column>
          <el-table-column prop="operateStatusDesc" label="处理状态" align="center">
          </el-table-column>
        </el-table>
      </el-card>
      <el-form style="margin-top: 10px;">
        <el-form-item label="处理备注：">
          <el-input v-model="handleForm.remark" placeholder="" style="width: 300px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="图片凭证:">
        <el-upload
          class="avatar-uploader"
          :action="this.baseURL + '/file/uploadImg'"
          :show-file-list="false"
          :on-success="handleImgSuccess"
          :before-upload="beforeImgUpload"
        >
          <img v-if="handleForm.refundUrl" :src="handleForm.refundUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
        <div style="margin-top: 10px; text-align: right;">
          <el-button size="small" type="primary" @click="aftersaleHandle">转到售后</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { queryAfterSale, queryAfterSaleLogs, offlineAfterSale } from '@/api/refund.js'
import { orderStatusArray } from '@/utils/const'

export default {
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      tableDataSearch: [],
      total: 0,
      queryForm: {},
      handleFormVisible: false,
      handleForm: {
        orderNo: '',
        merchantName: '',
        goodsName: '',
        orderTime: '',
        receiver: '',
        receiverMobile: '',
        receiverAddress: '',
        actualAmount: '',
        payMethod: '',
        orderStatusString: '',
        remark: '',
        refundUrl: ''
      },
      afterSaleList: [],
      orderStatusArray: orderStatusArray
    }
  },
  methods: {
    /** 按手机号查询订单开始 */
    queryBtnHandle() {
      this.getListByMobile()
    },
    getListByMobile() {
      var param = {
        buyerTel: this.queryForm.buyerTel
      }
      queryAfterSale(param).then(res => {
        this.tableDataSearch = res.data
        this.total = res.data.length

        if (this.total == 1) {
          this.aftersaleBtnHandle(this.tableDataSearch[0])
        }
      })
    },
    payMethodFormatter(row) {
      switch (row.payMethod) {
        case '0':
          return '货到付款'
        case '1':
          return '在线支付'
        case '2':
          return '在线支付'
        default:
          return row.payMethod
      }
    },
    orderStatusFormatter(row) {
      const item = this.orderStatusArray.find(item => item.value === row.orderStatus)
      return item ? item.label : row.orderStatus
    },
    /** 按手机号查询订单结束 */

    /** 转入售后开始 */
    aftersaleBtnHandle(row) {
      this.handleFormVisible = true

      this.handleForm.orderNo = row.orderNo
      this.handleForm.merchantName = row.merchantName
      this.handleForm.goodsName = row.goodsName
      this.handleForm.orderTime = row.orderTime
      this.handleForm.receiver = row.receiver
      this.handleForm.receiverMobile = row.receiverMobile
      this.handleForm.receiverAddress = row.receiverAddress
      this.handleForm.actualAmount = row.actualAmount
      this.handleForm.payMethod = row.payMethod
      this.handleForm.orderStatus = row.orderStatus
      this.handleForm.remark = ''

      const param = {
        orderNo: this.handleForm.orderNo
      }
      queryAfterSaleLogs(param).then(res => {
        this.afterSaleList = res.data
      })
    },
    aftersaleHandle() {
      const param = {
        orderNo: this.handleForm.orderNo,
        remark: this.handleForm.remark
        // refundUrl: this.handleForm.refundUrl
      }
      offlineAfterSale(param).then(res => {
        this.handleFormVisible = false
        this.$message({
          message: res.data,
          type: 'success'
        })
        this.tableDataSearch = []
      })
    }
    /** 转入售后结束 */
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
  handleImgSuccess(res) {
    this.handleForm.refundUrl = res.data.fileName
  },
  create() {},
  mounted() {}
}
</script>
