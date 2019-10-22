<template>
    <div class="block">
        <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        
    }
}
</script>

