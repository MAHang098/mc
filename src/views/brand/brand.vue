<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addBrand">添加品牌</el-button>
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading" height="680">
				<el-table-column prop="id" label="品牌id" width="80"></el-table-column>
				<!--<el-table-column prop="brandTypeId" label="品牌类型id" width="100"></el-table-column>-->
				
				<el-table-column prop="brandName" label="品牌名" width="220"></el-table-column>
				<!--<el-table-column prop="brandImg" label="品牌图" width="220">
                    <template scope="scope">
						<img :src="scope.row.brandImg" width="100%" height="100%" class="head_pic" />
					</template>
                </el-table-column>-->
				<el-table-column prop="brandIcon" label="品牌图标" width="220">
                    <template scope="scope">
						<img :src="scope.row.brandIcon" width="100%" height="100%" class="head_pic" />
					</template>
                </el-table-column>
				<el-table-column prop="brandLike" label="品牌喜欢数" width="220"></el-table-column>
				<!--<el-table-column prop="brandDetails" label="品牌详情" width="220"></el-table-column>-->
				<el-table-column prop="brandRoyalty" label="品牌分成" width="220"></el-table-column>
				<el-table-column prop="sn" label="排序" width="220"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="220"></el-table-column>

				<!-- 删除功能 -->
				<el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="editBrand(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--渲染数据 end-->
		
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
	name: "brand",
	data() {
		return {
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			loading: true,
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
			this.pageSize = `${val}`;
			this.getInfo()
		},
		// 修改当前页
		handleCurrentChange(val) {
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		// 获取品牌列表
		getInfo() {
			const url = "https://www.zhongjubang.com/test/";
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
			}
			this.Axios.post(url + "/admin/applet/getbrandlist", parmas)
				.then(res => {

					if (res.status == 200) {
						this.loading = false;
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;

					} else {
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
		// 添加品牌
		addBrand() {
			this.$router.push('./addBrand')
		},
		editBrand(row) {
			this.$router.push({
		        path:'./editBrand',
		        query:{brandId:row.id}
	      	})
		}
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
