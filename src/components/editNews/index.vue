<template>
	<div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
		<el-form ref="dataForm" :rules="rules" label-position="left" :model="temp" label-width="120px" style="margin-left:50px;">
			<el-form-item label="新闻内容" prop="newsContent">
				<textarea :id="tinymceId" class="tinymce-textarea" />
				<div class="editor-custom-btn-container">
					<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
				</div>
			</el-form-item>
			<el-form-item label="新闻大图" prop="title">
				<!--<el-upload class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" 
				:on-remove="handleRemove" :before-remove="beforeRemove" :on-progress="getfileName" 
				:multiple="false" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :before-upload="beforeAvatarUpload">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>-->
				<el-upload
				action="https://jsonplaceholder.typicode.com/posts/"
				list-type="picture-card" class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				:on-preview="handlePreview"
				:on-remove="handleRemove" :before-remove="beforeRemove" :on-progress="getfileName" :multiple="false" :limit="1" 
				:on-exceed="handleExceed" :file-list="fileList" :before-upload="beforeAvatarUpload">
				<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</el-form-item>
			<el-form-item label="新闻简介" prop="newsQuote">
				<el-input v-model="temp.newsQuote" />
			</el-form-item>
			<el-form-item label="新闻标题" prop="newsTitle">
				<el-input v-model="temp.newsTitle" />
			</el-form-item>
			<el-form-item label="新闻类型" prop="newsTypeId">
				<!--<el-input v-model="temp.newsTypeId" />-->
				<el-select v-model="temp.newsTypeId" placeholder="请选择">
					<el-option v-for="item in newsType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="新闻跳转地址" prop="url">
				<el-input v-model="temp.url" />
			</el-form-item>
		</el-form>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createData">添加新闻</el-button>
	</div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "./components/EditorImage";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
import { fetchList } from "@/api/article";
import axios from 'axios';
import Qs from 'qs'
// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
	"https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";

export default {
	name: "editNews",
	components: { editorImage },
	props: {
		id: {
			type: String,
			default: function() {
				return (
					"vue-tinymce-" +
					+new Date() +
					((Math.random() * 1000).toFixed(0) + "")
				);
			}
		},
		value: {
			type: String,
			default: ""
		},
		toolbar: {
			type: Array,
			required: false,
			default() {
				return [];
			}
		},
		menubar: {
			type: String,
			default: "file edit insert view format table"
		},
		height: {
			type: [Number, String],
			required: false,
			default: 360
		},
		width: {
			type: [Number, String],
			required: false,
			default: "auto"
		}
	},
	data() {
		return {
			url: "https://www.zhongjubang.com/test/",
			fileList: [],
			hasChange: false,
			hasInit: false,
			tinymceId: this.id,
			fullscreen: false,
			languageTypeList: {
				en: "en",
				zh: "zh_CN",
				es: "es_MX",
				ja: "ja"
			},
			form: {
				newsTypeId: "",
				newsTitle: ""
			},
			dialogImageUrl: "",
			dialogVisible: false,
			dialogFormVisible: false,
			temp: {
				newsId: "",
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			},
			newsType: [
				{
					id: '1',
					label: '官网新闻'
				},
				{
					id: '2',
					label: '小程序新闻官网'
				}
			],
			rules: {
				// newsContent: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }] ,
				newsQuote: [{ required: true, message: '请输入新闻简介', trigger: 'blur' }],
				newsTitle: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
				newsTypeId: [{ required: true, message: '请输入新闻类型', trigger: 'blur' }],
				url: [{ required: true, message: '请输入新闻跳转地址', trigger: 'blur' }]
			},
			detailId: ''
		};
	},
	created() {
		this.dialogFormVisible = true;
		this.getParams();
	},
	computed: {
		containerWidth() {
			const width = this.width;
			if (/^[\d]+(\.[\d]+)?$/.test(width)) {
				// matches `100`, `'100'`
				return `${width}px`;
			}
			return width;
		}
	},
	watch: {
		value(val) {
			// console.log(val);
			if (!this.hasChange && this.hasInit) {
				this.$nextTick(() =>
					window.tinymce.get(this.tinymceId).setContent(val || "")
				);
			}
		}
	},
	mounted() {
		this.init();
		this.newId = this.$route.query.newsId;
		this.getNewsDetail(this.newId);
	},
	activated() {
		if (window.tinymce) {
			this.initTinymce();
		}
	},
	deactivated() {
		this.destroyTinymce();
	},
	destroyed() {
		this.destroyTinymce();
	},
	methods: {
		getNewsDetail(id) {
			// console.log(this.newId)
			console.log(id)
			this.Axios.post(this.url + "/admin/applet/getnewsdetailbyid", Qs.stringify({newId: id}))
			// this.Axios.post(this.url + "/admin/applet/getnewsdetailbyid", {newId: id})
				.then(res => {
					// console.log(res)
					if(res.data.code == 200) {
						var data = res.data.data;
						// console.log(res.data.data)
						this.temp = {
							// newsId: res.data.data.id,
							newsContent: res.data.data.newsContent,
							newsQuote: res.data.data.newsQuote,
							newsTitle: res.data.data.newsTitle,
							newsTypeId: res.data.data.newsTypeId.toString(),
							url: res.data.data.url
						};
						// var imageUrl = data.newsImg;
						// var index = imageUrl.lastIndexOf("/");
						var obj = {
							name: res.data.data.newsImg.split("/").pop(),
							url: res.data.data.newsImg
						}
						this.fileList.push(obj)
						console.log(this.fileList)
					}
				})
		},
		getParams: function() {
			// 取到路由带过来的参数
			var routerParams = this.$route.query.newsId
			// 将数据放在当前组件的数据内
			// console.log("传来的参数==" + routerParams)
			this.textareText = routerParams;
			this.temp.newsId = routerParams;
			// console.log(routerParams)
			
		},
		getfileName(file, fileList) {
			// console.log(fileList.name);
			this.fileList.name = fileList.name
		},
		handleRemove(file, fileList) {
			console.log(fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		handleExceed(files, fileList) {
			// this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			this.$message.warning('只能上传一张图片')
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${file.name}？`);
		},
		init() {
			// dynamic load tinymce from cdn
			load(tinymceCDN, err => {
				if (err) {
					this.$message.error(err.message);
					return;
				}
				this.initTinymce();
			});
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			console.log(file.name);
			// console.log(file.url.name)
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 设置上传图片格式
		beforeAvatarUpload(file) {
			var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type)
			if (!testmsg) {
				this.$message.error('上传图片格式不对!')
				return
			}
		},
		createData(file, fileList) {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					// this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id

					const url = this.url;
					// const fileName = this.fileList.name
					// console.log(this.temp.newsId);
					// console.log(this.value);
					// console.log(this.fileList.name);
					// console.log(this.temp.newsQuote);
					// console.log(this.temp.newsTitle);
					// console.log(this.temp.newsTypeId);
					// console.log(this.temp.url);
					if(this.value == '' || this.value == undefined || this.value == null ) {
						 this.$message.error('请填写新闻内容');
						 return;
					}
					if(this.fileList.name == '' || this.fileList.name == undefined || this.fileList.name == null ) {
						this.$message.error('请上传新闻大图');
						return;
					}
					this.dialogFormVisible = true;
					var parmas = {
						newsContent: this.value,
						newsImg: this.fileList.name,
						newsQuote: this.temp.newsQuote,
						newsTitle: this.temp.newsTitle,
						newsTypeId: this.temp.newsTypeId,
						newsId: this.temp.newsId,
						url: this.temp.url
					}
					this.Axios.post(url + "/admin/offcial/updatenews", Qs.stringify({parmas})).then(res => {
						console.log(res);
						if (res.status == 200) {
							this.$notify({
				              	title: 'Success',
				              	message: '添加成功',
				              	type: 'success',
				              	duration: 1000
				            });
                            if(this.temp.newsTypeId == 1) {
								this.$router.push('../../table/complex-table');
							} else {
								this.$router.push('../../table/office-web');
							}
						}
					});
				} else {
					console.log(this.dataForm);
				}
			});
		},
		initTinymce() {
			const _this = this;
			window.tinymce.init({
				selector: `#${this.tinymceId}`,
				language: this.languageTypeList["zh"],
				height: this.height,
				body_class: "panel-body ",
				object_resizing: false,
				toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
				menubar: this.menubar,
				plugins: plugins,
				end_container_on_empty_block: true,
				powerpaste_word_import: "clean",
				code_dialog_height: 450,
				code_dialog_width: 1000,
				advlist_bullet_styles: "square",
				advlist_number_styles: "default",
				imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
				default_link_target: "_blank",
				link_title: false,
				nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
				init_instance_callback: editor => {
					if (_this.value) {
						editor.setContent(_this.value);
					}
					_this.hasInit = true;
					editor.on("NodeChange Change KeyUp SetContent", () => {
						this.hasChange = true;
						this.$emit("input", editor.getContent());
					});
				},
				setup(editor) {
					editor.on("FullscreenStateChanged", e => {
						_this.fullscreen = e.state;
					});
				}
				// 整合七牛上传
				// images_dataimg_filter(img) {
				//   setTimeout(() => {
				//     const $image = $(img);
				//     $image.removeAttr('width');
				//     $image.removeAttr('height');
				//     if ($image[0].height && $image[0].width) {
				//       $image.attr('data-wscntype', 'image');
				//       $image.attr('data-wscnh', $image[0].height);
				//       $image.attr('data-wscnw', $image[0].width);
				//       $image.addClass('wscnph');
				//     }
				//   }, 0);
				//   return img
				// },
				// images_upload_handler(blobInfo, success, failure, progress) {
				//   progress(0);
				//   const token = _this.$store.getters.token;
				//   getToken(token).then(response => {
				//     const url = response.data.qiniu_url;
				//     const formData = new FormData();
				//     formData.append('token', response.data.qiniu_token);
				//     formData.append('key', response.data.qiniu_key);
				//     formData.append('file', blobInfo.blob(), url);
				//     upload(formData).then(() => {
				//       success(url);
				//       progress(100);
				//     })
				//   }).catch(err => {
				//     failure('出现未知问题，刷新页面，或者联系程序员')
				//     console.log(err);
				//   });
				// },
			});
		},
		destroyTinymce() {
			const tinymce = window.tinymce.get(this.tinymceId);
			if (this.fullscreen) {
				tinymce.execCommand("mceFullScreen");
			}

			if (tinymce) {
				tinymce.destroy();
			}
		},
		setContent(value) {
			window.tinymce.get(this.tinymceId).setContent(value);
		},
		getContent() {
			window.tinymce.get(this.tinymceId).getContent();
		},
		imageSuccessCBK(arr) {
			const _this = this;
			arr.forEach(v => {
				window.tinymce
					.get(_this.tinymceId)
					.insertContent(`<img class="wscnph" src="${v.url}" >`);
			});
		}
	}
};
</script>

<style scoped>
.tinymce-container {
	position: relative;
	line-height: normal;
}

.tinymce-container>>>.mce-fullscreen {
	z-index: 10000;
}

.tinymce-textarea {
	visibility: hidden;
	z-index: -1;
}

.editor-custom-btn-container {
	position: absolute;
	right: 4px;
	top: 4px;
	/*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
	z-index: 10000;
	position: fixed;
}

.editor-upload-btn {
	display: inline-block;
}
</style>
