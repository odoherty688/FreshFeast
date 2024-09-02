module.exports={
    "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
    "plugins": [],
    "transform": {
        "\\.[jt]sx?$": "babel-jest",
        "\\.css$": "identity-obj-proxy",
      }
    }