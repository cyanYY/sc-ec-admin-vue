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
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
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
        <el-form-item label="">
          <el-select v-model="queryForm.wayBillStatus" placeholder="运单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="妥投" value="妥投"></el-option>
            <el-option label="拒收" value="拒收"></el-option>
            <el-option label="客户取消" value="客户取消"></el-option>
            <el-option label="终止揽收" value="终止揽收"></el-option>
            <el-option label="订单入站" value="订单入站"></el-option>
            <el-option label="配送员收货" value="配送员收货"></el-option>
            <el-option label="协商再投结果" value="协商再投结果"></el-option>
            <el-option label="分拣中心发货" value="分拣中心发货"></el-option>
            <el-option label="分拣中心验货" value="分拣中心验货"></el-option>
            <el-option label="站点验货" value="站点验货"></el-option>
            <el-option label="站点再投" value="站点再投"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
            <el-option label="再投后退回" value="再投后退回"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.noOrderStatus" placeholder="订单非状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.noWayBillStatus" placeholder="运单非状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="妥投" value="妥投"></el-option>
            <el-option label="拒收" value="拒收"></el-option>
            <el-option label="客户取消" value="客户取消"></el-option>
            <el-option label="终止揽收" value="终止揽收"></el-option>
            <el-option label="订单入站" value="订单入站"></el-option>
            <el-option label="配送员收货" value="配送员收货"></el-option>
            <el-option label="协商再投结果" value="协商再投结果"></el-option>
            <el-option label="分拣中心发货" value="分拣中心发货"></el-option>
            <el-option label="分拣中心验货" value="分拣中心验货"></el-option>
            <el-option label="站点验货" value="站点验货"></el-option>
            <el-option label="站点再投" value="站点再投"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
            <el-option label="再投后退回" value="再投后退回"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.orderType" placeholder="订单类型">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="线下" value="线下"></el-option>
            <el-option label="超区" value="超区"></el-option>
          </el-select>
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
        <el-table-column prop="goodsSpec" label="商品规格" width="150" align="center">
        </el-table-column>
        <el-table-column prop="goodsAmount" label="商品单价" align="center"> </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"> </el-table-column>
        <el-table-column prop="wayAmount" label="运费" align="center"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收款" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" align="center">
        </el-table-column>
        <el-table-column prop="expressCompany" label="快递公司" align="center"> </el-table-column>
        <el-table-column prop="wayBillNo" label="快递单号" align="center"> </el-table-column>
        <el-table-column prop="orderTime" label="订单提交时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="finishTime" label="完成时间" align="center"> </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center"> </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="userRemark" label="用户留言" align="center"> </el-table-column>
        <el-table-column prop="merchantRemark" label="商户留言" align="center"> </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" width="90" label="操作">
          <template slot-scope="scope">
            <el-button @click="confirmBtnHandle(scope.row)" type="text" size="small"
              >确认</el-button
            >
            <el-button @click="cancelBtnHandle(scope.row)" type="text" size="small">取消</el-button>
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
// import { listPage } from '@/api/order.js'

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
      console.log(numPerPage)
      console.log(pageNum)
      // let orderTimeStart = ''
      // let orderTimeEnd = ''
      // if (this.queryForm.orderTimeRange) {
      //   orderTimeStart = this.queryForm.orderTimeRange[0]
      //   orderTimeEnd = this.queryForm.orderTimeRange[1]
      // }
      // var param = {
      //   numPerPage: numPerPage,
      //   pageNum: pageNum,
      //   orderNo: this.queryForm.orderNo,
      //   goodsName: this.queryForm.goodsName,
      //   receiverMobile: this.queryForm.receiverMobile,
      //   wayBillNo: this.queryForm.wayBillNo,
      //   orderTimeStart: orderTimeStart,
      //   orderTimeEnd: orderTimeEnd,
      //   merchantId: this.queryForm.merchantId === '-1' ? '' : this.queryForm.merchantId,
      //   orderStatus: this.queryForm.orderStatus === '-1' ? '' : this.queryForm.orderStatus,
      //   wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus,
      //   noOrderStatus: this.queryForm.noOrderStatus === '-1' ? '' : this.queryForm.noOrderStatus,
      //   noWayBillStatus:
      //     this.queryForm.noWayBillStatus === '-1' ? '' : this.queryForm.noWayBillStatus,
      //   orderType: this.queryForm.orderType === '-1' ? '' : this.queryForm.orderType
      // }
      // listPage(param).then(res => {
      //   this.tableDataSearch = res.data.recordList
      //   this.total = res.data.totalCount
      // })
      this.tableDataSearch = [
        {
          orderNo: '6768087746415198471',
          merchantName: '佰福莱家居',
          goodsName: '【好运莲莲】太阳能转动莲花座式车载香水',
          goodsSpec: '【豪华升级版】七彩灯光，太阳能供电，360度自动旋转',
          goodsAmount: '119.00',
          goodsNum: '1',
          wayAmount: '0.00',
          actualAmount: '119.00',
          receiver: '文兵',
          receiverMobile: '18728534999',
          expressCompany: '',
          wayBillNo: '',
          orderTime: '2019-12-08 23:17:20',
          finishTime: '',
          orderStatus: '备货中',
          wayBillStatus: '',
          userRemark: '',
          merchantRemark: ''
        }
      ]
      this.total = 1
    }
    /** 分页查询订单结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
