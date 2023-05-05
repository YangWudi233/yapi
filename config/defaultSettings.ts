import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',//'light',
  layout: 'topmenu',
  splitMenus: true,
  primaryColor: '#13C2C2',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '乐天接口', // 菜单栏标题
  pwa: false,
  logo: '/logo.jpg', // 菜单栏图标
  iconfontUrl: '',
};
export default Settings;


