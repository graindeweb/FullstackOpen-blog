const config = require("./utils/config.js")

const app = require ("./app")

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
