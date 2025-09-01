# WOODY

## BFF => You've got a friend in me! (Woody, Toy Story)

## Getting started with Woody

### Setup ( if you already created keys for JERRI then it will use those )

1. In ufe folder `mkdir ssl-keys`

2. Create SSL certificates

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ssl-keys/domain.keys -out ssl-keys/domain.crt`

Enter place holder values for the certificate when prompted.

NOTE: You might have to execute the following command to get Chrome to allow you to accept the certificate

`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ssl-keys/domain.crt`

3. In a terminal window ( pick your profile same as JERRI )

`sudo bash tools/apiRouter.sh --profile=qa4`

4. You can have JERRI proxy / use woody

`sudo bash tools/router.sh --profile=qa4 --useWoody`

NOTE: you can run JERRI and UFE in frontend mode or backend mode,
the only change here is if JERRI will talk to woody or not

## **REQUIRED URL paramerters**

-   Channels (see CHANNELS in projects/server/src/services/utils/Constants.js)
    -   Android parameter
        -   ch=androidApp
    -   iOS parameter
        -   ch=iPhoneApp
    -   UFE parameter
        -   ch=rwd
-   Country and Language
    -   Locale parameter
        -   loc=en-US
    -   Values
        -   en-US
        -   en-CA
        -   fr-CA
