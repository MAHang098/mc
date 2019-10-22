<template>
	<div class="app-container">
		<div class="filter-container">
			<!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addNews">添加新闻</el-button>-->
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<!--<el-table-column prop="newsId" label="ID" width="40"></el-table-column>-->
				<!--<Tinymce newsId='ID'></Tinymce>-->
				<el-table-column prop="realName" label="真实名字" width="100"></el-table-column>
				<el-table-column prop="businessCardPic" label="名片照片" width="220">
					<template scope="scope">
						<img :src="scope.row.businessCardPic" width="100" height="150" class="head_pic" />
					</template>
				</el-table-column>
				
				
				<el-table-column prop="nickName" label="昵称"></el-table-column>
				<el-table-column prop="companyName" label="公司名"> </el-table-column>
				<el-table-column prop="IdCardSubmitTime" label="提交时间"></el-table-column>
				<el-table-column prop="IdCardRewardStatus" label="奖励状态" :formatter="rewardState"></el-table-column>
				<el-table-column prop="IdCardCheckStatus" label="审核状态" :formatter="auditState"></el-table-column>
				
			</el-table>

		
			<!--分页 start-->
			<div class="block">

				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
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
			loading: true,
			// textarea2: "",
			// textMap: {
			// 	update: "Edit",
			// 	create: "Create"
			// },
			// temp: {
			// 	newsContent: "",
			// 	newsImg: "",
			// 	newsQuote: "",
			// 	newsTitle: "",
			// 	newsTypeId: "",
			// 	url: ""
			// },
			// temp2: {
			// 	newsId: "",
			// 	newsContent: "",
			// 	newsImg: "",
			// 	newsQuote: "",
			// 	newsTitle: "",
			// 	newsTypeId: "",
			// 	url: ""
			// },
			// newsContent: "",
			// dialogStatus: "",
			// dialogFormVisible: false,
			// rules: {
			// 	newsTitle: [
			// 		{ required: true, message: "title is required", trigger: "blur" }
			// 	]
			// },
			//   pageSize: [10, 20, 30]
			pageTotal: 1,
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
		// 奖励状态
		rewardState(row) {
			return row.IdCardRewardStatus == 1 ? '已领取' : '未领取'
		},
		// 审核状态
		auditState(row) {
			if(row.IdCardCheckStatus == 1) {
				return '待审核'
			} else if(row.IdCardCheckStatus == 2) {
				return '已审核'
			} else {
				return '审核不通过'
			}
		},
		getInfo() {
			const url = "https://www.zhongjubang.com/test/";
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.Axios.post(url + "/admin/applet/getusernamecard", parmas)
				.then(res => {
					// console.log(res);
					// console.log(res.status);
					// console.log(res.data.data.dataList);
					// 

					if (res.status == 200) {
						this.loading = false;
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
		},
	// 	resetTemp() {
	// 		this.temp = {
	// 			newsContent: "",
	// 			newsImg: "",
	// 			newsQuote: "",
	// 			newsTitle: "",
	// 			newsTypeId: "",
	// 			url: ""
	// 		};
	// 	},
	// 	resetTemp2() {
	// 		this.temp2 = {
	// 			newsId: "",
	// 			newsContent: "",
	// 			newsImg: "",
	// 			newsQuote: "",
	// 			newsTitle: "",
	// 			newsTypeId: "",
	// 			url: ""
	// 		};
	// 	},
	// 	handleCreate() {
	// 		this.resetTemp();
	// 		this.dialogStatus = "create";
	// 		this.dialogFormVisible = true;
	// 		this.$nextTick(() => {
	// 			this.$refs["dataForm"].clearValidate();
	// 		});
	// 	},
	// 	createData() {
	// 		this.$refs["dataForm"].validate(valid => {
	// 			if (valid) {
	// 				// this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
	// 				const url = "http://www.zhongjubang.com/test/";

	// 				this.Axios.post(url + "/admin/offcial/addnews", {
	// 					newsContent: this.temp.newsContent,
	// 					newsImg: this.temp.newsImg,
	// 					newsQuote: this.temp.newsQuote,
	// 					newsTitle: this.temp.newsTitle,
	// 					newsTypeId: this.temp.newsTypeId,
	// 					url: this.temp.url
	// 				}).then(res => {
	// 					console.log(res);
	// 					if (res.status == 200) {
	// 						console.log("上传成功");
	// 					}
	// 				});
	// 			}
	// 		});
	// 	},
	// 	delNews(row) {
	// 		console.log(row.newsId);

	// 		const url = "http://www.zhongjubang.com/test/";

	// 		this.Axios.post(url + "/admin/offcial/delnews", {
	// 			newsId: row.newsId
	// 		}).then(res => {
	// 			console.log(res);
	// 			if (res.status == 200) {
	// 				console.log("成功删除");
	// 			} else {
	// 				console.log(res.code);
	// 				if (res.code == 400) {
	// 					console.log("请求异常");
	// 				} else if (res.code == 401) {
	// 					console.log("参数为空");
	// 				} else if (res.code == 402) {
	// 					console.log("对象已存在");
	// 				} else if (res.code == 403) {
	// 					console.log("电话号码已存在");
	// 				} else if (res.code == 404) {
	// 					console.log("对象不存在(查询对象时用)");
	// 				} else if (res.code == 405) {
	// 					console.log("短信、邮件、消息发送失败");
	// 				} else if (res.code == 406) {
	// 					console.log("预期相反最终结果");
	// 				} else if (res.code == 407) {
	// 					console.log("验证、认证失败");
	// 				} else if (res.code == 408) {
	// 					console.log("参数错误");
	// 				} else if (res.code == 411) {
	// 					console.log("数据为空||结果为空||对象为空 (查询结果数据时用)");
	// 				} else if (res.code == 421) {
	// 					console.log("token过期或者无效");
	// 				} else if (res.code == 422) {
	// 					console.log("系统错误");
	// 				}
	// 			}
	// 		});
	// 	},
	// 	handleUpdate(row) {
	// 		this.$router.push({
	// 	        path:'../../components/editNews',
	// 	        query:{nameId:row.newsId}
	//       	})
	// 	},
	// 	updateData() {
	// 		this.$refs['dataForm'].validate((valid) => {
	// 			if (valid) {
	// 				const tempData = Object.assign({}, this.temp2)
	// 				const url = 'http://www.zhongjubang.com/test/'
	// 				// console.log(tempData)
	// 				this.Axios.post(url + "/admin/applet/updatenews", {
	// 					newsContent: this.temp2.newsContent,
	// 					newsImg: this.temp2.newsImg,
	// 					newsQuote: this.temp2.newsQuote,
	// 					newsTitle: this.temp2.newsTitle,
	// 					newsTypeId: this.temp2.newsTypeId,
	// 					url: this.temp2.url
	// 				}).then(res => {
	// 					console.log(res);
	// 					if (res.status == 200) {
	// 						console.log("上传成功");
	// 					}
	// 				});
	// 			}
	// 		})

	// 	},
	// 	gotoCreate() {
	// 		this.$router.replace('/table/inline-edit-table')
	// 	},
	// 	addNews() {
	// 		this.$router.replace('../../components/addNews');
	// 	}
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
