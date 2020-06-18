module.exports = {
  getConnectedUsers: (req, res) => {
    let { productId } = req.params;
    let userCount = 0; 

    try {
      req.io.on('connection', socket => {
        userCount+=1
        console.log('User Join Room', userCount);
        
        req.io.emit(`Connected-${productId}`, userCount);
        socket.on('disconnect', () => {
            userCount--
            console.log('User Left Room', userCount);
            req.io.emit(`Connected-${productId}`, userCount);
        });
      });
      console.log(userCount);
      res.status(200).send(userCount);
    } catch(err) {
      console.log(err.message);
      res.status(500).send(err);
    };
  }
};