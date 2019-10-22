<template>
  <div class="components-container">
    <!--欢迎使用 start-->
    <div class="editor-content" v-html="content" />
     <!--欢迎使用 end-->
    <!--<aside>
      Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.
      <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/component/rich-editor.html">Documentation</a>
    </aside>-->
    
    <div>
      <!--<addNewsText v-model="content" :height="300" />-->
    </div>
 
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import addNewsText from '@/views/news/addNewsText'

export default {
  name: 'addNews',
  components: { addNewsText },
  data() {
    return {
      content: ``
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>

