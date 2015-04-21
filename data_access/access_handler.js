module.exports = function(redisClient) {

  // Creates the key to the image
  function getImageKey(imageName) {
    imageName = imageName.split(' ').join('');
    return "image:" + imageName;
  }

  return {
    addToHistory: function(descisionObject) {
      var imageKey = getImageKey(descisionObject.imageName);
      var history;
      redisClient.hmget(imageKey, ['history'], function(err, reply) {
        history = reply[0];
        if (history === null) {
          history = '{ "changesets": [] }';
        }
        try {
          history = JSON.parse(history);
        } catch (e) {
          console.log('Cannot parse history from redis');
        }
        history.changesets.unshift(descisionObject.changeset);
        redisClient.hmset(imageKey, 'history', JSON.stringify(history));
      });
    }
  };
};