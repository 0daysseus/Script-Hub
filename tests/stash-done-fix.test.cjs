const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const test = require('node:test')

const converter = fs.readFileSync(path.join(__dirname, '..', 'script-converter.beta.js'), 'utf8')

async function runUntilDone(code, context) {
  let doneValue
  let calls = 0
  vm.runInNewContext(code, {
    console: { log: () => {} },
    setTimeout,
    clearTimeout,
    Promise,
    Uint8Array,
    ...context,
    $done: value => {
      calls++
      doneValue = value
    },
  })
  for (let i = 0; i < 100 && calls === 0; i++) await new Promise(resolve => setTimeout(resolve, 5))
  return { doneValue, calls }
}

// Runs script-converter.beta.js for a script.hub/convert URL and returns the script it serves.
async function convertScript(requestUrl, scriptBody) {
  const { doneValue } = await runUntilDone(converter, {
    $request: { url: requestUrl, method: 'GET', headers: {} },
    $environment: { 'stash-version': 'test' },
    $persistentStore: { read: () => null, write: () => true },
    $notification: { post: () => {} },
    $httpClient: {
      get: (options, callback) => callback(null, { status: 200, statusCode: 200, headers: {} }, scriptBody),
      post: (options, callback) => callback(null, { status: 200, statusCode: 200, headers: {} }, ''),
    },
  })
  assert.equal(doneValue?.response?.status, 200)
  return doneValue.response.body
}

test('the converted response script hands back the original body for a bare $done()', async () => {
  const url = 'http://script.hub/convert/_start_/https://raw.githubusercontent.com/a/b/main/response.js/_end_/response.js?type=stash-script&target=stash-script&stashDoneFix=true'
  const original = `const keep = $request.url.endsWith('/next')
if (keep) $done()
else $done({ body: new Uint8Array([9]) })`
  const script = await convertScript(url, original)
  assert.ok(script.includes(original))

  const body = new Uint8Array([1, 2, 3])
  const unchanged = await runUntilDone(script, { $request: { url: 'https://example.com/next' }, $response: { status: 200, body } })
  assert.equal(unchanged.calls, 1)
  assert.equal(unchanged.doneValue.body, body)

  const modified = await runUntilDone(script, { $request: { url: 'https://example.com/browse' }, $response: { status: 200, body } })
  assert.deepEqual([...modified.doneValue.body], [9])

  const request = await runUntilDone(script, { $request: { url: 'https://example.com/next' } })
  assert.equal(JSON.stringify(request.doneValue), '{}')
})

test('without stashDoneFix the converter serves the script unchanged', async () => {
  const url = 'http://script.hub/convert/_start_/https://raw.githubusercontent.com/a/b/main/response.js/_end_/response.js?type=stash-script&target=stash-script'
  assert.equal(await convertScript(url, '$done()'), '$done()')
})
