
function debugV0({ request }) {
  console.log(new Date(), request.method, request.url)
};

module.exports = {
  debugV0
}
