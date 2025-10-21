"use client";

import { useState } from "react";
import { UserAgent, Inviter, Registerer } from "sip.js";
import Image from "next/image";

let userAgent;
let registerer;

const SIPCall = () => {
  const [sipInfo, setSipInfo] = useState({
    username: "8318810",
    password: "7147",
    domain: "pabx.amberit.com.bd:8190",
    targetNumber: "",
  });

  const [connected, setConnected] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  const initializeSip = async () => {
    if (connected) return;

    const { username, password, domain } = sipInfo;

    const uri = `sip:${username}@${domain}`;
    const userAgentOptions = {
      uri,
      transportOptions: {
        server: `wss://${domain}`, // ✅ WebSocket required
      },
      authorizationUsername: username,
      authorizationPassword: password,
      displayName: username,
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    };

    try {
      userAgent = new UserAgent(userAgentOptions);
      await userAgent.start();
      registerer = new Registerer(userAgent);
      await registerer.register();

      setConnected(true);
      setCallStatus("Connected to SIP server.");
    } catch (err) {
      setCallStatus("Connection failed. Check WebSocket support.");
    }
  };

  const handleCall = async () => {
    if (!connected) {
      setCallStatus("Not connected to SIP server.");
      return;
    }

    const target = `sip:${sipInfo.targetNumber}@${
      sipInfo.domain.split(":")[0]
    }`;
    try {
      const inviter = new Inviter(userAgent, target);
      await inviter.invite();
      setCallStatus(`Calling ${sipInfo.targetNumber}...`);
    } catch (err) {
      setCallStatus("Call failed.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">
        📞 AmberIT SIP Call
      </h2>
      <Image
        src="/images/sipcall.png"
        alt="sipcall"
        width={500}
        height={300}
        className="mx-auto mb-4"
      />

      <div className="space-y-3">
        <input
          type="text"
          placeholder="SIP Username"
          value={sipInfo.username}
          onChange={(e) => setSipInfo({ ...sipInfo, username: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="SIP Password"
          value={sipInfo.password}
          onChange={(e) => setSipInfo({ ...sipInfo, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="SIP Domain (e.g., pabx.amberit.com.bd:8190)"
          value={sipInfo.domain}
          onChange={(e) => setSipInfo({ ...sipInfo, domain: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Target Number (e.g., 01XXXXXXXXX)"
          value={sipInfo.targetNumber}
          onChange={(e) =>
            setSipInfo({ ...sipInfo, targetNumber: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            onClick={initializeSip}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Connect SIP
          </button>
          <button
            onClick={handleCall}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Call Now
          </button>
        </div>

        {callStatus && (
          <div className="text-center mt-3 text-sm text-gray-700">
            {callStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default SIPCall;
