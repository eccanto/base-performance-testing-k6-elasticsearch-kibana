#!/usr/bin/env sh

set -ex

CONTAINER_ID=$(curl --silent -XGET --unix-socket /run/docker.sock "http://localhost/containers/$(hostname)/json" | jq .Name)
TEST_ID="runner-$(echo "$CONTAINER_ID" | awk -F'[-"]' '{print $(NF-1)}')"
EXECUTION_REPORT_PATH="${REPORTS_PATH:?}/${TEST_ID}"

mkdir -p "${EXECUTION_REPORT_PATH}"
REPORTS_PATH="${EXECUTION_REPORT_PATH}" k6 run "${K6_SCRIPT}" --tag testid="${TEST_ID}"
