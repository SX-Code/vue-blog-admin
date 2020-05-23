<template>
  <div>
    <!-- element 上传图片按钮 -->
    <el-upload
      class="upload-demo"
      action
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="changeUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
    </el-upload>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible">
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :can-move="option.canMove"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
            :mode="option.mode"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postPicture } from '@/api/blog'

export default {
  data() {
    return {
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 800, // 默认生成截图框宽度
        // autoCropHeight: 450, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [16, 9], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMove: false, // 上传图片是否可以移动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: 'contain'
      },
      picsList: [],
      // 防止重复提交
      loading: false,
      imageName: ''
    }
  },
  methods: {
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.warning('图片过大')
        return false
      }
      this.imageName = file.name
      this.option.outputType = file.raw.type.substring(file.raw.type.lastIndexOf('/') + 1)
      this.getBase64(file.raw).then(res => {
        this.option.img = res
      })
      this.dialogVisible = true
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        this.loading = true
        const formdata = new FormData()
        formdata.append('file', data, this.imageName)
        postPicture(formdata).then(res => {
          if (res.code === 20000) {
            this.loading = false
            this.dialogVisible = false
            this.$emit('pictureURL', res.data)
            return this.$message({
              type: 'success',
              message: res.message || '图片上传成功'
            })
          }
        })
      })
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>

<style scoped>
.cropper-content .cropper {
  width: auto;
  height: 450px;
}
</style>
