module.exports = function(redisClient) {
  redisClient.hmget('myhashset2', ['username', 'password'], function(err, reply) {
    console.log(reply);
  });
};