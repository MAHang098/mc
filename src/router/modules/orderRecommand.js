import Layout from '@/layout'

const orderRecommand = {
  path: '/order-recommand',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '订单管理',
    icon: 'component'
  },
  children: [
    {
      path: 'recommand',
      component: () => import('@/views/order-manager/recommend'),
      name: 'recommand',
      meta: { title: '推荐订单' }
    }
  ]
}

export default orderRecommand