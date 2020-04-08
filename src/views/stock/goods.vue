<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.goodsNo" placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="addBtnHandle">新增商品</el-button>
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
        <el-table-column prop="goodsNo" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="goodsShortName" label="商品简称" align="center"> </el-table-column>
        <el-table-column prop="goodsId" label="商品编号(鲁班)" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商户名称(鲁班)" align="center"> </el-table-column>
        <el-table-column
          prop="confirmMsg"
          label="确认短信"
          align="center"
          width="50"
          :formatter="boolFormat"
        >
        </el-table-column>
        <el-table-column
          prop="cancelMsg"
          label="取消短信"
          align="center"
          width="50"
          :formatter="boolFormat"
        >
        </el-table-column>
        <el-table-column
          prop="deliverMsg"
          label="发货短信"
          align="center"
          width="50"
          :formatter="boolFormat"
        >
        </el-table-column>
        <el-table-column prop="sender" label="发件人" align="center" width="180">
          <template slot-scope="scope">
            <el-tag
              v-for="sender in scope.row.senders"
              :key="sender.id"
              style="margin-bottom: 5px; margin-right: 5px;"
              type="danger"
              closable
              @click="senderUpdateBtnHandle(sender)"
              @close="senderDeleteHandle(sender)"
            >
              {{ sender.sender }}
            </el-tag>
            <el-button size="small" @click="senderAddBtnHandle(scope.row)">新增</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作" width="50">
          <template slot-scope="scope">
            <el-button @click="updateBtnHandle(scope.row)" type="text" size="small">修改</el-button>
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

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="商品编号">
          <el-input v-model="addForm.goodsNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品简称">
          <el-input v-model="addForm.goodsShortName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品编号(鲁班)">
          <el-input v-model="addForm.goodsId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品名称(鲁班)">
          <el-input v-model="addForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="确认短信">
          <el-switch v-model="addForm.confirmMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item label="取消短信">
          <el-switch v-model="addForm.cancelMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item label="发货短信">
          <el-switch v-model="addForm.deliverMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="updateFormVisible"
    >
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="商品编号">
          <el-input v-model="updateForm.goodsNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品简称">
          <el-input v-model="updateForm.goodsShortName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品编号(鲁班)">
          <el-input v-model="updateForm.goodsId" placeholder="" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名称(鲁班)">
          <el-input v-model="updateForm.goodsName" placeholder="" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="确认短信">
          <el-switch v-model="updateForm.confirmMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item label="取消短信">
          <el-switch v-model="updateForm.cancelMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item label="发货短信">
          <el-switch v-model="updateForm.deliverMsg" placeholder=""></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="senderAddFormVisible"
    >
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="收件人">
          <el-input v-model="senderAddForm.sender" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号">
          <el-input v-model="senderAddForm.senderMobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="senderAddHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="senderUpdateFormVisible"
    >
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="收件人">
          <el-input v-model="senderUpdateForm.sender" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号">
          <el-input v-model="senderUpdateForm.senderMobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="senderUpdateHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, update, add, addSender, updateSender, deleteSender } from '@/api/goods.js'

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
      queryForm: {},
      addForm: {
        goodsNo: '',
        goodsShortName: '',
        goodsId: '',
        goodsName: '',
        confirmMsg: false,
        cancelMsg: true,
        deliverMsg: true
      },
      updateForm: {
        id: '',
        goodsNo: '',
        goodsShortName: '',
        goodsId: '',
        goodsName: '',
        confirmMsg: false,
        cancelMsg: true,
        deliverMsg: true
      },
      addFormVisible: false,
      updateFormVisible: false,
      senderAddFormVisible: false,
      senderUpdateFormVisible: false,
      senderAddForm: {
        goodsNo: '',
        sender: '',
        senderMobile: ''
      },
      senderUpdateForm: {
        id: '',
        sender: '',
        senderMobile: ''
      }
    }
  },
  methods: {
    /** 分页查询开始 */
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
      const param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        goodsNo: this.queryForm.goodsNo,
        goodsName: this.queryForm.goodsName
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    boolFormat(row, column, val) {
      switch (val) {
        case true:
          return '是'
        case false:
          return '否'
        default:
          return val
      }
    },
    /** 分页查询结束 */

    /** 新增开始 */
    addBtnHandle() {
      this.addFormVisible = true

      this.addForm.goodsNo = ''
      this.addForm.goodsShortName = ''
      this.addForm.goodsId = ''
      this.addForm.goodsName = ''
      this.addForm.confirmMsg = false
      this.addForm.cancelMsg = true
      this.addForm.deliverMsg = true
    },
    addHandle() {
      const param = {
        goodsNo: this.addForm.goodsNo,
        goodsShortName: this.addForm.goodsShortName,
        goodsId: this.addForm.goodsId,
        goodsName: this.addForm.goodsName,
        confirmMsg: this.addForm.confirmMsg,
        cancelMsg: this.addForm.cancelMsg,
        deliverMsg: this.addForm.deliverMsg
      }
      add(param).then(res => {
        this.addFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 新增结束 */

    /** 修改开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.id = row.id
      this.updateForm.goodsNo = row.goodsNo
      this.updateForm.goodsShortName = row.goodsShortName
      this.updateForm.goodsId = row.goodsId
      this.updateForm.goodsName = row.goodsName
      this.updateForm.confirmMsg = row.confirmMsg
      this.updateForm.cancelMsg = row.cancelMsg
      this.updateForm.deliverMsg = row.deliverMsg
    },
    updateHandle() {
      const param = {
        id: this.updateForm.id,
        goodsNo: this.updateForm.goodsNo,
        goodsShortName: this.updateForm.goodsShortName,
        goodsId: this.updateForm.goodsId,
        goodsName: this.updateForm.goodsName,
        confirmMsg: this.updateForm.confirmMsg,
        cancelMsg: this.updateForm.cancelMsg,
        deliverMsg: this.updateForm.deliverMsg
      }
      update(param).then(res => {
        this.updateFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 修改结束 */

    /** 配置发件人开始 */
    senderAddBtnHandle(row) {
      this.senderAddFormVisible = true

      this.senderAddForm.goodsNo = row.goodsNo
      this.senderAddForm.sender = ''
      this.senderAddForm.senderMobile = ''
    },
    senderAddHandle() {
      const param = {
        goodsNo: this.senderAddForm.goodsNo,
        sender: this.senderAddForm.sender,
        senderMobile: this.senderAddForm.senderMobile
      }
      addSender(param).then(res => {
        this.senderAddFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    senderUpdateBtnHandle(sender) {
      this.senderUpdateFormVisible = true

      this.senderUpdateForm.id = sender.id
      this.senderUpdateForm.sender = sender.sender
      this.senderUpdateForm.senderMobile = sender.senderMobile
    },
    senderUpdateHandle() {
      const param = {
        id: this.senderUpdateForm.id,
        sender: this.senderUpdateForm.sender,
        senderMobile: this.senderUpdateForm.senderMobile
      }
      updateSender(param).then(res => {
        this.senderUpdateFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    senderDeleteHandle(sender) {
      const param = {
        id: sender.id
      }
      deleteSender(param).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    }
    /** 配置发件人结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
