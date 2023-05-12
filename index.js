const axios = require("axios");
const fs = require("fs");
const readline = require("readline/promises");

(async ()=>{
    console.log("Profile Converter Made by BiruFN");
    const code = await ReadLine("AuthCodeを入力して下さい> "); //https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code

    await axios.post("https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token",{"grant_type":"authorization_code","code": code},{"headers": {"Authorization": "Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=","Content-Type": "application/x-www-form-urlencoded"}})
    .then(async response => {
        const athena = await axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${response.data.account_id}/client/QueryProfile?profileId=athena&rvn=-1`,{},{"headers": {"Authorization": `Bearer ${response.data.access_token}`}});
        const campaign = await axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${response.data.account_id}/client/QueryProfile?profileId=campaign&rvn=-1`,{},{"headers": {"Authorization": `Bearer ${response.data.access_token}`}});
        const common_core = await axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${response.data.account_id}/client/QueryProfile?profileId=common_core&rvn=-1`,{},{"headers": {"Authorization": `Bearer ${response.data.access_token}`}});
    
        await GenerateAthena(athena.data);
        await GenerateCampaign(campaign.data);
        await GenerateCommonCore(common_core.data);

        console.log("complete!");
    })
    .catch(async error => {
        console.log("error!");
    })

})();

async function ReadLine(text) {
    const readInterface = readline.createInterface({
        "input": process.stdin,
        "output": process.stdout
    });
    const string = await readInterface.question(text);
    readInterface.close();
    return string;
}


async function GenerateAthena(athena) {
    const profileChanges = athena.profileChanges[0];
    const items = profileChanges.profile.items;
    const itemObject = Object.keys(items);

    const profile = {
        "changeType": "fullProfileUpdate",
        "profile": {
            "_id": profileChanges.profile.accountId,
            "Update": profileChanges.profile.Update,
            "created": profileChanges.created,
            "updated": profileChanges.updated,
            "rvn": 1,
            "wipeNumber": profileChanges.profile.wipeNumber,
            "accountId": profileChanges.profile.accountId,
            "profileId": "athena",
            "version": "",
            "items": {},
            "stats": profileChanges.profile.stats,
            "commandRevision": 1
        }
    }

    const last_applied_loadout = profileChanges.profile.stats.attributes.last_applied_loadout;
    const cosmeticlocker_athena = items[last_applied_loadout];

    profile.profile.items[cosmeticlocker_athena.templateId] = cosmeticlocker_athena;

    profileChanges.profile.stats.attributes.last_applied_loadout = cosmeticlocker_athena.templateId;
    profileChanges.profile.stats.attributes.loadouts = [cosmeticlocker_athena.templateId];

    for (var i in itemObject) {
        const item = items[itemObject[i]];

        if (item.templateId.includes("AthenaPickaxe:")
        || item.templateId.includes("AthenaDance:")
        || item.templateId.includes("AthenaGlider:")
        || item.templateId.includes("AthenaCharacter:")
        || item.templateId.includes("AthenaBackpack:")
        || item.templateId.includes("AthenaItemWrap:")
        || item.templateId.includes("AthenaLoadingScreen:")
        || item.templateId.includes("AthenaMusicPack:")
        || item.templateId.includes("AthenaSkyDiveContrail:"))
        {
            profile.profile.items[item.templateId] = {
                "templateId": item.templateId,
                "attributes": {
                    "level": 1,
                    "item_seen": true,
                    "variants": item.attributes.variants
                },
                "quantity": 1
            }
        }
    }

    fs.writeFileSync("./athena.json", JSON.stringify(profile, null, 4));
}

async function GenerateCampaign(campaign) {
    const profileChanges = campaign.profileChanges[0];
    const items = profileChanges.profile.items;
    const itemObject = Object.keys(items);

    const profile = {
        "changeType": "fullProfileUpdate",
        "profile": {
            "_id": profileChanges.profile.accountId,
            "Update": profileChanges.profile.Update,
            "created": profileChanges.created,
            "updated": profileChanges.updated,
            "rvn": 1,
            "wipeNumber": profileChanges.profile.wipeNumber,
            "accountId": profileChanges.profile.accountId,
            "profileId": "campaign",
            "version": "",
            "items": {},
            "stats": profileChanges.profile.stats,
            "commandRevision": 1
        }
    }

    const last_applied_loadout = profileChanges.profile.stats.attributes.last_applied_loadout;
    const cosmeticlocker_athena = items[last_applied_loadout];

    profile.profile.items[cosmeticlocker_athena.templateId] = cosmeticlocker_athena;

    profileChanges.profile.stats.attributes.last_applied_loadout = cosmeticlocker_athena.templateId;
    profileChanges.profile.stats.attributes.loadouts = [cosmeticlocker_athena.templateId];

    fs.writeFileSync("./campaign.json", JSON.stringify(profile, null, 4));
}

async function GenerateCommonCore(common_core) {
    const profileChanges = common_core.profileChanges[0];
    const items = profileChanges.profile.items;
    const itemObject = Object.keys(items);

    const profile = {
        "changeType": "fullProfileUpdate",
        "profile": {
            "_id": profileChanges.profile.accountId,
            "Update": profileChanges.profile.Update,
            "created": profileChanges.created,
            "updated": profileChanges.updated,
            "rvn": 1,
            "wipeNumber": profileChanges.profile.wipeNumber,
            "accountId": profileChanges.profile.accountId,
            "profileId": "common_core",
            "version": "",
            "items": {},
            "stats": profileChanges.profile.stats,
            "commandRevision": 1
        }
    }

    for (var i in itemObject) {
        const item = items[itemObject[i]];

        if (item.templateId.includes("Currency:"))
        {
            profile.profile.items[item.templateId] = {
                "templateId": item.templateId,
                "attributes": {
                    "platform": item.attributes.platform
                },
                "quantity": item.quantity
            }
        }

        if (item.templateId.includes("HomebaseBannerIcon:")
        || item.templateId.includes("HomebaseBannerColor:"))
        {
            profile.profile.items[item.templateId] = {
                "templateId": item.templateId,
                "attributes": {
                    "item_seen": true
                },
                "quantity": 1
            }
        }
    }

    fs.writeFileSync("./common_core.json", JSON.stringify(profile, null, 4));
}



