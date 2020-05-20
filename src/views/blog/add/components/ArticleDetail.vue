<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.published">
        <CommentDropdown v-model="postForm.commentable" />
        <AppreciateDropdown v-model="postForm.appreciate" />
        <RecommendDropdown v-model="postForm.recommend" />
        <el-button v-loading="loading" size="small" style="margin-left: 10px;" type="success" @click="publish()">发布</el-button>
        <el-button v-loading="loading" size="small" type="warning" @click="draft()">草稿</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author" placeholder="sw-code" disabled />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期和时间"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="90px" label="标志:" class="postInfo-container-item">
                    <el-select v-model="postForm.flag" placeholder="原创">
                      <el-option label="原创" value="原创" />
                      <el-option label="转载" value="转载" />
                      <el-option label="翻译" value="翻译" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="72px" label="文章摘要:" prop="describe">
          <el-input
            v-model="postForm.describe"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入文章摘要"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>
        <el-form-item prop="content">
          <mavon-editor
            ref="md"
            v-model="postForm.content"
            style="min-height: 600px"
            @imgAdd="$imgAdd"
            @change="change"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validURL } from '@/utils/validate'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import { CommentDropdown, AppreciateDropdown, RecommendDropdown } from './Dropdown'
// mavon-editor markdown编辑器
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { postPicture } from '@/api/blog'
import { fetchArticle, postArticle } from '@/api/article'
const defaultForm = {
  id: null,
  published: 0,
  author: 'sw-code',
  title: '', // 文章题目
  content: '', // 文章内容
  describe: '', // 文章摘要
  firstPicture: '', // 文章图片
  updateTime: undefined, // 前台展示时间
  flag: '原创',
  commentable: true,
  recommend: true,
  appreciate: true
}
export default {
  components: { Sticky, CommentDropdown, AppreciateDropdown, RecommendDropdown, MDinput, mavonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: defaultForm,
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        describe: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.describe.length
    },
    displayTime: {
      get() {
        return +new Date(this.postForm.updateTime)
      },
      set(val) {
        this.postForm.updateTime = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    async fetchData(id) {
      const res = await fetchArticle(id)
      this.postForm = res.data
    },
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      var formdata = new FormData()
      formdata.append('file', $file)
      postPicture(formdata).then(response => {
        this.$refs.md.$img2Url(pos, response.data.url)
      })
    },
    change(value, render) {
      // render 为 markdown 解析后的结果
    },
    postData() {
      this.$refs.postForm.validate(async(vaild) => {
        if (vaild) {
          const res = await postArticle(this.postForm)
          if (res.code === 20000) {
            this.$router.push('/blog/list')
            return this.$message({
              message: res.message,
              type: 'success'
            })
          }
        }
      })
    },
    draft() {
      this.postForm.published = 0
      this.postData()
    },
    publish() {
      this.postForm.published = 1
      this.postData()
    }
  }
}
</script>

<style scoped>
.createPost-main-container {
  padding: 10px 45px 20px 50px;
}
.postInfo-container-item {
  width: 220px;
}
.v-note-wrapper{
  z-index: 1;
}
</style>
