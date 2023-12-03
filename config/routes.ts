export default [
  { path: '/', name: '主页', icon: 'smile', component: './Index' },
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo'  ,hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' }
    ],

  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { name: '接口管理', icon: 'table', path: '/admin/interface_info', component: './Admin/interface_info' },
      { name: '接口分析', icon: 'analysis', path: '/admin/interface_analysis', component: './Admin/interfaceAnalysis' },
      { path: '/admin/user-manage', name: '用户管理', icon: 'smile', component: './Admin/UserManage' },
    ],
  },
  { path: '/info', name: '个人中心', icon: 'UserOutlined', component: './User/Info' },

  // { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
