const generateMessage = (user, text) => {
     return {
         user, 
         text,
         createdAt: new Date().toLocaleTimeString([], {
             hour: '2-digit', minute: '2-digit'
            })
     }
}

module.exports = generateMessage
