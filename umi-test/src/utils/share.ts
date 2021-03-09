
export function to (promise: Promise<{}>){
  return promise
      .then(data => [null, data])
      .catch(err => [err])
}
