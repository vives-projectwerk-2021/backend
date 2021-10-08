const path = require('path');
const dotenv = require('dotenv')

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, './frontend_test/app.ts'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, '/frontend/public'),
        watchContentBase: true,
        proxy:{
            '/api' :{
                target :process.env.SERVER_URL || 'http://localhost:42069',
                pathRewrite: {'^/api': ''}
            }
        }
    }
};
