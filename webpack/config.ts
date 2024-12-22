import HtmlWebpackPlugin from 'html-webpack-plugin'
import { resolve } from 'path'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import { getBaseUrl, getIsDevelopment, getIsMocksOn, getIsProduction, getProxy, host, port } from './settings'
import { WebpackArgs } from './typings'

export default (_: object, args: WebpackArgs): Configuration => {
  const isDevelopment = getIsDevelopment(args)
  const isProduction = getIsProduction(args)
  const isMocksOn = getIsMocksOn(args)
  const baseUrl = getBaseUrl(args)
  const proxy = getProxy(args)
  return {
    entry: resolve('src/entry'),
    output: {
      path: resolve('dist'),
      filename: '[fullhash].js',
      clean: true,
    },
    performance: {
      hints: false,
    },
    stats: 'errors-warnings',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: isProduction
            ? [
                {
                  loader: 'babel-loader',
                  options: {
                    plugins: ['@emotion/babel-plugin'],
                  },
                },
                'ts-loader',
              ]
            : 'ts-loader',
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
          generator: {
            filename: '[hash].[ext]',
          },
        },
      ],
    },
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      host,
      port,
      proxy,
      historyApiFallback: true,
    },
    plugins: [
      new DefinePlugin({ isMocksOn, baseUrl }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
      }),
    ],
  }
}
