<template>
  <div class="Pagination-content">
    <el-pagination
      v-if="vShow"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currPage"
      :page-sizes="pageSize"
      :page-size="perPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Pagination',
  data() {
    return {
      perPage: this.perpages || 10,
      currPage: this.currentPage || 1,
      vShow: true
    }
  },
  props: {
    currentPage: {
      default: 1,
      type: Number
    },
    pageSize: {
      default: function() {
        return [10, 20, 30, 40]
      },
      type: Array
    },
    total: {
      default: 0,
      type: Number
    },
    perpages: {
      default: 10,
      type: Number
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('currentPage', val, this.currPage)
    },
    handleCurrentChange(val) {
      this.$emit('currentPage', this.perPage, val)
      this.vShow = false
      this.$nextTick(() => {
        this.vShow = true
      })
    }
  },
  watch: {
    currentPage(val) {
      this.currPage = val
      console.log('pagination - watch :', this.currPage, val)
    }
  }
}
</script>

<style lang="scss" scoped></style>
