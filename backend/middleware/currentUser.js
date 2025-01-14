const { forenameToInitial } = require('../utils')
const config = require('../config')

const hasRole = (userRoles, roleCode) => userRoles.some((role) => role.roleCode === roleCode)

module.exports = ({ prisonApi, oauthApi }) => async (req, res, next) => {
  if (!req.xhr) {
    if (!req.session.userDetails) {
      req.session.userDetails = await oauthApi.currentUser(res.locals)
      req.session.allCaseloads = await prisonApi.userCaseLoads(res.locals)

      const roles = await oauthApi.currentRoles(res.locals)
      req.session.userRoles = {
        maintainAccess: hasRole(roles, 'MAINTAIN_ACCESS_ROLES'),
        maintainAccessAdmin: hasRole(roles, 'MAINTAIN_ACCESS_ROLES_ADMIN'),
        maintainAuthUsers: hasRole(roles, 'MAINTAIN_OAUTH_USERS'),
        groupManager: hasRole(roles, 'AUTH_GROUP_MANAGER'),
      }
    }

    const caseloads = req.session.allCaseloads
    const { name, activeCaseLoadId } = req.session.userDetails
    const returnUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const clientID = config.apis.oauth2.clientId

    res.locals.user = {
      returnUrl,
      clientID,
      ...res.locals.user,
      allCaseloads: caseloads,
      displayName: forenameToInitial(name),
      activeCaseLoad: caseloads.find((cl) => cl.caseLoadId === activeCaseLoadId),
      ...req.session.userRoles,
    }
  }
  next()
}
