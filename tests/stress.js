import http from 'k6/http'
import { check } from 'k6'
import encoding from 'k6/encoding'

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export const options = {
    vus: 1,
    duration: '2s',
    // stages: [
    //     { duration: '2m', target: 100 },
    //     ...Array.from(  // increase by 50 concurrent users every 30 seconds
    //         { length: 6 }, (_, i) => {
    //             return { duration: '30s', target: 150 + i * 50 }
    //         }
    //     ),
    // ],
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
    const loginURL = `${__ENV.API_ADDRESS}/api/login`
    const usersURL = `${__ENV.API_ADDRESS}/api/users`
    const encodedCredentials = encoding.b64encode(`${__ENV.API_USERNAME}:${__ENV.API_PASSWORD}`)

    const loginResponse = http.get(
        loginURL,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedCredentials}`,
            },
        }
    )

    console.log("# response:", Object.keys(loginResponse))
    console.log("# response.json:", loginResponse.json)

    check(loginResponse, { 'status was 200': (r) => r.status === 200 })
}
