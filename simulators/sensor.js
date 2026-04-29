// grabbing args from the terminal
const [deviceID, devicePWD] = process.argv.slice(2);

if (!deviceID || !devicePWD) {
  console.error("Missing credentials. Run: node sensor.js <ID> <PWD>");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSensor() {
  console.log(`Sensor ${deviceID} booted up. Sending data every 5s...`);

  while (true) {
    const simulatedValue = (Math.random() * 50).toFixed(2);

    try {
      const res = await fetch("http://localhost:3000/api/sensors/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          DeviceID: deviceID,
          DevicePWD: devicePWD,
          valor: simulatedValue,
        }),
      });

      if (!res.ok) {
        console.log(`[${deviceID}] HTTP ${res.status} - data rejected`);
      } else {
        console.log(`[${deviceID}] Sent: ${simulatedValue}`);
      }
    } catch (err) {
      console.error(`[${deviceID}] API unreachable`);
    }

    await sleep(5000);
  }
}

runSensor();
