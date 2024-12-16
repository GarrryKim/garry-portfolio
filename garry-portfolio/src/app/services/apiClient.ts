import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiAuthClient = axios.create({
  ...apiClient.defaults,
})

// 요청 인터셉터
apiAuthClient.interceptors.request.use((config) => {
  // 액세스 토큰 가져오기
  const accessToken = localStorage.getItem('access-token')

  //   액세스 토큰 존재시 header에 추가
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// 응답 인터셉터
apiAuthClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)
