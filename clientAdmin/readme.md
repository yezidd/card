# react-start-kit

## 满足日常react脚手架的使用

#### 使用postcss-loader加载autoprefixer

> 官方已经 不推荐使用插件[webpack.loadOptions.plugin](https://doc.webpack-china.org/plugins/loader-options-plugin/)

> 所以在webpack配置文件中使用了内联方式申明postcss配置文件信息

```
    {
                loader: "postcss-loader",
                options: {
                  plugins: () => [autoprefixer({browsers: ['last 2 versions']})]
                }
              }
```

> 写在webpack.loadOptions.plugin中声明

```
    new webpack.loadOptionsPlugin({
            options: {
                            postcss: function() {
                                return [require('autoprefixer')];
                            }
                        }
    })
```

#### 关于url-loader和file-loader关系

> file-loader：解决引用路径的问题;

> url-loader：如果图片较多，会发很多http请求，降低页面性能，url-loader将引入的图片编码，生成dataURL；

> url-loader会提供一个limit参数（单位B），小于limit字节的图片会被转为dataURL，大于limit的会使用file-loader进行copy；outputPath是图片分离后的路径；

> !最新版url-loader不自带file-loader需要自行安装

#### 关于本地git找不到历史加入git的文件

> 通过命令 git pull origin master --allow-unrelated-histories

> 允许历史的文件并入到git分支上

#### 关于webpack-dev-server用proxy代理解决跨域问题

> 只需要在dev-server中声明proxy属性

```
    proxy: {
          '/admin/*': {
            target: 'http://localhost:5757',
            secure: false,
            changeOrigin: true,
            logLevel: "debug",
          },
        }
```

> 上面通过正则匹配,具体的意思是:

> 客户端直接请求/admin/*的地址时，请求会被转发到

> 跟服务端相同的地址:http://localhost:5757/你的api

> 这样就跟服务端同源，劲儿不会产生跨域问题

> secure字段是是否为https链接，验证ssl证书

> changeOrigin字段是changes the origin of the host header to the target URL

> proxy使用了http-proxy-middleware,具体见[文档](https://github.com/chimurai/http-proxy-middleware#options)