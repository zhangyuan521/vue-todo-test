const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV == 'development'
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')

const config = {
    target: 'web', 
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'] 
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|gif|jpeg|png|svg)$/,
                use: [
                    {
                        loader:'url-loader',
                        options:{
                            'limit':1024 ,
                            'name':'[name]-aaa.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ]
}

if(isDev){
    config.devtool = '#cheap-module-eval-source-map';
    config.module.rules.push({
        test: /\.stylus$/,
        use:[
            'style-loader',
            'css-loader',
            {
                loader:'postcss-loader',
                options:{
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.devServer = {
        port: '8000',
        host: '0.0.0.0',
        overlay: {  // webpack编译出现错误，则显示到网页上
            errors: true,
        },
        //open: true,
        //historyFallback: {}

        // 不刷新热加载数据
        hot: true
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{
    //单独打包类库（这类文件变化较少，没有必要和业务逻辑参合到一块）
    config.entry = {
        app: path.join(__dirname, 'src/index.js')
    }
    config.output.filename = '[name].[chunkhash].js'
    config.module.rules.push({
        test: /\.styl/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'stylus-loader'
            ]
        })
    });
    config.plugins.push(
        new ExtractPlugin('styles.[chunkhash:8].css')
    );


    config.optimization = {
        splitChunks: {
            cacheGroups: {                  // 这里开始设置缓存的 chunks
                commons: {
                    chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    minSize: 0,             // 最小尺寸，默认0,
                    minChunks: 2,           // 最小 chunk ，默认1
                    maxInitialRequests: 5   // 最大初始化请求书，默认1
                },
                vendor: {
                    test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
                    chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
                    priority: 10,           // 缓存组优先级
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }
}

module.exports = config