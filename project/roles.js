const node_acl = require('acl');
const mongoose = require('mongoose');

module.exports = {
 connectMongodb(mongo_URL, fn) {
  mongoose.connect(mongo_URL, { useUnifiedTopology: true, useNewUrlParser: true }, function(err) {
    if (err)
      console.error(err);
    else {
      var acl = new node_acl(new node_acl.mongodbBackend(mongoose.connection.db, 'acl_'));
      console.log('Connected to mongo server');
      acl.allow([
        {
          roles: 'admin',
          allows: [
            {
              resources: '/admin',
              permissions: '*',
            },
          ]
        },
        {
          roles: 'user',
          allows: [
            {
              resources: '/class/enroll',
              permissions: '*',
            },
            {
              resources: '/class',
              permissions: '*',
            },
            {
              resources: '/users',
              permissions: '*',
            },
          ]
        },
      ]);
      
      acl.addRoleParents('admin', 'user');

      fn(acl);
    }
  });
 }
}
