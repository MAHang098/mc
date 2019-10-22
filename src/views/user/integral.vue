<template>
	<div class="app-container">
		<div class="filter-container">
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="id" label="ID" width="80"></el-table-column>
				<el-table-column prop="integralLog" label="用户日志明细" width="340"></el-table-column>
				<el-table-column prop="integralValue" label="增加多少" min-width="20%"></el-table-column>
				<el-table-column prop="state" label="状态" width="220"></el-table-column>
				<el-table-column prop="createBy" label="创建人" width="220"></el-table-column>
				<el-table-column prop="updateBy" label="修改人" width="220"></el-table-column>
				<el-table-column prop="updateTime" label="修改时间" width="220"></el-table-column>
			</el-table>
			<!--渲染数据 end-->

			<!--分页 start-->
			<div class="block">
				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
			</div>
			<!--分页 end-->
		</div>
	</div>
</template>


<script>
import { fetchList, fetchPv, createArticle, updateArticle } from "@/api/article";
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
			pageTotal: 1,
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
			this.pageSize = `${val}`;
			this.getInfo()
		},
		// 修改当前页
		handleCurrentChange(val) {
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		getInfo() {
			const url = "https://www.zhongjubang.com/test/";
			var parmas = {
				newsType: this.newsType,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				search: this.search
			}
			this.Axios.post(url + "/admin/applet/getalluserintegrallog", parmas)
				.then(res => {
					if (res.status == 200) {
						this.loading = false;
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
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
		}
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
