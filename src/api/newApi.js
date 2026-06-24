import axios from 'axios'

const NEW_API_BASE_URL = 'http://127.0.0.1:6002'

const getCookie = name => {
    const prefix = `${name}=`
    const cookie = document.cookie
        .split(';')
        .map(item => item.trim())
        .find(item => item.indexOf(prefix) === 0)

    return cookie ? cookie.substring(prefix.length) : ''
}

const buildAuthHeaders = () => {
    const headers = {}
    const jwt = getCookie('JWT')

    if (jwt) {
        headers.Authorization = `Bearer ${jwt}`
    }

    return headers
}

export const newApiClient = axios.create({
    baseURL: NEW_API_BASE_URL,
    headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

newApiClient.interceptors.request.use(config => ({
    ...config,
    headers: {
        ...config.headers,
        ...buildAuthHeaders()
    }
}))

export const requestNewApi = config => newApiClient(config)

export const postNewGameOrder = payload =>
    requestNewApi({
        method: 'post',
        url: '/game/order',
        data: payload
    })
