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
                  <el-form-item label="分类:">
                    <el-select v-model="postForm.typeId" placeholder="请选择分类" style="width:220px">
                      <el-option
                        v-for="item in types"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
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

        <el-form-item label-width="72px" label="选择标签:">
          <el-select v-model="postForm.tags" multiple clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

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
import { fetchTagList } from '@/api/tag'
import { fetchTypeList } from '@/api/type'
const defaultForm = {
  id: null,
  appreciate: true, // 赞赏开关
  commentable: true, // 评论开关
  content: '', // 文章内容
  describe: '', // 文章摘要
  firstPicture: '', // 文章图片
  flag: '原创', // 文章标志
  published: 0, // 发布状态
  recommend: true, // 是否推荐
  shareStatement: false, // 是否可转载
  title: '', // 文章题目
  views: 0, // 文章浏览数
  typeId: null, // 文章类别
  userId: 1, // 发布用户
  like: 0, // 文章赞数
  unlike: 0, // 文章踩数
  tags: [] // 文章标签 ids
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
      },
      tags: [],
      types: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.describe.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.fetchTagOptions()
    this.fetchTypeOptions()
  },
  methods: {
    async fetchData(id) {
      const res = await fetchArticle(id)
      this.postForm = res.data
    },
    async fetchTagOptions() {
      const res = await fetchTagList()
      this.tags = res.data
    },
    async fetchTypeOptions() {
      const res = await fetchTypeList()
      this.types = res.data
    },
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      var formdata = new FormData()
      formdata.append('file', $file)
      postPicture(formdata).then(res => {
        if (res.code === 20000) {
          this.$refs.md.$img2Url(pos, res.data)
          return this.$message({
            type: 'success',
            message: res.message || '图片上传失败'
          })
        }
      })
    },
    change(value, render) {
      // render 为 markdown 解析后的结果
    },
    postData() {
      this.$refs.postForm.validate(async(vaild) => {
        if (vaild) {
          console.log(this.postForm)
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
