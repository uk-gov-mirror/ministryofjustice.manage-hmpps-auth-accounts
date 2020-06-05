const removeRoleFactory = elite2Api => {
  const removeRole = async (req, res) => {
    const { agencyId, username, roleCode } = req.query
    await elite2Api.removeRole(res.locals, agencyId, username, roleCode)
    res.json({})
  }

  return {
    removeRole,
  }
}

module.exports = {
  removeRoleFactory,
}