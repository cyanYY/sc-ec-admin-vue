<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span v-if="name" style="cursor: pointer;">{{ name || '游客' }}</span>
          <img v-else :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="updatePwd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :close-on-click-modal="false" :visible.sync="updatePwdVisible">
      <el-form ref="updatePwdForm" :model="updatePwdForm" :rules="updatePwdRules">
        <el-form-item label="原密码" prop="password" required>
          <el-input v-model="updatePwdForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" required>
          <el-input v-model="updatePwdForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" required>
          <el-input v-model="updatePwdForm.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updatePwdCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePwd } from '@/api/user.js'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  data() {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (this.updatePwdForm.newPassword !== this.updatePwdForm.confirmPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      updatePwdVisible: false,
      updatePwdForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      updatePwdRules: {
        password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { trigger: 'blur', validator: validatePasswordConfirm }
        ]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    updatePwd() {
      this.updatePwdVisible = true

      this.$refs['updatePwdForm'].resetFields()
    },
    updatePwdCommit() {
      this.$refs['updatePwdForm'].validate(valid => {
        if (valid) {
          const param = {
            password: this.updatePwdForm.password,
            newPassword: this.updatePwdForm.newPassword,
            confirmPassword: this.updatePwdForm.confirmPassword
          }
          updatePwd(param).then(res => {
            this.updatePwdVisible = false
            this.$message({
              message: res.msg,
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
