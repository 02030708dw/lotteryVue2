// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    globals: {
        _M: true,
        moment: true,
        eruda: true,
        define: true,
        DIRECT_LOGO: true,
        DIRECT_TITLE: true,
        USER_LANG: true,
        CDN: true,
        startTime: true,
        LANG_C_STAMP: true,
        RmUserInfo: true,
        LOTTERY_MENU: true,
        MY_FAVORITES: true,
        POPULAR_ENTRIES: true,
        TweenMax: true,
        PIXI: true,
        Hls: true,
        Power0: true
    },
    // required to lint *.vue files
    plugins: [
        'html', 'vue'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "space-before-function-paren": ["error", {
            "anonymous": "ignore",
            "named": "ignore",
            "asyncArrow": "ignore"
        }],
        'indent': [2, 4, { "SwitchCase": 1 }],
        'eol-last': [0, "always"],
        'no-useless-constructor': 0,
        "no-unused-vars": [1, { "vars": "all", "args": "after-used" }],
        'spaced-comment': [0, "never"],
        //駝峰命名
        'camelcase': 0,
        //tabs
        "disallowTabs": 0,
        'no-extra-boolean-cast': 0,
        'no-throw-literal': 0
    }
}