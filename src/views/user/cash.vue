<template>
	<div class="app-container">
		<div class="filter-container">
			
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba">
				
				<el-table-column prop="aliPayName" label="支付宝名" width="160"></el-table-column>
				<el-table-column prop="realName" label="真实姓名" min-width="160"></el-table-column>
				<el-table-column prop="aliPayAccount" label="支付宝账户" width="160"></el-table-column>
				<el-table-column prop="money" label="钱数" width="160"></el-table-column>
				<el-table-column prop="phone" label="手机号" width="160"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
				<el-table-column prop="companyName" label="公司名" width="160"></el-table-column>
				<el-table-column prop="nickname" label="昵称" width="160"></el-table-column>
				<el-table-column prop="state" label="状态" width="160"></el-table-column>
			</el-table>
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

export default {
	name: "Cash",
	data() {
		return {
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			state: "",
			pageTotal: null,
			currentPage2: 1

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
			
			var parmas = {
				state: '0',
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.Axios.post(url + "admin/applet/getuserwithdraw", parmas)
				.then(res => {
					// console.log(res);
					

					if (res.status == 200) {
						const tableData = res.data.data.dataList;
						
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
		
		
		
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
