module.exports = {
  env: {
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8.11',
            },
          },
        ],
      ],
    },

    esm: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8.11',
              browsers: ['last 2 versions', 'not ie 1-11', 'not android > 0'],
            },
            modules: false,
          },
        ],
      ],
    },

    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8.11',
            },
          },
        ],
      ],
    },
  },
};
