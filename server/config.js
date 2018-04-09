const CONF = {
  port: '5757',
  rootPathname: '',

  // 微信小程序 App ID
  appId: 'wx438087004b83c83d',

  // 微信小程序 App Secret
  appSecret: '3d5d13e46f8461b76fdbc8bb1d007e4a',

  // 是否使用腾讯云代理登录小程序
  useQcloudLogin: true,

  /**
   * MySQL 配置，用来存储 session 和用户信息
   * 若使用了腾讯云微信小程序解决方案
   * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
   */
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'cAuth',
    pass: '',
    char: 'utf8mb4'
  },

  cos: {
    /**
     * 地区简称
     * @查看 https://cloud.tencent.com/document/product/436/6224
     */
    region: 'ap-guangzhou',
    // Bucket 名称
    fileBucket: 'qcloudtest',
    // 文件夹
    uploadFolder: ''
  },
  serverHost: 'localhost',
  tunnelServerUrl: '',
  tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
  // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
  qcloudAppId: '1252661885',
  qcloudSecretId: 'AKIDwo6KRMWmD5oQL97EZjjYBdx76yfBb6NS',
  qcloudSecretKey: '3weYhu21pSuXBg0A9xUt7A6vaBpMFyZz',
  wxMessageToken: 'weixinmsgtoken',
  networkTimeout: 30000
}

module.exports = CONF;
