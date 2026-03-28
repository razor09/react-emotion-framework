import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import { Args } from './typings'
import { entry, getBaseUrl, getIsDevelopment, getIsMocksOn, getIsProduction, getProxy, host, dist as path, port } from './utils'

export default (_: never, args: Args): Configuration => {
  const isDevelopment = getIsDevelopment(args)
  const isProduction = getIsProduction(args)
  const isMocksOn = getIsMocksOn(args)
  const baseUrl = getBaseUrl(args)
  const proxy = getProxy(args)
  return {
    entry,
    output: {
      path,
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
    devtool: isDevelopment && 'source-map',
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
