
openssl req -newkey rsa:2048 -nodes -keyout domain.keys \
	    -x509 -days 100000 -out domain.crt \
            -subj "/C=US/ST=California/L=San Francisco/O=sephora dev/CN=local.sephora.com" 

