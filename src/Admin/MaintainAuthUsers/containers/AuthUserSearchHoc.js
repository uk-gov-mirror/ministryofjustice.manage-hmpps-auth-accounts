import React, { Component } from 'react'
import qs from 'query-string'
import ReactRouterPropTypes from 'react-router-prop-types'

const searchComponent = WrappedComponent => {
  class AuthUserSearchHoc extends Component {
    handleChange = event => {
      const { name, value } = event.target
      this.setState({ [name]: value })
    }

    handleSearch = event => {
      const { history } = this.props
      const userQuery = qs.stringify(this.state)

      event.preventDefault()
      history.push({ pathname: '/maintain-auth-users/search-results', search: userQuery })
    }

    render() {
      return <WrappedComponent {...this.props} handleSearch={this.handleSearch} handleChange={this.handleChange} />
    }
  }

  AuthUserSearchHoc.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  }

  return AuthUserSearchHoc
}

export default searchComponent
