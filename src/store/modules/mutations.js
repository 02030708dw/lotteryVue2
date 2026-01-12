//App.js
export const SET_TEMP_DATA = 'SET_TEMP_DATA'
/** 設定初始化 */
export const APP_INIT = 'APP_INIT'
/** 設定環境 */
export const SET_ENV = 'SET_ENV'
/** 設定 RWD 判斷 */
export const SET_RWD_MODE = 'SET_RWD_MODE'
/** 設定漢堡選單的 state 判斷 */
export const SET_HAMBURGAR = 'SET_HAMBURGAR'
/** 設定Select Lock 避免 focus 時被關閉 */
export const SET_SELECT_LOCK = 'SET_SELECT_LOCK'
/** API 取得 用戶餘額 */
export const GET_WALLET_BALANCE = 'GET_WALLET_BALANCE'
/** API 取得 用戶餘額 */
export const SET_OFFSET_GET_BALANCE_NUM = 'SET_OFFSET_GET_BALANCE_NUM'
/** API 取得 LotteryID 及各玩法 */
export const GET_LOTTERY_MENU = 'GET_LOTTERY_MENU'
/** API 取得 各彩種狀態 */
export const GET_LOTTERY_STATUS = 'GET_LOTTERY_STATUS'
/** 設定 用戶餘額 */
export const SET_WALLET_BALANCE = 'SET_WALLET_BALANCE'
/** 設定 LotteryID 及各玩法 */
export const SET_LOTTERY_MENU = 'SET_LOTTERY_MENU'
/** 設定 判斷是否已經取得 LotteryID */
export const SET_LOTTERY_LOAD = 'SET_LOTTERY_LOAD'
/** 設定 漢堡標籤是否改成返回箭頭 */
export const SET_HEADER_NAV_IS_BACK = 'SET_HEADER_NAV_IS_BACK'
/** 設定 768以上 Sidebar 分頁的 index */
export const SET_HEADER_NAV_ACTIVE_NAME = 'SET_HEADER_NAV_ACTIVE_NAME'
/** 取得伺服器時間 */
export const GET_SERVER_TIME = 'GET_SERVER_TIME'
/** 設定伺服器時間 */
export const SET_SERVER_TIME = 'SET_SERVER_TIME'
/** 設定信用官方的開關狀態 */
export const SET_IS_SIN = 'SET_IS_SIN'
/** 載入我的最愛 */
export const GET_MY_FAVORITES = 'GET_MY_FAVORITES'
/** 設定我的最愛 */
export const SET_MY_FAVORITES = 'SET_MY_FAVORITES'
/** 載入熱門遊戲彩種 */
export const GET_POPULAR_ENTRIES = 'GET_POPULAR_ENTRIES'
/** 設定載入熱門遊戲彩種 */
export const SET_POPULAR_ENTRIES = 'SET_POPULAR_ENTRIES'
/** 載入投注紀錄追號紀錄資料 */
export const GET_HISTORY_ORDER = 'GET_HISTORY_ORDER'
/** 清除載入投注紀錄追號紀錄及餘額的計時器 */
export const CLEAR_HISTORY_ORDER_TIMER = 'CLEAR_HISTORY_ORDER_TIMER'
/** 管理頁面資訊視窗 */
export const SET_POP_ACTIVE = 'SET_POP_ACTIVE'
/** 設定當前頁面的meunID */
export const SET_MENU_ID = 'SET_MENU_ID'
/** 設定歷史route path */
export const SET_HISTORY = 'SET_HISTORY'
/** 設定遊戲是否正在離開遊戲 */
export const SET_IS_OUT_GAME = 'SET_IS_OUT_GAME'
/** API 取得所有開獎獎期 */
export const GET_ALL_OPEN_ISSUE = 'GET_ALL_OPEN_ISSUE'
/** 設定所有開獎獎期 */
export const SET_ALL_OPEN_ISSUE = 'SET_ALL_OPEN_ISSUE'
/** 取得所有倒數時間 */
export const GET_ALL_ISSUE = 'GET_ALL_ISSUE'
/** 設定所有獎期 */
export const SET_ALL_ISSUE = 'SET_ALL_ISSUE'
/** 取得所有倒數時間 */
export const GET_FLIP_TIMEER_ALL = 'GET_FLIP_TIMEER_ALL'
/** 設定所有倒數 */
export const SET_FLIP_TIMEER_ALL_DATA = 'SET_FLIP_TIMEER_ALL_DATA'

// MessageBox.js
/** 是否顯示主要 MessageBox */
export const SET_MESSAGE_BOX_DATA = 'SET_MESSAGE_BOX_DATA'

// mask.js
/** 設定遮罩 mask queue */
export const SET_MASK_QUEUE = 'SET_MASK_QUEUE'
/** 刪除最前面的遮罩 */
export const DELETE_MASK = 'DELETE_MASK'

//playinfo.js
/** API 取得 玩法介紹資料 */
export const GET_PLAYINFO_LIST = 'GET_PLAYINFO_LIST'
/** 設定 玩法介紹資料 */
export const SET_PLAYINFO_LIST = 'SET_PLAYINFO_LIST'
/** 設定 玩法介紹顯示的頁面 */
export const SET_PLAYINFO_INDEX = 'SET_PLAYINFO_INDEX'
/** 設定 銷售時間資料 */
export const SET_SALETIME_LIST = 'SET_SALETIME_LIST'
/** 判斷是否載入中 */
export const SET_PLAYINFO_LOAD = 'SET_PLAYINFO_LOAD'

//playinfoNew.js
/** API 取得 玩法介紹新版資料 */
export const GET_PLAYINFO_NEW_LIST = 'GET_PLAYINFO_NEW_LIST'
export const SET_EXAMPLE_TRANS = 'SET_EXAMPLE_TRANS'

// Gameinfo.js
/** API 取得 投注紀錄資料 */
export const GET_GAME_INFO_LIST = 'GET_GAME_INFO_LIST'
/** API 取得 投注紀錄單筆注單資料 */
export const GET_GAME_INFO_DETAIL = 'GET_GAME_INFO_DETAIL'
/** 設定 投注紀錄資料 */
export const SET_GAME_INFO_LIST = 'SET_GAME_INFO_LIST'
/** 設定 投注紀錄資料 Temp*/
export const SET_GAME_TEMP_INFO = 'SET_GAME_TEMP_INFO'
/** 設定投注資料總計 */
export const SET_GAME_INFO_SUM = 'SET_GAME_INFO_SUM'
/** 設定資料並緩存在陣列 */
export const SET_GAME_INFO_DATA = 'SET_GAME_INFO_DATA'
/** 判斷是否載入中 */
export const SET_GAME_INFO_LOAD = 'SET_GAME_INFO_LOAD'
/** 設定 投注紀錄詳情索引 */
export const SET_GAME_INFO_DETAIL_INDEX = 'SET_GAME_INFO_DETAIL_INDEX'
/** 設定 投注紀錄分享索引 */
export const SET_GAME_INFO_SHARE_INDEX = 'SET_GAME_INFO_SHARE_INDEX'
/** 清除暫存資訊 */
export const RESET_GAME_INFO_TEMP = 'RESET_GAME_INFO_TEMP'
/** 清除所有資料 */
export const CLEAR_GAME_INFO_DATA = 'CLEAR_GAME_INFO_DATA'
/** 取得獎期 */
export const GET_GAME_INFO_ISSUE = 'GET_GAME_INFO_ISSUE'
/** 增加獎期 */
export const SET_GAME_INFO_ISSUE = 'SET_GAME_INFO_ISSUE'
/** 分頁顯示頁碼位置 */
export const SET_GAME_INFO_PAGE_NATION_NUM = 'SET_GAME_INFO_PAGE_NATION_NUM'
/** 投注撤單 */
export const ACTION_PROJECT_CANCEL = 'ACTION_PROJECT_CANCEL'
// 投注紀錄取得玩法資料
export const GET_GAME_INFO_CONTROL = 'GET_GAME_INFO_CONTROL'

// Wallet.js
// 取錢包列表
/** 取得列表 */
export const GET_WALLET_LIST = 'GET_WALLET_LIST'
/** 設定列表 */
export const SET_WALLET_LIST = 'SET_WALLET_LIST'
/** 設定是否讀取中 */
export const SET_WALLET_INFO_LOADING = 'SET_WALLET_INFO_LOADING'
/** 清除取得列表紀錄 */
export const CLEAR_WALLET_LIST = 'CLEAR_WALLET_LIST'
/** 分頁顯示位置 */
export const SET_WALLET_INFO_PAGE_NATION_NUM = 'SET_WALLET_INFO_PAGE_NATION_NUM'
/** api body */
export const SET_WALLET_DATA = 'SET_WALLET_DATA'

// AddNewGameInfo.js
/** API 取得 追號紀錄資料 */
export const GET_ADD_NEW_GAME_INFO_LIST = 'GET_ADD_NEW_GAME_INFO_LIST'
/** 設定 追號紀錄資料 */
export const SET_ADD_NEW_GAME_INFO_LIST = 'SET_ADD_NEW_GAME_INFO_LIST'
/** 設定資料並緩存在陣列 */
export const SET_ADD_NEW_GAME_INFO_DATA = 'SET_ADD_NEW_GAME_INFO_DATA'
/** 設定追號資料總計 */
export const SET_ADD_NEW_GAME_INFO_SUM = 'SET_ADD_NEW_GAME_INFO_SUM'
/** 判斷是否載入中 */
export const SET_ADD_NEW_GAME_INFO_LOAD = 'SET_ADD_NEW_GAME_INFO_LOAD'
/** 設定追號詳細資料並緩存在陣列 */
export const SET_ADD_NEW_GAME_INFO_DETAIL_DATA = 'SET_ADD_NEW_GAME_INFO_DETAIL_DATA'
/** 設定追號詳細資料的投注紀錄 */
export const SET_ADD_NEW_GAME_INFO_DETAIL_DATA2 = 'SET_ADD_NEW_GAME_INFO_DETAIL_DATA2'
/** 追號紀錄詳情資料頁索引 */
export const SET_ADD_NEW_GAME_INFO_DETAIL_INDEX = 'SET_ADD_NEW_GAME_INFO_DETAIL_INDEX'
/** 追號紀錄的投注紀錄詳情資料頁索引 */
export const SET_ADD_NEW_GAME_INFO_DETAIL_INDEX2 = 'SET_ADD_NEW_GAME_INFO_DETAIL_INDEX2'
/** 清除暫存資訊 */
export const RESET_ADD_NEW_GAME_INFO_TEMP = 'RESET_ADD_NEW_GAME_INFO_TEMP'
/** 清除所有資料 */
export const CLEAR_ADD_NEW_GAME_INFO_DATA = 'CLEAR_ADD_NEW_GAME_INFO_DATA'
/** 取得獎期 */
export const GET_ADD_NEW_GAME_INFO_ISSUE = 'GET_ADD_NEW_GAME_INFO_ISSUE'
/** 增加獎期 */
export const SET_ADD_NEW_GAME_INFO_ISSUE = 'SET_ADD_NEW_GAME_INFO_ISSUE'
/** 取消所有追號 */
export const ACTION_ADD_NEW_GAME_CANCEL_ALL_TASK = 'ACTION_ADD_NEW_GAME_CANCEL_ALL_TASK'
/** 取消追號 */
export const ACTION_ADD_NEW_GAME_CANCEL_TASK = 'ACTION_ADD_NEW_GAME_CANCEL_TASK'

/** 分頁顯示頁碼位置 */
export const SET_ADD_NEW_GAME_INFO_PAGE_NATION_NUM = 'SET_ADD_NEW_GAME_INFO_PAGE_NATION_NUM'

// NewsEvents.js
/** API 取得 最新公告資料 */
export const GET_NEWS_EVENTS_LIST = 'GET_NEWS_EVENTS_LIST'
/** 設定 最新公告資料 */
export const SET_NEWS_EVENTS_LIST = 'SET_NEWS_EVENTS_LIST'
/** 設定資料並緩存在陣列 */
export const SET_NEWS_EVENTS_DATA = 'SET_NEWS_EVENTS_DATA'
/** 判斷是否載入中 */
export const SET_NEWS_EVENTS_LOAD = 'SET_NEWS_EVENTS_LOAD'
/** 設定 最新公告詳情索引 */
export const SET_NEWS_EVENTS_DETAIL_INDEX = 'SET_NEWS_EVENTS_DETAIL_INDEX'
/** 取得單一公告內容 */
export const GET_NEWS_EVENT_DETAIL = 'GET_NEWS_EVENT_DETAIL'
/** 清除暫存資訊 */
export const RESET_NEWS_EVENTS_TEMP = 'RESET_NEWS_EVENTS_TEMP'
/** 分頁顯示頁碼位置 */
export const SET_NEWS_EVENTS_PAGE_NATION_NUM = 'SET_NEWS_EVENTS_PAGE_NATION_NUM'
/** 清除詳情資訊 */
export const RESET_NEWS_EVENTS_DETAIL_DATA = 'RESET_NEWS_EVENTS_DETAIL_DATA'

// WinLose.js
/** API 取得 输赢报表資料 */
export const USERPROFIT_LIST = 'USERPROFIT_LIST'
/** 判斷是否載入中 */
export const SET_WINLOSE_LOAD = 'SET_WINLOSE_LOAD'
export const SET_WINLOSE_DATA = 'SET_WINLOSE_DATA'

// ReportList.js
/** API 取得 盈虧紀錄資料 */
export const GET_REPORT_LIST = 'GET_REPORT_LIST'
/** 設定 盈虧紀錄資料 */
export const SET_REPORT_LIST = 'SET_REPORT_LIST'
/** 設定資料並緩存在陣列 */
export const SET_REPORT_DATA = 'SET_REPORT_DATA'
/** 判斷是否載入中 */
export const SET_REPORT_LOAD = 'SET_REPORT_LOAD'
/** 清除暫存資訊 */
export const RESET_REPORT_TEMP_DATA = 'RESET_REPORT_TEMP_DATA'
// 頁數索引
export const SET_REPORT_INDEX = 'SET_REPORT_INDEX'
/** 清除所有資料 */
export const CLEAR_REPORT_DATA = 'CLEAR_REPORT_DATA'

// HistoryBallVN.js
// 取歷史獎號
/** 取得列表 */
export const GET_HISTORYBALLVN_LIST = 'GET_HISTORYBALLVN_LIST'
/** 設定列表 */
export const SET_HISTORYBALLVN_LIST = 'SET_HISTORYBALLVN_LIST'
/** 設定是否讀取中 */
export const SET_HISTORYBALLVN_INFO_LOADING = 'SET_HISTORYBALLVN_INFO_LOADING'
/** 清除取得列表紀錄 */
export const CLEAR_HISTORYBALLVN_LIST = 'CLEAR_HISTORYBALLVN_LIST'
/** api body */
export const SET_HISTORYBALLVN_DATA = 'SET_HISTORYBALLVN_DATA'

// ScoreBoard.js
/** 名人榜-取得名人榜榜單資料 */
export const GET_SCORE_BOARD_DATA = 'GET_SCORE_BOARD_DATA'
/** 名人榜-設定名人榜榜單資料 */
export const SET_SCORE_BOARD_DATA = 'SET_SCORE_BOARD_DATA'
/** 名人榜-設定名人榜榜單是否載入中 */
export const SET_SCORE_BOARD_ISLOADING = 'SET_SCORE_BOARD_ISLOADING'

// GamePlayer.js
// Actions

/** 設定遊戲核心資料 */
export const SET_GAME_CONFIG = 'SET_GAME_CONFIG'
/** 投注冷卻時間 */
export const GET_FLIP_TIMEER = 'GET_FLIP_TIMEER'
/** 取得遊戲總資料 */
export const GET_GAME_PLAY_DATA_CONFIG = 'GET_GAME_PLAY_DATA_CONFIG'
/** 取得遊戲菜單資料 */
export const GET_GAME_PLAY_MENU_DATA = 'GET_GAME_PLAY_MENU_DATA'
/** 取得遊戲總資料 */
export const GET_GAME_PLAY_DATA = 'GET_GAME_PLAY_DATA'
/** 取得遊戲獎期/追號等資料 */
export const GET_GAME_JS_DYNAMIC_CONFIG = 'GET_GAME_JS_DYNAMIC_CONFIG'
/** 官方彩種延遲抓號機制 */
export const GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL = 'GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL'
/** 透過名稱取得遊戲點位置 */
export const GET_GAME_INDEX = 'GET_GAME_INDEX'
/** 取得遊戲變動資料 */
export const GET_DYNAMIC_CONFIG = 'GET_DYNAMIC_CONFIG'
/** 初始化球的架構 */
export const SET_INIT_BALLS_DATA = 'SET_INIT_BALLS_DATA'
/** 初始化信用玩法的架構 */
export const SET_INIT_CREDIT_DATA = 'SET_INIT_CREDIT_DATA'
/** 切換玩法主玩法 */
export const SET_GAME_MENU_INDEX = 'SET_GAME_MENU_INDEX'
/** 更動game */
export const SET_GAME = 'SET_GAME'
/** 選球 */
export const SELECT_BALL = 'SELECT_BALL'
/** 選球(控制項) */
export const SET_BALL_CONTROL = 'SET_BALL_CONTROL'
/** 清空選球 */
export const CLEAR_ALL_BALLS = 'CLEAR_ALL_BALLS'
/** 清除選球(控制項) */
export const CLEAR_BALL_CONTROL = 'CLEAR_BALL_CONTROL'
/** 選球(全) */
export const SELECT_ALL_BALL = 'SELECT_ALL_BALL'
/** 選球(清) */
export const SELECT_CLEAR_ALL_BALL = 'SELECT_CLEAR_ALL_BALL'
/** 選球(大) */
export const SELECT_BIG_BALL = 'SELECT_BIG_BALL'
/** 選球(小) */
export const SELECT_SMALL_BALL = 'SELECT_SMALL_BALL'
/** 選球(奇) */
export const SELECT_ODD_BALL = 'SELECT_ODD_BALL'
/** 選球(偶) */
export const SELECT_EVEN_BALL = 'SELECT_EVEN_BALL'
/** 單式輸入事件 */
export const INPUT_DANSHI_TEXT = 'INPUT_DANSHI_TEXT'
/** 反選球 */
export const RE_SELECT_BALL = 'RE_SELECT_BALL'
/** 打開/關閉注單細節窗 */
export const GAME_DETAIL_TOGGLE = 'GAME_DETAIL_TOGGLE'
/** 設定倍數 */
export const SET_GAME_ORDER_TIMES = 'SET_GAME_ORDER_TIMES'
/** 設定元角分 */
export const SET_GAME_ORDER_MODE = 'SET_GAME_ORDER_MODE'
/** 設定萬、千、十、百、個控制項 */
export const SET_GAME_ORDER_DIGITSTR = 'SET_GAME_ORDER_DIGITSTR'
/** 添加/修改號碼箱 並修改 SubmitData 的注單資料 */
export const SET_SUBMIT_ORDER = 'SET_SUBMIT_ORDER'
/** 修改注單資料 */
export const SET_GAME_LT_PROJECT = 'SET_GAME_LT_PROJECT'
/** 信用玩法修改注單資料 */
export const SET_CREDIT_GAME_LT_PROJECT = 'SET_CREDIT_GAME_LT_PROJECT'
/** 信用玩法修改所有注單資料 */
export const SET_CREDIT_GAME_LT_PROJECT_ALL = 'SET_CREDIT_GAME_LT_PROJECT_ALL'
/** 信用玩法delete注單資料 */
export const DELETE_CREDIT_GAME_LT_PROJECT = 'DELETE_CREDIT_GAME_LT_PROJECT'
/** 修改投注總金額/注數 */
export const SET_SUBMIT_MONEY = 'SET_SUBMIT_MONEY'
/** 暫存已經添加過的注單讓重複項判斷時可以優先取用 */
export const SET_GAME_BOX_TEMP = 'SET_GAME_BOX_TEMP'
/** 顯示/隱藏並清除追號急修改 SubmitData 的注單資料 */
export const SET_IS_SHOW_ORDER_FUTURE = 'SET_IS_SHOW_ORDER_FUTURE'
/** 追號 並修改 SubmitData 的注單資料 */
export const SET_ORDER_FUTURE = 'SET_ORDER_FUTURE'
/** 桌面追號 並修改 SubmitData 的注單資料 */
export const SET_TABLE_ORDER_FUTURE = 'SET_TABLE_ORDER_FUTURE'
/** 改變追號類型 並清除追號資料 的注單資料 */
export const SET_ORDER_FUTURE_TYPE = 'SET_ORDER_FUTURE_TYPE'
/** 翻倍追號 並修改 SubmitData 的注單資料 */
export const SET_ORDER_FUTURE_DOUBLE = 'SET_ORDER_FUTURE_DOUBLE'
/** 營利率追號 並修改 SubmitData 的注單資料 */
export const SET_ORDER_FUTURE_WIN_RATE = 'SET_ORDER_FUTURE_WIN_RATE'
/** 更新追號期數 並修改 SubmitData 的注單資料 */
export const UPDATE_ORDER_FUTURE = 'UPDATE_ORDER_FUTURE'
/** 微調追號 並修改 SubmitData 的注單資料 */
export const SET_CHANGE_ORDER_FUTURE = 'SET_CHANGE_ORDER_FUTURE'
/** 刪除追號 並修改SubmitData 的注單資料 */
export const REMOVE_ORDER_FUTURE = 'REMOVE_ORDER_FUTURE'
/** 追號期數 並修改 SubmitData 的注單資料 */
export const ORDER_FUTURE_NUMBERS = 'ORDER_FUTURE_NUMBERS'
/** 追號間隔 並修改 SubmitData 的注單資料 */
export const ORDER_FUTURE_OFFSET = 'ORDER_FUTURE_OFFSET'
/** 追號間隔倍數 並修改 SubmitData 的注單資料 */
export const ORDER_FUTURE_OFFSET_MULTIPLE = 'ORDER_FUTURE_OFFSET_MULTIPLE'
/** 追號預期盈利率 並修改 SubmitData 的注單資料 */
export const ORDER_FUTURE_PRE_WIN_RATE = 'ORDER_FUTURE_PRE_WIN_RATE'
/** 全選/取消 追號勾選項 並修改SubmitData 的注單資料 */
export const ORDER_FUTURE_CHECK_ALL = 'ORDER_FUTURE_CHECK_ALL'
/** 選取/取消 追號勾選項 並修改SubmitData 的注單資料 */
export const ORDER_FUTURE_CHECK_INDEX = 'ORDER_FUTURE_CHECK_INDEX'
/** 全部追號倍數 並修改SubmitData 的注單資料 */
export const ORDER_FUTURE_MULTIPLE_ALL = 'ORDER_FUTURE_MULTIPLE_ALL'
/** 個別追號倍數  追號勾選項 並修改SubmitData 的注單資料 */
export const ORDER_FUTURE_MULTIPLE_INDEX = 'ORDER_FUTURE_MULTIPLE_INDEX'
/** 中獎後停止勾選項 並修改SubmitData 的注單資料 */
export const CHANGE_ORDER_FUTURE_BINGOSTOP = 'CHANGE_ORDER_FUTURE_BINGOSTOP'
/** 刪除號碼箱某隻注單並修改 SubmitData 的注單資料 */
export const REMOVE_SUBMIT_ORDER_INDEX = 'REMOVE_SUBMIT_ORDER_INDEX'
/** 刪除號碼箱所有注單並修改 SubmitData 的注單資料 */
export const REMOVE_SUBMIT_ALL_ORDER = 'REMOVE_SUBMIT_ALL_ORDER'
/** 生成指定数目的随机投注号码，并添加进号码篮以及修改 SubmitData 的注單資料 */
export const SET_RANDOM_LOTTERYS = 'SET_RANDOM_LOTTERYS'
/** 快速投注 */
export const FAST_GAME_ORDER_SUBMIT = 'FAST_GAME_ORDER_SUBMIT'
/** 投注 */
export const GAME_ORDER_SUBMIT = 'GAME_ORDER_SUBMIT'
/** 信用玩法投注 */
export const CREDIT_GAME_ORDER_SUBMIT = 'CREDIT_GAME_ORDER_SUBMIT'
/** 信用玩法投注 */
export const MOBILE_CREDIT_GAME_ORDER_SUBMIT = 'MOBILE_CREDIT_GAME_ORDER_SUBMIT'
/** 桌面玩法投注 */
export const TABLE_GAME_ORDER_SUBMIT = 'TABLE_GAME_ORDER_SUBMIT'
/** 320模式顯示區塊 */
export const SET_GAME_SHOW_MODE = 'SET_GAME_SHOW_MODE'
/** 320 遊戲選單是否顯示 */
export const SET_GAME_MENU_ACTIVE = 'SET_GAME_MENU_ACTIVE'
/** 設定投注倍數限制 */
// export const SET_MULTIPLE_LIMIT = 'SET_MULTIPLE_LIMIT'
/** 設定追號倍數限制，以gameSubmit中倍數最低者為準 */
export const SET_ORDER_FUTURE_MULTIPLE_LIMIT = 'SET_ORDER_FUTURE_MULTIPLE_LIMIT'
/** 刷新注單總計金額 */
export const REFRESH_SUBMIT_SUM = 'REFRESH_SUBMIT_SUM'
/** 被封鎖停押的玩法 */
export const SET_BLOCKED_METHODS = 'SET_BLOCKED_METHODS'
/** 設定返點 % */
export const SET_KEEP_POINT = 'SET_KEEP_POINT'
/** 玩法賠率是否更新 */
export const SET_DIFF_PRIZE_DATA = 'SET_DIFF_PRIZE_DATA'
/** 設定信用玩法賠率是否更新 */
export const SET_DIFF_PRIZE_CREDIT_DATA = 'SET_DIFF_PRIZE_CREDIT_DATA'
/** 設定返點拉吧索引 */
export const GET_FLOAT_PRIZE = 'GET_FLOAT_PRIZE'
/** 取得返點拉吧資料及封鎖停押資料 */
export const GET_FLOAT_PRIZE_AND_BLOCKED_METHODS = 'GET_FLOAT_PRIZE_AND_BLOCKED_METHODS'
/** 設定返點拉吧資料及封鎖停押資料 */
export const SET_FLOAT_PRIZE_AND_BLOCKED_METHODS = 'SET_FLOAT_PRIZE_AND_BLOCKED_METHODS'
/** 修改checkbox選取狀態 */
export const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX'
/** 信用投注視窗是否允許刪除注單 */
export const SET_SIN_SUBMIT_BOX_CAN_CANCEL = 'SET_SIN_SUBMIT_BOX_CAN_CANCEL'
/** 啟動/關閉殺對子 */
export const SET_KILL_PAIR = 'SET_KILL_PAIR'
/** 取得key翻譯 */
export const GET_TRANS = 'GET_TRANS'
/** 設定是否有路紙  */
export const SET_HAS_GAME_SCORE = 'SET_HAS_GAME_SCORE'
/** 番攤-設定橡皮擦模式 */
export const SET_ERASER = 'SET_ERASER'
/** 番攤-設定路紙開關 */
export const SET_SCORE_SHOW = 'SET_SCORE_SHOW'
/** 設定投注頁額外選項 */
export const SET_GAME_OPTION = 'SET_GAME_OPTION'
/** 設定所有選球組合 */
export const SET_BALLS_COMBINE = 'SET_BALLS_COMBINE'
/** 把拆單結果添加進投注箱 */
export const SET_SUBMIT_ORDER_MUTI = 'SET_SUBMIT_ORDER_MUTI'
/** 設定gameOrder裡的暫存注單箱 */
export const SET_PROJECT_TEMP = 'SET_PROJECT_TEMP'
/** [股票彩]設定隨機一注 */
export const SET_RANDOM_LOTTERYS_MUTI = 'SET_RANDOM_LOTTERYS_MUTI'

// Mutations
/** 投注計時時間 */
export const SET_FLIP_TIMEER_DATA = 'SET_FLIP_TIMEER_DATA'
/** 投注計時時間(多獎期) */
export const GET_FLIP_TIMEER_MUTI = 'GET_FLIP_TIMEER_MUTI'
/** 遊戲主要資料 */
export const SET_GAME_PLAY_DATA = 'SET_GAME_PLAY_DATA'
/** 遊戲主要資料 only 投注紀錄用 */
export const SET_GAME_INFO_CONTROL = 'SET_GAME_INFO_CONTROL'
/** 遊戲主要資料SIN only 投注紀錄用 */
// export const SET_GAME_PLAY_OFFICIAL_DATA = 'SET_GAME_PLAY_OFFICIAL_DATA'
/** 遊戲主要資料SIN only 投注紀錄用 */
// export const SET_GAME_PLAY_DATA_SIN = 'SET_GAME_PLAY_DATA_SIN'
/* 越南彩所有玩法 */
export const SET_GAME_PLAY_DATA_VN = 'SET_GAME_PLAY_DATA_VN'
/** 遊戲獎期資料 */
export const SET_GAME_PLAY_DYNAMIC_DATA = 'SET_GAME_PLAY_DYNAMIC_DATA'
/** 遊戲選球/計算的資料 */
export const SET_GAME_ORDER_DATA = 'SET_GAME_ORDER_DATA'
/** 遊戲部分參數 */
export const SET_GAME_DATA = 'SET_GAME_DATA'
/** 遊戲投注資料 */
export const SET_SUBMIT_DATA = 'SET_SUBMIT_DATA'
/** 修改checkbox選取狀態 */
export const SET_ACTIVE_CHECKBOXES = 'SET_ACTIVE_CHECKBOXES'
/* 超出封鎖值的玩法 */
export const SET_OVERLIMIT_METHODS = 'SET_OVERLIMIT_METHODS'
/* 超出用戶限額的玩法 */
export const SET_BONUS_OVERLIMIT_METHODS = 'SET_BONUS_OVERLIMIT_METHODS'
/** 設定歷史獎期 */
export const SET_GAME_HISTORY_LIST = 'SET_GAME_HISTORY_LIST'

//GameTrend.js
/** API 取得歷史獎期 */
export const GET_HISTORY_LIST = 'GET_HISTORY_LIST'
/** 設定歷史獎期 */
export const SET_HISTORY_LIST = 'SET_HISTORY_LIST'
/** 改動選定彩種 */
export const SET_LOTTERY = 'SET_LOTTERY'
/** 改動選定子彩種 */
export const SET_SUB_LOTTERY = 'SET_SUB_LOTTERY'
/** 改動選定玩法 */
export const SET_METHOD = 'SET_METHOD'
/** 改動讀取中狀態 */
export const SET_LOADING = 'SET_LOADING'
/** 輔助線 */
export const SET_TREND_IS_SHOW_SUP_LINE = 'SET_TREND_IS_SHOW_SUP_LINE'
/** 遺漏號 */
export const SET_TREND_IS_SHOW_LOSE_NUM = 'SET_TREND_IS_SHOW_LOSE_NUM'
/** 遺漏線圖 */
export const SET_TREND_IS_SHOW_LOSE_LINE = 'SET_TREND_IS_SHOW_LOSE_LINE'
/** 線圖 */
export const SET_TREND_IS_SHOW_LINE = 'SET_TREND_IS_SHOW_LINE'
/** 號碼溫 */
export const SET_TREND_IS_SHOW_BALLS_WARN = 'SET_TREND_IS_SHOW_BALLS_WARN'
/** 日期區間選擇 */
export const SET_RANGE_PRESET = 'SET_RANGE_PRESET'
/** 顯示/隱藏功能 */
export const SET_SHOW_TOOL = 'SET_SHOW_TOOL'
/** 設定搜尋起始時間 */
export const SET_START_TIME = 'SET_START_TIME'
/** 設定搜尋結束時間 */
export const SET_END_TIME = 'SET_END_TIME'
/** 設定瘦身縮放倍率 */
export const SET_RATE = 'SET_RATE'

// Vue-i18n
export const SET_LANG = 'SET_LANG'

// new lang
export const GET_STRING_POOL = 'GET_STRING_POOL'
export const SET_STRING_POOL = 'SET_STRING_POOL'
export const SET_STRING_POOL_LIST = 'SET_STRING_POOL_LIST'
// 玩法頁籤
export const SET_TAB_INDEX = 'SET_TAB_INDEX'
// 設定快速玩法
export const SET_IS_FAST = 'SET_IS_FAST'

//越南彩
/** 重置越南彩 */
export const RESET_GAME_VN = 'RESET_GAME_VN'
/** 倒數計時 */
export const SET_FLIP_TIMEER_VN_DATA = 'SET_FLIP_TIMEER_VN_DATA'
export const GET_FLIP_TIMEER_VN = 'GET_FLIP_TIMEER_VN'
/** ajax 越南彩遊戲資料 */
export const GET_GAME_CONFIG_VN_DATA = 'GET_GAME_CONFIG_VN_DATA'
/** 設定越南彩遊戲資料 */
export const SET_GAME_CONFIG_VN_DATA = 'SET_GAME_CONFIG_VN_DATA'
/** 取得越南彩最新號碼 */
export const GET_GAME_LASTNUMBER_VN = 'GET_GAME_LASTNUMBER_VN'
/** 設定越南彩最新號碼 */
export const SET_GAME_LASTNUMBER_VN = 'SET_GAME_LASTNUMBER_VN'
/** 設定越南彩獎期城市 */
export const SET_VN_AREA_DATA = 'SET_VN_AREA_DATA'
/** 設定越南彩資料 */
export const SET_GAME_VN_DATA = 'SET_GAME_VN_DATA'
/** Ajax 越南彩獎期 */
export const GET_COLD_DOWN_VN_DATA = 'GET_COLD_DOWN_VN_DATA'
/** 設定越南彩獎期 */
export const SET_COLD_DOWN_VN_DATA = 'SET_COLD_DOWN_VN_DATA'
/** 投注資料處理 */
export const GAME_ORDER_VN_SUBMIT = 'GAME_ORDER_VN_SUBMIT'
/** 320確認投注彈窗功能 */
export const MOBILE_GAME_ORDER_VN_SUBMIT_BOX = 'MOBILE_GAME_ORDER_VN_SUBMIT_BOX'
/** 980確認投注彈窗功能 */
export const GAME_ORDER_VN_SUBMIT_BOX = 'GAME_ORDER_VN_SUBMIT_BOX'
/** 號碼區總金額 */
export const SET_GAME_AREA_VN_MONEY = 'SET_GAME_AREA_VN_MONEY'
/** 彈窗內容移除功能 */
export const GAME_ORDER_VN_SUBMIT_REMOVE = 'GAME_ORDER_VN_SUBMIT_REMOVE'
/** 越南彩停售停押 */
export const SET_STOP_VN_DATA = 'SET_STOP_VN_DATA'
/** 越南彩停售停押封鎖 */
export const SET_STOP_AND_OVER_VN_DATA = 'SET_STOP_AND_OVER_VN_DATA'
/** 越南彩玩法開關 */
export const SET_BLOCKED_VN_DATA = 'SET_BLOCKED_VN_DATA'
/** 越南彩快速更新資料方式 */
export const SET_VN_TEMP_DATA = 'SET_VN_TEMP_DATA'
/** 越南彩過濾號碼彈窗功能 */
export const FILTER_NUMBER_VN = 'FILTER_NUMBER_VN'

//泰國彩
/** 重置泰國彩 */
export const RESET_GAME_TH = 'RESET_GAME_TH'
/** 泰國彩快速更新資料方式 */
export const SET_TH_TEMP_DATA = 'SET_TH_TEMP_DATA'
/** 倒數計時 */
export const SET_FLIP_TIMEER_TH_DATA = 'SET_FLIP_TIMEER_TH_DATA'
export const GET_FLIP_TIMEER_TH = 'GET_FLIP_TIMEER_TH'
/** ajax 泰國彩遊戲資料 */
export const GET_GAME_PLAY_TH_DATA = 'GET_GAME_PLAY_TH_DATA'
/** 設定泰國彩遊戲資料 */
export const SET_GAME_PLAY_TH_DATA = 'SET_GAME_PLAY_TH_DATA'
/** 取得遊戲獎期*/
export const GET_GAME_JS_DYNAMIC_CONFIG_TH = 'GET_GAME_JS_DYNAMIC_CONFIG_TH'
/** 設定遊戲獎期*/
export const SET_GAME_PLAY_DYNAMIC_TH_DATA = 'SET_GAME_PLAY_DYNAMIC_TH_DATA'
/** 官方彩種延遲抓號機制 */
export const GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_TH = 'GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_TH'
/** 官方彩種延遲抓號機制 */
export const SET_TH_FLOAT_PRIZE = 'SET_TH_FLOAT_PRIZE'
/** 設定泰國彩獎期城市 */
export const SET_TH_AREA_DATA = 'SET_TH_AREA_DATA'
/** 設定泰國彩資料 */
export const SET_GAME_TH_DATA = 'SET_GAME_TH_DATA'
/** Ajax 泰國彩獎期 */
export const GET_COLD_DOWN_TH_DATA = 'GET_COLD_DOWN_TH_DATA'
/** 設定泰國彩獎期 */
export const SET_COLD_DOWN_TH_DATA = 'SET_COLD_DOWN_TH_DATA'
/** 投注資料處理 */
export const GAME_ORDER_TH_SUBMIT = 'GAME_ORDER_TH_SUBMIT'
/** 3確認投注彈窗功能 */
export const SET_SUBMIT_TH_DATA = 'SET_SUBMIT_TH_DATA'
/** 號碼區總金額 */
export const SET_GAME_AREA_TH_MONEY = 'SET_GAME_AREA_TH_MONEY'
/** 彈窗內容移除功能 */
export const GAME_ORDER_TH_SUBMIT_REMOVE = 'GAME_ORDER_TH_SUBMIT_REMOVE'
/** 過濾號碼彈窗功能 */
export const FILTER_NUMBER_TH = 'FILTER_NUMBER_TH'

//馬來彩
/** 重置馬來彩 */
export const RESET_GAME_MY = 'RESET_GAME_MY'
/** 馬來彩快速更新資料方式 */
export const SET_MY_TEMP_DATA = 'SET_MY_TEMP_DATA'
/** 倒數計時 */
export const SET_FLIP_TIMEER_MY_DATA = 'SET_FLIP_TIMEER_MY_DATA'
export const GET_FLIP_TIMEER_MY = 'GET_FLIP_TIMEER_MY'
/** ajax 馬來彩遊戲資料 */
export const GET_GAME_PLAY_MY_DATA = 'GET_GAME_PLAY_MY_DATA'
/** 設定馬來彩遊戲資料 */
export const SET_GAME_PLAY_MY_DATA = 'SET_GAME_PLAY_MY_DATA'
/** 取得遊戲獎期*/
export const GET_GAME_JS_DYNAMIC_CONFIG_MY = 'GET_GAME_JS_DYNAMIC_CONFIG_MY'
/** 設定遊戲獎期*/
export const SET_GAME_PLAY_DYNAMIC_MY_DATA = 'SET_GAME_PLAY_DYNAMIC_MY_DATA'
/** 官方彩種延遲抓號機制 */
export const GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_MY = 'GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_MY'
/** 官方彩種延遲抓號機制 */
export const SET_MY_FLOAT_PRIZE = 'SET_MY_FLOAT_PRIZE'
/** 設定馬來彩獎期城市 */
export const SET_MY_AREA_DATA = 'SET_MY_AREA_DATA'
/** 設定馬來彩資料 */
export const SET_GAME_MY_DATA = 'SET_GAME_MY_DATA'
/** Ajax 馬來彩獎期 */
export const GET_COLD_DOWN_MY_DATA = 'GET_COLD_DOWN_MY_DATA'
/** 設定馬來彩獎期 */
export const SET_COLD_DOWN_MY_DATA = 'SET_COLD_DOWN_MY_DATA'
/** 投注資料處理 */
export const GAME_ORDER_MY_SUBMIT = 'GAME_ORDER_MY_SUBMIT'
/** 3確認投注彈窗功能 */
export const SET_SUBMIT_MY_DATA = 'SET_SUBMIT_MY_DATA'
/** 號碼區總金額 */
export const SET_GAME_AREA_MY_MONEY = 'SET_GAME_AREA_MY_MONEY'
/** 彈窗內容移除功能 */
export const GAME_ORDER_MY_SUBMIT_REMOVE = 'GAME_ORDER_MY_SUBMIT_REMOVE'

//老挝彩
/** 重置馬來彩 */
export const RESET_GAME_LA = 'RESET_GAME_LA'
/** 馬來彩快速更新資料方式 */
export const SET_LA_TEMP_DATA = 'SET_LA_TEMP_DATA'
/** 倒數計時 */
export const SET_FLIP_TIMEER_LA_DATA = 'SET_FLIP_TIMEER_LA_DATA'
export const GET_FLIP_TIMEER_LA = 'GET_FLIP_TIMEER_LA'
/** ajax 馬來彩遊戲資料 */
export const GET_GAME_PLAY_LA_DATA = 'GET_GAME_PLAY_LA_DATA'
/** 設定馬來彩遊戲資料 */
export const SET_GAME_PLAY_LA_DATA = 'SET_GAME_PLAY_LA_DATA'
/** 取得遊戲獎期*/
export const GET_GAME_JS_DYNAMIC_CONFIG_LA = 'GET_GAME_JS_DYNAMIC_CONFIG_LA'
/** 設定遊戲獎期*/
export const SET_GAME_PLAY_DYNAMIC_LA_DATA = 'SET_GAME_PLAY_DYNAMIC_LA_DATA'
/** 官方彩種延遲抓號機制 */
export const GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_LA = 'GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_LA'
/** 官方彩種延遲抓號機制 */
export const SET_LA_FLOAT_PRIZE = 'SET_LA_FLOAT_PRIZE'
/** 設定馬來彩獎期城市 */
export const SET_LA_AREA_DATA = 'SET_LA_AREA_DATA'
/** 設定馬來彩資料 */
export const SET_GAME_LA_DATA = 'SET_GAME_LA_DATA'
/** Ajax 馬來彩獎期 */
export const GET_COLD_DOWN_LA_DATA = 'GET_COLD_DOWN_LA_DATA'
/** 設定馬來彩獎期 */
export const SET_COLD_DOWN_LA_DATA = 'SET_COLD_DOWN_LA_DATA'
/** 投注資料處理 */
export const GAME_ORDER_LA_SUBMIT = 'GAME_ORDER_LA_SUBMIT'
/** 3確認投注彈窗功能 */
export const SET_SUBMIT_LA_DATA = 'SET_SUBMIT_LA_DATA'
/** 號碼區總金額 */
export const SET_GAME_AREA_LA_MONEY = 'SET_GAME_AREA_LA_MONEY'
/** 彈窗內容移除功能 */
export const GAME_ORDER_LA_SUBMIT_REMOVE = 'GAME_ORDER_LA_SUBMIT_REMOVE'

// 歷史獎號
/** 取得列表資料 */
export const GET_HB_LIST = 'GET_HB_LIST'
/** 設定列表資料 */
export const SET_HB_LIST = 'SET_HB_LIST'
/** 設定搜尋資料 */
export const SET_HB_SEARCH = 'SET_HB_SEARCH'
/** 設定載入中 */
export const SET_HB_LOADING = 'SET_HB_LOADING'
