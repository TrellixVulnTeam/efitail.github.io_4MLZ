const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const rootDir = path.resolve(__dirname, ".");

module.exports = (env, argv) => {
    const isProd = argv.mode === "production";
    return {
        mode: isProd ? "production" : "development",
        entry: "./src/js/index.ts",
        output: {
            path: path.resolve(__dirname, "./dist"),
            publicPath: "/dist/",
            filename: "build.js"
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            "scss": "vue-style-loader!css-loader!sass-loader",
                            "sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax",
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    }
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]?[hash]"
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        "vue-style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        },
        resolve: {
            extensions: [".ts", ".js", ".vue", ".json"],
            alias: {
                "vue$": "vue/dist/vue.esm.js",
                "@": path.resolve(rootDir, "src"),
                "@res": path.resolve(rootDir, "resources"),
                "@vue": path.resolve(rootDir, "src/js/components")
            }
        },
        devServer: {
            open: true,
            historyApiFallback: true,
            noInfo: true,
            port: 9000,
            host: "0.0.0.0",
            disableHostCheck: true,
        },
        performance: {
            hints: false
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            })
        ]
    }
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "#source-map"
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
