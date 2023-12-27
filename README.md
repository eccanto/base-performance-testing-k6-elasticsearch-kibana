# Performance testing using K6 + Elasticsearch + Kibana

![](https://img.shields.io/badge/-Linux-grey?logo=linux)
![](https://img.shields.io/badge/license-MIT-green)
![](https://img.shields.io/github/stars/eccanto)

# Table of contents

* [Overview](#overview)
  * [Scenario: User login with JWT authentication](#scenario:-user-login-with-jwt-authentication)
* [Get started](#get-started)
  * [Requirements](#requirements)
  * [Configuration](#configuration)
  * [Run performance testing](#run-performance-testing)
    * [Stress testing](#stress-testing)
  * [Results](#results)
    * [Kibana dashboard](#kibana-dashboard)
    * [k6 reports](#k6-reports)
        * [summary.html](#summary.html)
        * [summary.json](#summary.json)
        * [summary.txt](#summary.txt)
  * [Clean environment](#crean-environment)
* [License](#license)

# Overview

## Scenario: User login with JWT authentication

The system allows users to log in using JWT for authentication. Upon successful login, the system issues a JWT token
that must be included in subsequent requests to access protected resources.

**Test scenario**

* Simulate concurrent user login attempts.
* Each login attempt includes a valid username and password.
* Upon successful login, the system issues a JWT token.
* The token must be included in subsequent requests for accessing protected resources.

# Get Started

## Requirements

- [Docker +24.0.7](https://docs.docker.com/engine/install/ubuntu/)
- [Docker compose +2.21.0](https://docs.docker.com/compose/install/linux/)

## Configuration

Setup environment (start `elasticsearch`, `kibana` and `mockoon`):

```bash
docker compose --profile env up --detach
```

## Run performance testing

### Stress testing

The stress test will simulate a large number of concurrent login requests to evaluate how the system handles
authentication under heavy load.

**System parameters**

* `normal expected utilisation`: 2000 concurrent users.
* `maximum design capacity`: 3000 concurrent users.

**Scenario parameters**

* `maximum number of users`: 3600 concurrent users, 20% more than the maximum designed capacity.
* `initial number of users`: start with 600 concurrent users and gradually increase.
* `ramp-up period`: 2 minutes, add 500 users every 30 seconds until reaching 3000 concurrent users.
* `test duration`: 5 minutes.

**Scenario thresholds**

* `HTTP errors`: HTTP errors should be less than 1%.
* `response time`: 95% of requests should be below 500ms.

#### Run

Run stress testing using k6 docker containers (with `10` runners):

```bash
docker compose --profile test up --scale runner=10
```

## Results

### Kibana dashboard

Available in http://localhost:5601/app/dashboards

![kibana dashboard](./docs/images/kibana-report.png)

### k6 reports

Each runner generates a separate reports:

```bash
reports
├── runner-1
│   ├── summary.html
│   ├── summary.json
│   └── summary.txt
├── runner-2
│   ├── summary.html
│   ├── summary.json
│   └── summary.txt
...
├── runner-9
│   ├── summary.html
│   ├── summary.json
│   └── summary.txt
└── runner-10
    ├── summary.html
    ├── summary.json
    └── summary.txt

11 directories, 30 files
```

#### summary.html

![k6 HTML report](./docs/images/k6-summary-html.png)

#### summary.json

![k6 JSON report](./docs/images/k6-summary-json.png)

#### summary.txt

![k6 txt report](./docs/images/k6-summary-txt.png)

## Clean environment

```bash
docker compose --profile env --profile test down
```

# License

[MIT](./LICENSE)
