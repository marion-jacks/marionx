const updateHerokuVar = async ({ Marion, m, reply, isCreator, key, value, setHerokuEnvVar }) => {
  if (!isCreator) return reply("❌ *Only the bot owner can modify this setting.*");
  try {
    await setHerokuEnvVar(key, value);
    reply(`✅ *${key.replace(/_/g, " ")} updated:*\n\`\`\`${key} = ${value.toUpperCase()}\`\`\``);
    reply("🔄 *Bot will restart to apply changes!*");
  } catch (error) {
    reply(`❌ *Error updating ${key.replace(/_/g, " ")}*\n${error.message}`);
  }
};

module.exports = [
  {
    command: ["addvar"],
    operate: async ({ Marion, m, reply, isCreator, full_args, setHerokuEnvVar }) => {
      if (!isCreator) return;
      const [varName, varValue] = full_args.split("=").map(v => v.trim());
      if (!varName || !varValue) return reply(`*Provide a variable name and value*\n\nExample: .addvar NEW_VAR = value`);
      await updateHerokuVar({ Marion, m, reply, isCreator, key: varName, value: varValue, setHerokuEnvVar });
    }
  },
  {
    command: ["delvar"],
    operate: async ({ Marion, m, reply, isCreator, full_args, deleteHerokuEnvVar }) => {
      if (!isCreator) return;
      const varName = full_args.trim();
      if (!varName) return reply("*Provide a variable name to delete*");

      try {
        await deleteHerokuEnvVar(varName);
        reply(`✅ *Environment variable deleted:*\n\`\`\`${varName}\`\`\``);
        reply("🔄 *Bot will restart to apply changes!*");
      } catch (error) {
        reply(`❌ *Error deleting environment variable*\n${error.message}`);
      }
    }
  },
   {
    command: ['getvar', 'getvars'],
    operate: async (context) => {
        const { m, isCreator, reply, getHerokuEnvVars } = context;
        if (!isCreator) return;

        try {
            const envVars = await getHerokuEnvVars();
            const formattedVars = Object.entries(envVars)
                .map(([key, value]) => `${key} = ${value}`)
                .join('\n');
            await reply(`*Current Environment Variables:*\n\`\`\`${formattedVars}\`\`\``);
        } catch (error) {
            await reply(`*Error getting environment variables*\n${error.message}`);
        }
    }
},
  {
    command: ["anticall"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .anticall on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "ANTI_CALL", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["alwaysonline"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .alwaysonline on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "ALWAYS_ONLINE", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["antidelete"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify the antidelete mode*\n\nExample: .antidelete private");
      const mode = text.trim().toLowerCase();
      const validModes = ["private", "chat", "off"];
      if (!validModes.includes(mode)) return reply("❌ *Invalid mode. Use 'private', 'chat', or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "ANTIDELETE", value: mode, setHerokuEnvVar });
    }
  },
   {
    command: ["antiedit"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify the antiedit mode*\n\nExample: .antiedit private");
      const mode = text.trim().toLowerCase();
      const validModes = ["private", "chat", "off"];
      if (!validModes.includes(mode)) return reply("❌ *Invalid mode. Use 'private', 'chat', or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "ANTI_EDIT", value: mode, setHerokuEnvVar });
    }
  },
  {
    command: ['autoread'],
 operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply('*Please specify on/off*\n\nExample: .autoread on');
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "AUTO_READ", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
   {
    command: ['autostatusreact'],
 operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply('*Please specify on/off*\n\nExample: .autostatusreact on');
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "AUTO_STATUS_REACT", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
     {
    command: ['autostatusview'],
 operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply('*Please specify on/off*\n\nExample: .autostatusview on');
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "AUTO_STATUS_VIEW", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["chatbot"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .chatbot on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "CHATBOT", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  },
  {
    command: ["mode"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify the mode*\n\nExample: .mode private");
      const mode = text.trim().toLowerCase();
      if (!["private", "public"].includes(mode)) return reply("❌ *Invalid mode. Use 'private' or 'public'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "MODE", value: mode, setHerokuEnvVar });
    }
  },
  {
    command: ["setbotname"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide a bot name*\n\nExample: .setbotname CypherX");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "BOT_NAME", value: text.trim(), setHerokuEnvVar });
    }
  },
    {
    command: ["setmenu"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide a menu style*\n\nExample: .setmenu 2");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "MENU_STYLE", value: text.trim(), setHerokuEnvVar });
    }
  },
    {
    command: ["setname"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide your name*\n\nExample: .setname Tylor");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "OWNER_NAME", value: text.trim(), setHerokuEnvVar });
    }
  },
    {
    command: ["setownernumber"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide your name*\n\nExample: .setownernumber 1234567890");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "OWNER_NUMBER", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ["setprefix"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide a prefix*\n\nExample: .setprefix !");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "BOT_PREFIX", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ["setsudo"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Provide one or more sudo numbers*\n\nExample: .setsudo 1234567890");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "SUDO", value: text.trim(), setHerokuEnvVar });
    }
  },
  {
    command: ['setvar'],
    operate: async (context) => {
        const { m, full_args, reply, isCreator, setHerokuEnvVar } = context;
        if (!isCreator) return;
        const [varName, varValue] = full_args.split('=');
        if (!varName || !varValue) {
            return reply(`*Please provide a variable name and value*\n\nExample: .setvar ANTI_CALL = false`);
        }
        try {
            const result = await setHerokuEnvVar(varName.trim(), varValue.trim());
            await reply(`*Environment variable set successfully*\n\`\`\`${varName} = ${varValue}\`\`\``);
            await reply(`*Bot will restart to apply the new environment variable. Please wait a moment!*`);
        } catch (error) {
            await reply(`*Error setting environment variable*\n${error.message}`);
        }
    }
},
  {
    command: ["welcome"],
    operate: async ({ Marion, m, reply, isCreator, text, setHerokuEnvVar }) => {
      if (!text) return reply("*Specify on/off*\n\nExample: .welcome on");
      const value = text.trim().toLowerCase();
      if (!["on", "off"].includes(value)) return reply("❌ *Invalid input. Use 'on' or 'off'*");
      await updateHerokuVar({ Marion, m, reply, isCreator, key: "WELCOME_MSG", value: value === "on" ? "true" : "false", setHerokuEnvVar });
    }
  }
];