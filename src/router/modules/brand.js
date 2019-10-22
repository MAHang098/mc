import Layout from '@/layout'

const brandRouter = {
  path: '/brand',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '品牌管理',
    icon: 'component'
  },
  children: [
    {
      path: 'brand',
      component: () => import('@/views/brand/brand'),
      name: 'brand',
      meta: { title: '品牌管理' }
    },
    {
      path: 'addBrand',
      component: () => import('@/views/brand/addBrand'),
      name: 'addBrand',
      meta: { title: '新增品牌' },
      hidden: true
    },
    {
      path: 'addBrandText',
      component: () => import('@/views/brand/addBrandText'),
      name: 'addBrandText',
      meta: { title: '品牌富文本' },
      hidden: true
    },
    {
      path: 'editBrand',
      component: () => import('@/views/brand/editBrand'),
      name: 'editBrand',
      meta: { title: '编辑品牌' },
      hidden: true
    },
    {
      path: 'editBrandText',
      component: () => import('@/views/brand/editBrandText'),
      name: 'editBrandText',
      meta: { title: '编辑品牌内容' },
      hidden: true
    }
  ]
}

export default brandRouter