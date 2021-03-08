function f (lines) {
  let ans = 1
  const [n, m, k] = lines
  const midVal = n>>1
  let x = 1, len = n.length
  let l = 0, r = len -1
  for(j=1; j<len;j++){
    let times = 0
    while (l<=midVal&& r>=midVal){
      const lStr = n.slice(l, l+m)
      const rStr = n.slice(-m-l)
      l++
      r--
      lStr === rStr && times++
    }
    times==k && (ans *= j)
    // for(let l=0; l<k; l++){
    //   const lStr = n.subString(l, l+m)
    //   const rStr = n.subString(-m-l)
    //
    // }
  }
  console.log(ans)
}

