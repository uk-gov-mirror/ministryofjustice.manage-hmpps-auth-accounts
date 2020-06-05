const search = (eliteApi, res, agencyId, nameFilter, roleFilter) =>
  eliteApi.userSearch(res.locals, {
    nameFilter,
    roleFilter: roleFilter || '',
  })

const adminSearch = (eliteApi, res, agencyId, nameFilter, roleFilter) =>
  eliteApi.userSearchAdmin(res.locals, {
    nameFilter,
    roleFilter: roleFilter || '',
  })

const userSearchFactory = eliteApi => {
  const userSearch = async (req, res) => {
    const { agencyId, nameFilter, roleFilter, hasAdminRole } = req.query
    const response =
      hasAdminRole === 'true'
        ? await adminSearch(eliteApi, res, agencyId, nameFilter, roleFilter)
        : await search(eliteApi, res, agencyId, nameFilter, roleFilter)
    res.set(res.locals.responseHeaders)
    res.json(response)
  }

  return {
    userSearch,
  }
}

module.exports = {
  userSearchFactory,
}