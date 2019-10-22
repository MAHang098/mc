<template>
    
	<div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
		<el-form  ref="dataForm" :rules="rules" label-position="left" :model="temp" label-width="120px" style="margin-left:50px;">
			<el-form-item label="品牌详情" prop="brandDetails">
				<textarea :id="tinymceId" class="tinymce-textarea" />
				<div class="editor-custom-btn-container">
					<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
				</div>
			</el-form-item>
			<el-form-item label="品牌图" prop="brandImg">
				<el-upload class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				 action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" 
				 :before-remove="beforeRemove" :on-progress="getfileName" :multiple="false" :limit="1" :on-exceed="handleExceed" 
				 :file-list="fileList" :before-upload="beforeAvatarUpload">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>
            <el-form-item label="品牌图标" prop="brandIcon">
				<el-upload class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" 
				:on-remove="handleRemove" :before-remove="beforeRemove" :on-progress="getlogfileName" 
				:multiple="false" :limit="1" :on-exceed="handleExceed" :file-list="logfileList" :before-upload="beforeAvatarUpload">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				
			</el-form-item>
			<el-form-item label="品牌喜欢人数" prop="brandLike">
				<el-input v-model="temp.brandLike" />
			</el-form-item>
			<el-form-item label="品牌人" prop="brandName">
				<el-input v-model="temp.brandName" />
			</el-form-item>
			<el-form-item label="品牌分成" prop="brandRoyalty">
				<el-input v-model="temp.brandRoyalty" />
			</el-form-item>
			<el-form-item label="品牌类型id" prop="brandTypeId">
				<el-input v-model="temp.brandTypeId" />
			</el-form-item>
            <el-form-item label="排序序号" prop="sn">
				<el-input v-model="temp.sn" />
			</el-form-item>
		</el-form>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateData">编辑品牌</el-button>
	</div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "../../components/Tinymce/components/EditorImage";
import plugins from "../../components/Tinymce/plugins";
import toolbar from "../../components/Tinymce/toolbar";
import load from "../../components/Tinymce/dynamicLoadScript";
// import { fetchList } from "@/api/article";
import axios from 'axios';

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
	"https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";

export default {
	name: "commonBrand",
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
			logfileList: [],
			brandId: '',  // 品牌id
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
				brandIcon: "",
				brandImg: "",
				brandDetails: "",
				brandLike: "",
				brandName: "",
				brandRoyalty: "",
				brandTypeId: "",
				sn: ""
			},
			rules: {
				brandLike: [{ required: true, message: '请输入品牌喜欢人数', trigger: 'blur' }] ,
				brandName:  [{ required: true, message: '请输入品牌人', trigger: 'blur' }],
				brandRoyalty:  [{ required: true, message: '请输入品牌分成', trigger: 'blur' }],
				brandTypeId:  [{ required: true, message: '请输入品牌类型id', trigger: 'blur' }],
				sn:  [{ required: true, message: '请输入排序序号', trigger: 'blur' }]
			}
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
		this.brandId = this.$route.query.brandId;
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
		getParams: function() {
			// 取到路由带过来的参数
			var routerParams = this.$route.query.nameId
			// 将数据放在当前组件的数据内
			console.log("传来的参数==" + routerParams)
			this.textareText = routerParams
			// this.temp.newsId = routerParams
		},
        // 品牌图
		getfileName(file, fileList) {
			this.fileList.name = fileList.name
		},
        // 品牌图标
        getlogfileName(file, fileList) {
            this.logfileList.name = fileList.name
        },
		handleChange(file, fileList) {
        	this.fileList = fileList.slice(-3);
      	},
		handleRemove(file, fileList) {
			// console.log(fileList);
			console.log(file)
		},
		handlePreview(file) {
			console.log(file);
		},
		handleExceed(files, fileList) {
			// this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			this.$message.warning('只能上传一张图片')
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${file.name}？`);
		},
		// 设置上传图片格式
		beforeAvatarUpload(file) {
			var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type)
			if (!testmsg) {
				this.$message.error('上传图片格式不对!')
				return
			}
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
		updateData() {
          
            // this.temp = {};
            // this.value = '';
            // this.fileList = [];
            // this.logfileList = [];
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					// this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
					var url = this.url;
					
					// 判断新闻内容是否为空
					if(this.value == '') {
						 this.$message.error('请填写品牌详情');
						 return;
					}
					if(this.fileList.name == '' || this.fileList.name == undefined || this.fileList.name == null ) {
						this.$message.error('请上传品牌图');
						return;
					}
					if(this.logfileList.name == '' || this.logfileList.name == undefined || this.logfileList.name == null ) {
						this.$message.error('请上传品牌图标');
						return;
					}
                    var params = {
                        brandDetails: this.value,
                        brandImg: this.logfileList.name,
						brandIcon: this.fileList.name,
						brandLike: this.temp.brandLike,
						brandName: this.temp.brandName,
						brandRoyalty: this.temp.brandRoyalty,
						brandTypeId: this.temp.brandTypeId,
						sn: this.temp.sn,
						brandId: this.brandId
                    }
					this.dialogFormVisible = true;
					this.Axios.post(url + "/admin/applet/updatebrand",params)
                        .then(res => {
                            console.log(res.data.message);
                            if (res.status == 200) {
                                this.$message.success(res.data.message);
									this.$notify({
						              	title: 'Success',
						              	message: '修改成功',
						              	type: 'success',
						              	duration: 1000
						            });
                                    this.$router.push('./brand');

                            
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