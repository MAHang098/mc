<template>
  <div class="components-container">
    <!--欢迎使用 start-->
    <div class="editor-content" v-html="content" style="display: none"/>
     <!--欢迎使用 end-->
   
    
    <div>
      <editNewsText v-model="content" :height="300" />
    </div>
 
  </div>
</template>

<script>
import editNewsText from './editNewsText'

export default {
  name: 'editNews',
  components: { editNewsText },
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