
<template>
  <div class="app-container">
    <el-form
          ref="dataForm"
          :rules="rules"
          label-position="left"
          :model="temp"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="新闻内容" prop="title">
            <el-input v-model="temp.newsContent" />
          </el-form-item>
          <el-form-item label="新闻大图" prop="title">
            <el-input v-model="temp.newsImg" />
          </el-form-item>
          <el-form-item label="新闻简介" prop="title">
            <el-input v-model="temp.newsQuote" />
          </el-form-item>
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="temp.newsTitle" />
          </el-form-item>
          <el-form-item label="新闻类型" prop="title">
            <el-input v-model="temp.newsTypeId" />
          </el-form-item>
          <el-form-item label="新闻跳转地址" prop="title">
            <el-input v-model="temp.url" />
          </el-form-item>
        </el-form>
        <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="createData"
      >添加新闻</el-button>
       
  </div>
</template>

<script>
import { fetchList } from "@/api/article";

export default {
 

  name: "InlineEditTable",

  data() {
    return {
      url: "http://www.zhongjubang.com/test/",
      form:{
	      newsTypeId:"",
	      newsTitle:""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      dialogFormVisible: false,
      temp: {
        newsContent: "",
        newsImg: "",
        newsQuote: "",
        newsTitle: "",
        newsTypeId: "",
        url: ""
      },
      rules: {
        newsTitle: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created(){
    this.dialogFormVisible = true
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file.name);
      // console.log(file.url.name)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          const url = this.url;
          console.log(url)
          console.log(this.temp.newsContent)
          console.log(this.temp.newsImg)
          console.log(this.temp.newsQuote)
          console.log(this.temp.newsTitle)
          console.log(this.temp.newsTypeId)
          console.log(this.temp.url)
          this.dialogFormVisible = true
          this.Axios.post(url + "/admin/applet/updatenews", {
            newsId:'1',
            newsContent: this.temp.newsContent,
            newsImg: this.temp.newsImg,
            newsQuote: this.temp.newsQuote,
            newsTitle: this.temp.newsTitle,
            newsTypeId: this.temp.newsTypeId,
            url: this.temp.url
          }).then(res => {
            console.log(res);
            if (res.status == 200) {
              console.log("上传成功");
            } 
          });
        } else{
          console.log(this.dataForm)
        }
      });
    },
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.app-container {
  width: 60%;
  margin: 0 auto;
}
.primary {
  background-color: #ec9300;
  border: 1px solid #ec9300;
  margin-left: 300px;
  width: 300px;
}
</style>
