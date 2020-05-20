<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain size="small">
      {{ appreciate?'赞赏: 开':'赞赏: 关' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="appreciate" style="padding: 10px;">
          <el-radio :label="false">
            关闭赞赏
          </el-radio>
          <el-radio :label="true">
            开启赞赏
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    appreciate: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
