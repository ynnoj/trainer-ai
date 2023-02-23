import { defer } from '@defer.run/client'

async function test() {
  console.log('hey')
}

export default defer(test)
