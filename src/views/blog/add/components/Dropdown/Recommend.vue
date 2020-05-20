<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain size="small">
      {{ recommend?'推荐: 开':'推荐: 关' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="recommend" style="padding: 10px;">
          <el-radio :label="false">
            关闭推荐
          </el-radio>
          <el-radio :label="true">
            开启推荐
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
    recommend: {
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
