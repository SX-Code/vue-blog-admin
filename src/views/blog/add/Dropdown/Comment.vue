<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain size="small">
      {{ commentable?'评论: 开':'评论: 关' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="commentable" style="padding: 10px;">
          <el-radio :label="true">
            关闭评论
          </el-radio>
          <el-radio :label="false">
            开启评论
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
      default: false
    }
  },
  computed: {
    commentable: {
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
