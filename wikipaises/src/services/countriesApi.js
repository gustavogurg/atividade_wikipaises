import axios from 'axios'

const api = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  params: {
    fields: 'name,capital,region,population,flags,cca3'
  }
})

export async function getAllCountries() {
  const response = await api.get('/all')
  return response.data
}

export async function getCountriesByName(name) {
  const response = await api.get('/name/' + name)
  return response.data
}

export async function getCountriesByRegion(region) {
  const response = await api.get('/region/' + region)
  return response.data
}

export async function getCountryByCode(code) {
  const response = await api.get('/alpha/' + code, {
    params: {
      fields: 'name,capital,region,subregion,area,population,languages,currencies,flags,cca3'
    }
  })

  return Array.isArray(response.data) ? response.data[0] : response.data
}