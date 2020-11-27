module.exports = {
  port: process.env.PORT || 3000,
  mongo_URL : process.env.MONGO_URL || 'mongodb+srv://lequocdatfit:lequocdat1234@cluster0.emhcb.mongodb.net/ClassPin?retryWrites=true&w=majority',
  SECRET_SESSION: process.env.SECRET_SESSION || "12312312",
  env : process.env.NODE_ENV || 'development'
}