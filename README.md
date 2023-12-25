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

1. Create [.env](./.env):
    ```bash
    API_ADDRESS=http://<IP>:3000  # Change <IP>, this IP must be accessible from within a runner containers.
    API_USERNAME=test
    API_PASSWORD=test
    ```
2. Setup environment (start `elasticsearch` and `kibana`):
    ```bash
    docker compose --profile env up --detach
    ```

## Run performance testing

### Stress testing

The stress test will simulate a large number of concurrent login requests to evaluate how the system handles
authentication under heavy load.

**Parameters**

* `Concurrent users`: Start with 1000 concurrent users and gradually increase.
* `Ramp-up period`: 2 minutes, add 500 users every 30 seconds until reaching 3000 concurrent users.
* `Test duration`: 5 minutes.


#### Run

Run stress testing using k6 docker containers (with `10` runners):

```bash
docker compose --profile test up --scale runner=10
```

#### Results

The k6 report files is saved in `./reports/`.

![Gatling Report](docs/images/gatling_report.png)

## Clean environment

```bash
docker compose --profile env --profile test down
```

# License

[MIT](./LICENSE)
