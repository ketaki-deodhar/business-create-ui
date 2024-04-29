import { BusinessLookupResultIF } from '@/interfaces'
import { AxiosInstance as axios } from '@/utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

setActivePinia(createPinia())
const store = useStore()

/**
 * Class that provides integration with the BusinessLookup API.
 */
export default class BusinessLookupServices {
  /** The Business API URL, from session storage. */
  static get businessApiUrl (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
  }

  /** The Business API Key, from session storage. */
  static get businessApiKey (): string {
    return sessionStorage.getItem('BUSINESS_API_KEY')
  }

  /**
   * Searches for business by code or words.
   * @param query - code or words to search
   * @param status - status to match (ACTIVE or HISTORICAL or '' to match all statuses)
   * @param legalTypes - the legal types we're searching for
   * @returns a promise to return the search results
   */
  static async search (query: string, status: string, legalTypes: string): Promise<BusinessLookupResultIF[]> {
    let url = this.businessApiUrl + 'businesses/search/facets?start=0&rows=20'
    url += `&categories=legalType:${legalTypes}${status ? '::status:' + status : ''}`
    url += `&query=value:${encodeURIComponent(query)}`

    const config = {
      headers: {
        'x-apikey': this.businessApiKey,
        'Account-Id': store.getAccountId
      }
    }

    return axios.get(url, config).then(response => {
      const results: Array<BusinessLookupResultIF> = response?.data?.searchResults?.results
      if (!results) {
        throw new Error('Invalid API response')
      }

      // filter out results without a valid identifier
      return results.filter(result => {
        const pattern = /^[A-Z]{1,3}[0-9]{7}$/
        return pattern.test(result.identifier)
      })
    })
  }
}
