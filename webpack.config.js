const path = require("path");

const config = {
    target: "electron-main",
    devtool: "source-map",
    entry: ['babel-polyfill', "./src/main.ts"],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'sass-loader'],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    node: {
        __dirname: false,
        __filename: false
    }
};

module.exports = (env, argv) => {
    return config;
};