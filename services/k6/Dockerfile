FROM golang:1.21.5-alpine as builder
WORKDIR $GOPATH/src/go.k6.io/k6
RUN CGO_ENABLED=0 go install go.k6.io/xk6/cmd/xk6@latest
RUN CGO_ENABLED=0 xk6 build --with github.com/elastic/xk6-output-elasticsearch --output /tmp/k6

FROM alpine:3.19.0
RUN apk add curl jq
COPY --from=builder /tmp/k6 /usr/bin/k6

WORKDIR /app

ENTRYPOINT ["k6"]
