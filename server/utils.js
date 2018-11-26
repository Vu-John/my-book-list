const jwt = require('jsonwebtoken')

getUserId = (context) => {
  const Authorization = context.headers.authorization;
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
};

module.exports = {
  getUserId
}
