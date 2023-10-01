
export function debugV0({ request }) {
  console.log(new Date(), request.method, request.url)
};
