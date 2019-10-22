<template>
  <div class="components-container">
    <!--欢迎使用 start-->
    <div class="editor-content" v-html="content" style="display: none"/>
     <!--欢迎使用 end-->
   
    
    <div>
      <editBrandText v-model="content" :height="300" />
    </div>
 
  </div>
</template>

<script>
import editBrandText from './editBrandText'

export default {
  name: 'editBrand',
  components: { editBrandText },
  data() {
    return {
      content: ``
    }
   
  },
  methods: {
    
  },
  mounted() {
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>