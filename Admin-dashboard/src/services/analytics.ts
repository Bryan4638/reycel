import axios from './axios'

export const getAnalytics =() => {
  return axios.get('/analytics')
}
export const getPaymentsRequest = (startDate: string, endDate: string) => {
  return axios.post('/analytics/payments', {startDate, endDate})
}
export const getBestSellingProductRequest = (startDate: string, endDate: string) => {
  return axios.post('/analytics/bestSellingProduct', {startDate, endDate})
}

export const getLeastSellingProductRequest = (startDate: string, endDate: string) => {
  return axios.post('/analytics/leastSoldProduct', {startDate, endDate})
}

export const getSedeWithMostSalesRequest = (startDate: string, endDate: string) => {
  return axios.post('/analytics/sedeWithMostSales', {startDate, endDate})
}

export const getSedeWithLeastSalesRequest = (startDate: string, endDate: string) => {
  return axios.post('/analytics/sedeWithLeastSales', {startDate, endDate})
}