module.exports = {
  port: process.env.PORT || 3000,
  mongo_URL : process.env.MONGO_URL || 'mongodb://localhost:27017/ClassPin',
  SECRET_SESSION: process.env.SECRET_SESSION || "12312312",
  env : process.env.NODE_ENV || 'development'
}