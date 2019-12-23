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
          <el-button size="small" type="primary" @click="listDeliverDetail">查询</el-button>
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
        <el-table-column prop="goodsName" label="品名" align="center"> </el-table-column>
        <el-table-column prop="total" label="合计" align="center"> </el-table-column>
        <el-table-column label="代发快递" align="center">
          <el-table-column label="小计" align="center">
            <el-table-column prop="subtotalOn" label="线上" align="center"> </el-table-column>
            <el-table-column prop="subtotalOff" label="线下" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column prop="totalJd" label="京东" align="center">
            <el-table-column prop="totalJdOn" label="线上" align="center"> </el-table-column>
            <el-table-column prop="totalJdOff" label="线下" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column prop="totalDb" label="德邦" align="center">
            <el-table-column prop="totalDbOn" label="线上" align="center"> </el-table-column>
            <el-table-column prop="totalDbOff" label="线下" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column prop="exceedJd" label="超区" align="center">
            <el-table-column prop="exceedJdOn" label="线上" align="center"> </el-table-column>
            <el-table-column prop="exceedJdOff" label="线下" align="center"> </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { listDeliverDetail } from '@/api/waybill.js'
import { parseTime } from '@/utils'

export default {
  data() {
    const currentDate = parseTime(new Date(), '{y}-{m}-{d}')

    return {
      tableDataSearch: [],
      queryForm: {
        orderDate: currentDate
      }
    }
  },
  methods: {
    // 异步获取数据
    listDeliverDetail() {
      var param = {
        orderDate: this.queryForm.orderDate
      }
      listDeliverDetail(param).then(res => {
        this.tableDataSearch = res.data
      })
    }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.listDeliverDetail()
  }
}
</script>
