/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '新闻',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   // meta: { title: 'Dynamic Table' }
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // 修改前的添加新闻
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
     // 修改后的添加新闻
    // {
    //   path: 'tinymce',
    //   component: () => import('@/views/table/tinymce'),
    //   name: 'TinymceDemo',
    //   meta: { title: 'Tinymce' }
    // },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '小程序' }
    },
    {
      path: 'office-web',
      component: () => import('@/views/table/office-web'),
      name: 'officeWeb',
      meta: { title: '官网' }
    },
    // 添加新闻
    // {
    //   path: 'addNews',
    //   component: () => import('@/components/addNews'),
    //   hidden: true,
    //   name: 'addNews',
    //   meta: { title: '添加新闻' }
    // },
    // 编辑新闻
    {
      path: 'editNews',
      component: () => import('@/views/news/editNews'),
      hidden: true,
      name: 'editNews',
      meta: { title: '编辑新闻' }
    }, 
    {
      path: 'addNewsText',
      component: () => import('@/views/news/addNewsText'),
      name: 'addNewsText',
      meta: { title: '添加新闻富文本' },
      hidden: true
    },
    {
      path: 'addNews',
      component: () => import('@/views/news/addNews'),
      hidden: true,
      name: 'addNews',
      meta: { title: '添加新闻' }
    },
    {
      path: 'editNewsText',
      component: () => import('@/views/news/editNewsText'),
      name: 'editNewsText',
      meta: { title: '编辑新闻富文本' },
      hidden: true
    },
  ]
}
export default tableRouter
