import http from 'k6/http'
import { check, group } from 'k6'
import encoding from 'k6/encoding'

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export const options = {
    thresholds: {
        http_req_failed: [ 'rate<0.01' ],
        http_req_duration: [ 'p(95)<500' ],
    },
    stages: [
        {
            duration: '1m30s', target: 240,
        },
        {
            duration: '2m', target: 240,
        },
        {
            duration: '1m30s', target: 0,
        },
    ],
}

export function handleSummary(data) {
    const stdout = textSummary(data, { indent: ' ', enableColors: true })
    return {
        'stdout': stdout,
        [`${__ENV.REPORTS_PATH}/summary.txt`]: stdout,
        [`${__ENV.REPORTS_PATH}/summary.json`]: JSON.stringify(data),
        [`${__ENV.REPORTS_PATH}/summary.html`]: htmlReport(data),
    }
}

export default function () {
    let loginData

    const loginURL = `${__ENV.API_ADDRESS}/api/token`
    const usersURL = `${__ENV.API_ADDRESS}/api/users`
    const encodedCredentials = encoding.b64encode(`${__ENV.API_USERNAME}:${__ENV.API_PASSWORD}`)

    group('Authentication', () => {
        const loginResponse = http.get(loginURL, { headers: { 'Authorization': `Basic ${encodedCredentials}` } })
        check(loginResponse, { 'status was 200': (response) => response.status === 200 })

        loginData = JSON.parse(loginResponse.body)
    })

    if (loginData) {
        group('Get users', () => {
            const usersResponse = http.get(usersURL, { headers: { 'Authorization': `JWT ${loginData.access}` } })
            check(usersResponse, { 'status was 200': (response) => response.status === 200 })
        })
    }
}
