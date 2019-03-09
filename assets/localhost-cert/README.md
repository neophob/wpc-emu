# Build Localhost SSL

Source https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec

## How to build certificates
- `cd assets/localhost-cert`
- `openssl genrsa -des3 -out rootCA.key 2048`
- `openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem`
- Your system need to trust `rootCA.pem`
- `openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )`
- `openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 3650 -sha256 -sha256 -extfile v3.ext`


Note: do not use chrome://flags/#allow-insecure-localhost - PWA features will not be available!

Here is a simple example of my settings:

```
Country Name (2 letter code) []:CH
State or Province Name (full name) []:foo bar
Locality Name (eg, city) []:downtown
Organization Name (eg, company) []:me
Organizational Unit Name (eg, section) []:wpc
Common Name (eg, fully qualified host name) []:localhost
Email Address []: foo@bar.com
```
