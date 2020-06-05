const axios = require('axios')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const logger = require('../log')

const { addAuthorizationHeader, addPaginationHeaders, addMediaHeaders } = require('./axios-config-decorators')

const resultLogger = result => {
  logger.debug(`${result.config.method} ${result.config.url} ${result.status} ${result.statusText}`)
  return result
}

const errorLogger = error => {
  const status = error.response ? error.response.status : '-'
  const responseData = error.response ? error.response.data : '-'
  logger.debug(`Error. ${error.config.method} ${error.config.url} ${status} ${error.message} ${responseData}`)
  throw error
}

/**
 * Build a client for the supplied configuration. The client wraps axios get, post, put etc while ensuring that
 * the remote calls carry valid oauth headers.
 *
 * @param baseUrl The base url to be used with the client's get and post
 * @param timeout The timeout to apply to get and post.
 * @returns {{get: (function(*=): *), post: (function(*=, *=): *)}}
 */
const factory = ({ baseUrl, timeout }) => {
  const agentOptions = {
    maxSockets: 100,
    maxFreeSockets: 10,
    freeSocketTimeout: 30000,
  }
  const keepaliveAgent = baseUrl.startsWith('https')
    ? { httpsAgent: new HttpsAgent(agentOptions) }
    : { httpAgent: new Agent(agentOptions) }
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout,
    ...keepaliveAgent,
  })

  const addHeaders = (context, config) =>
    addMediaHeaders(context, addPaginationHeaders(context, addAuthorizationHeader(context, config)))

  /**
   * An Axios GET request with Oauth token
   *
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param url if url is relative then baseURL will be prepended. If the url is absolute the baseURL is ignored.
   * @returns A Promise which settles to the Axios result object if the promise is resolved, otherwise to the 'error' object.
   */
  const get = (context, url, resultLimit) =>
    axiosInstance(
      addHeaders(context, {
        method: 'get',
        url,
        headers: resultLimit ? { 'Page-Limit': resultLimit } : {},
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  /**
   * An Axios POST with Oauth token refresh and retry behaviour
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param url if url is relative then the baseURL will be prepended. If the url is absolute then baseURL is ignored.
   * @param body
   * @returns A Promise which resolves to the Axios result object, or the Axios error object if it is rejected
   */
  const post = (context, url, body) =>
    axiosInstance(
      addHeaders(context, {
        method: 'post',
        url,
        data: body,
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  const put = (context, url, body) =>
    axiosInstance(
      addHeaders(context, {
        method: 'put',
        url,
        data: body,
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  const del = (context, url, body) =>
    axiosInstance(
      addHeaders(context, {
        method: 'delete',
        url,
        data: body,
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  const getStream = (context, url) =>
    axiosInstance(
      addHeaders(context, {
        method: 'get',
        url,
        responseType: 'stream',
      })
    ).catch(errorLogger)

  return {
    get,
    getStream,
    post,
    put,
    del,
    axiosInstance, // exposed for testing...
  }
}

module.exports = factory