SIP WebRTC Calling System - Complete Setup Guide
📋 System Overview
This is a complete WebRTC calling system that connects web browsers to Amber IT SIP trunk through a VPS Asterisk PBX bridge.

Architecture Flow:
Web Browser (WebRTC/WebSocket) → VPS Asterisk (WebSocket 8088) → VPS Asterisk (UDP 5060) → Amber IT SIP Server (UDP 8190)


Amber IT account

Account Number: 09611900530
Username: 9080220  
Password: 2132
Domain: pabx.amberit.com.bd:8190
SIP Server: pabx.amberit.com.bd:8190
Transport: UDP


Environment File: NEXT_PUBLIC_SIP_SERVER=wss://dejureacademy.com/ws
NEXT_PUBLIC_SIP_USERNAME=webrtc-client
NEXT_PUBLIC_SIP_PASSWORD=webrtc123
NEXT_PUBLIC_SIP_DISPLAY_NAME=DeJure Academy
NEXT_PUBLIC_SIP_OUTBOUND_PROXY=pabx.amberit.com.bd:5060
NEXT_PUBLIC_NODE_ENV=production


root@srv973417:~# cat /etc/nginx/sites-available/dj-client
server {
    server_name dejureacademy.com www.dejureacademy.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket Proxy Configuration
    location /ws {
        proxy_pass http://127.0.0.1:8088/ws;
        proxy_http_version 1.1;

        # Critical WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;

        # Additional headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket specific headers
        proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
        proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;

        # Timeout settings
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;

        # Important: Prevent buffering
        proxy_buffering off;

        # Additional WebSocket settings
        proxy_set_header Origin "";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/dejureacademy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dejureacademy.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP to HTTPS redirect
server {
    if ($host = www.dejureacademy.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = dejureacademy.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name dejureacademy.com www.dejureacademy.com;
    return 404;
}

root@srv973417:~# cat /etc/asterisk/pjsip.conf
; Global PJSIP Settings
[global]
type=global
debug=yes

; UDP Transport for Outbound Calls
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
external_media_address=31.97.229.248
external_signaling_address=31.97.229.248

; WebSocket Transport for WebRTC
[transport-ws]
type=transport
protocol=ws
bind=0.0.0.0:8088

; Amber IT Endpoint WITHOUT Registration
[amber-endpoint]
type=endpoint
context=from-webrtc
disallow=all
allow=ulaw,alaw,gsm
; NO auth - direct IP calling
from_user=9080220
outbound_proxy=sip:pabx.amberit.com.bd:8190
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
transport=transport-udp
direct_media=no

; WebRTC Client
[webrtc-client]
type=endpoint
context=from-webrtc
disallow=all
allow=ulaw,alaw,gsm,opus
auth=webrtc-auth
webrtc=yes
ice_support=yes
dtls_auto_generate_cert=yes
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
transport=transport-ws

[webrtc-auth]
type=auth
auth_type=userpass
password=webrtc123
username=webrtc-client

; Remove all registration sections


root@srv973417:~# cat /etc/asterisk/http.conf
[general]
enabled=yes
bindaddr=0.0.0.0
bindport=8088
prefix=asterisk
enablestatic=yes

; WebSocket Settings
tlsenable=no

; Session Settings
sessionlimit=1000
session_inactivity=300000
session_keepalive=20000

; CORS for WebRTC
allow_origin=*

; Additional Settings
post_max_size=32768
max_servers=20
min_servers=5
max_requests=100

root@srv973417:~# cat /etc/asterisk/sip.conf
[general]
context=default
allowoverlap=no
udpbindaddr=0.0.0.0
tcpenable=no
; Enable WebSocket transport
transport=udp,tcp,ws,wss
; WebRTC specific settings
icesupport=yes
; NAT settings
nat=force_rport,comedia

[webrtc-client]
type=friend
context=default
host=dynamic
secret=webrtc123
encryption=yes
avpf=yes
force_avp=yes
; WebRTC specific
icesupport=yes
dtlsenable=yes
dtlsverify=no
dtlscertfile=/etc/asterisk/keys/asterisk.crt
dtlsprivatekey=/etc/asterisk/keys/asterisk.key
transport=ws,wss
; Audio codecs
disallow=all
allow=ulaw,alaw,gsm
root@srv973417:~#