import { spawn, spawnSync } from "child_process";
import fs from "fs";

spawn("npm", ["run", "dev"], { stdio: "inherit" });
//const proccess = spawn("npm", ["run", "start"], { stdio: "inherit" });

setInterval(() => {
    const jsonFile = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(jsonFile);

    Object.values(data).forEach(async (value) => {
        try {
            if (!value.enabled) return;

            const res = await fetch(`https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/user`, {
                headers: {
                    "Authorization": `Bearer ${value.jungle_token}`           
                }
            });

            if (res.ok) {
                const json = await res.json();

                const tokens = json.userData.totalTokens + json.userData.totalRedeemableTokens;
                const text = `${(tokens / 10.6).toFixed(2)}$ on #jungle`;

                const res2 = await fetch(`https://hackclub.slack.com/api/users.profile.set`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${value.access_token}`
                    },
                    body: JSON.stringify({
                        profile: {
                            status_text: text,
                            status_emoji: ":jungle:"
                        }
                    })
                });
            } else {
                console.error(await res.text());
            }
        } catch (e) {
            console.error(e);
        }
    });
}, 3000); // 5 minutes