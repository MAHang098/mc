<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加新闻</el-button>
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba">
				<el-table-column prop="newsId" label="ID" width="40"></el-table-column>
				<!--<Tinymce newsId='ID'></Tinymce>-->
				<el-table-column prop="newsContent" label="新闻内容" width="340"></el-table-column>
				<el-table-column prop="newsImg" label="图片" min-width="20%">
					<!-- 显示图片 -->
					<template scope="scope">
						<img :src="scope.row.newsImg" width="100%" height="100%" class="head_pic" />
					</template>
				</el-table-column>
				<el-table-column prop="newsQuote" label="新闻简介" width="220"></el-table-column>
				<el-table-column prop="newsTitle" label="新闻标题" width="220"></el-table-column>
				<!-- <el-table-column prop="url" label="跳转地址" width="220"></el-table-column> -->

				<!-- 删除功能 -->
				<el-table-column label="Actions" align="center" width="240" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
						<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="delNews(row)">Delete</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 添加新闻弹框  -->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
				<el-form ref="dataForm" :rules="rules" label-position="left" :model="temp" label-width="100px" style="width: 400px; margin-left:50px;">
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
					<el-form-item label="	新闻类型" prop="title">
						<el-input v-model="temp.newsTypeId" />
					</el-form-item>
					<el-form-item label="	新闻跳转地址" prop="title">
						<el-input v-model="temp.url" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">Cancel</el-button>
					<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
				</div>
			</el-dialog>

			<!--分页 start-->
			<!--<el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>-->
			<div class="block">

				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="100" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
			</div>
			<!--分页 end-->
		</div>
	</div>
</template>


<script>
import {
	fetchList,
	fetchPv,
	createArticle,
	updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import https from "../../../https.js"; // 注意用自己的路径
// import Tinymce from "/components/Tinymce"
// import Tinymce from 'components/Tinymce'
export default {
	name: "table",
	data() {
		return {
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			textarea2: "",
			textMap: {
				update: "Edit",
				create: "Create"
			},
			temp: {
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			},
			temp2: {
				newsId: "",
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			},
			newsContent: "",
			dialogStatus: "",
			dialogFormVisible: false,
			rules: {
				newsTitle: [
					{ required: true, message: "title is required", trigger: "blur" }
				]
			},
			//   pageSize: [10, 20, 30]
			pageTotal: null,
			currentPage2: 1,

		};
	},
	// 获取新闻数据
	mounted() {
		this.getInfo();
		this.getInput();
	},
	methods: {
		// 修改每页条数
		handleSizeChange(val) {
			// console.log(`每页 ${val} 条`);
			this.pageSize = `${val}`;
			this.getInfo()
		},
		// 修改当前页
		handleCurrentChange(val) {
			// console.log(`当前页: ${val}`);
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		getInfo() {
			const url = "https://www.zhongjubang.com/test/";
			// var newsType = this.newsType;
			// var pageIndex = this.pageIndex;
			// var pageSize = this.pageSize;
			// var search = this.search;
			// if(currentpage) {
			// 	pageIndex = currentpage;
			// }
			// if (pagesize) {
			// 	pageSize = pagesize;
			// }
			var parmas = {
				newsType: this.newsType,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				search: this.search
			}
			this.Axios.post(url + "/controller/offcialweb/getoffcialwebnews", parmas)
				.then(res => {
					// console.log(res);
					// console.log(res.status);
					// console.log(res.data.data.dataList);
					// 

					if (res.status == 200) {
						const tableData = res.data.data.dataList;
						//   console.log(tableData);
						this.tableData = tableData;
						//   console.log(tableData);
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;

					} else {
						console.log(res.code);
						if (res.code == 400) {
							console.log("请求异常");
						} else if (res.code == 401) {
							console.log("参数为空");
						} else if (res.code == 402) {
							console.log("对象已存在");
						} else if (res.code == 403) {
							console.log("电话号码已存在");
						} else if (res.code == 404) {
							console.log("对象不存在(查询对象时用)");
						} else if (res.code == 405) {
							console.log("短信、邮件、消息发送失败");
						} else if (res.code == 406) {
							console.log("预期相反最终结果");
						} else if (res.code == 407) {
							console.log("验证、认证失败");
						} else if (res.code == 408) {
							console.log("参数错误");
						} else if (res.code == 411) {
							console.log("数据为空||结果为空||对象为空 (查询结果数据时用)");
						} else if (res.code == 421) {
							console.log("token过期或者无效");
						} else if (res.code == 422) {
							console.log("系统错误");
						}
					}
				});
		},
		getInput() {
			const item = this.textarea2;
			console.log(item);
		},
		resetTemp() {
			this.temp = {
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			};
		},
		resetTemp2() {
			this.temp2 = {
				newsId: "",
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			};
		},
		handleCreate() {
			this.resetTemp();
			this.dialogStatus = "create";
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs["dataForm"].clearValidate();
			});
		},
		createData() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					// this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
					const url = "http://www.zhongjubang.com/test/";

					this.Axios.post(url + "/admin/offcial/addnews", {
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
				}
			});
		},
		delNews(row) {
			console.log(row.newsId);

			const url = "http://www.zhongjubang.com/test/";

			this.Axios.post(url + "/admin/offcial/delnews", {
				newsId: row.newsId
			}).then(res => {
				console.log(res);
				if (res.status == 200) {
					console.log("成功删除");
				} else {
					console.log(res.code);
					if (res.code == 400) {
						console.log("请求异常");
					} else if (res.code == 401) {
						console.log("参数为空");
					} else if (res.code == 402) {
						console.log("对象已存在");
					} else if (res.code == 403) {
						console.log("电话号码已存在");
					} else if (res.code == 404) {
						console.log("对象不存在(查询对象时用)");
					} else if (res.code == 405) {
						console.log("短信、邮件、消息发送失败");
					} else if (res.code == 406) {
						console.log("预期相反最终结果");
					} else if (res.code == 407) {
						console.log("验证、认证失败");
					} else if (res.code == 408) {
						console.log("参数错误");
					} else if (res.code == 411) {
						console.log("数据为空||结果为空||对象为空 (查询结果数据时用)");
					} else if (res.code == 421) {
						console.log("token过期或者无效");
					} else if (res.code == 422) {
						console.log("系统错误");
					}
				}
			});
		},
		handleUpdate(row) {

			this.temp2 = Object.assign({}, row)
			this.resetTemp2();
			this.temp2.newsId = row.newsId
			this.dialogStatus = "edit";
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs["dataForm"].clearValidate();
			});
			console.log(row.newsId);
			const rows = row.newsId;
			//生产环境
			// const url = 'http://www.zhongjubang.com/api/'


		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp2)
					const url = 'http://www.zhongjubang.com/test/'
					// console.log(tempData)
					this.Axios.post(url + "/admin/applet/updatenews", {
						newsContent: this.temp2.newsContent,
						newsImg: this.temp2.newsImg,
						newsQuote: this.temp2.newsQuote,
						newsTitle: this.temp2.newsTitle,
						newsTypeId: this.temp2.newsTypeId,
						url: this.temp2.url
					}).then(res => {
						console.log(res);
						if (res.status == 200) {
							console.log("上传成功");
						}
					});
				}
			})

		},
		gotoCreate() {
			this.$router.replace('/table/inline-edit-table')
		}
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
