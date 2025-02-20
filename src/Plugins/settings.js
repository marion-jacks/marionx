const fs = require('fs');
const path = require('path');
let deletionTimeouts = {};

module.exports = [
 {
  command: ['delplugin', 'deleteplugin', 'canceldelete'],
  operate: async ({ m, args, reply, prefix, isCreator, command }) => {
    if (!isCreator) return reply("*You don't have permission to use this command!*");

    const pluginsDir = path.join(__dirname, '..');

    if (command === 'canceldelete') {
      if (deletionTimeouts[m.chat]) {
        clearTimeout(deletionTimeouts[m.chat]);
        delete deletionTimeouts[m.chat];
        return reply('*Plugin deletion canceled successfully.*');
      } else {
        return reply('*No plugin deletion is currently scheduled.*');
      }
    }

    if (!args[0]) {
      return reply('Usage: `.delplugin <filename>`\nExample: `.delplugin block`');
    }

    const pluginName = args[0].toLowerCase();

    try {
      let foundFile = null;

      const searchFile = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);

          if (fs.statSync(fullPath).isDirectory()) {
            searchFile(fullPath); 
          } else if (file.toLowerCase() === `${pluginName}.js`) {
            foundFile = fullPath; // File found
            break;
          }
        }
      };

      searchFile(pluginsDir);
      if (!foundFile) {
        return reply(`*Error:* Plugin "${pluginName}.js" not found.`);
      }
      const notificationMessage = `*The plugin "${pluginName}.js" will be deleted in 30 seconds.*\n\nTo stop the deletion, use the command \`${prefix}canceldelete\`.`;
      await reply(notificationMessage);

      deletionTimeouts[m.chat] = setTimeout(async () => {
        try {
          if (fs.existsSync(foundFile)) {
            fs.unlinkSync(foundFile);
            delete deletionTimeouts[m.chat];
            await reply(`*Success:* Plugin "${pluginName}.js" has been deleted.`);
          }
        } catch (err) {
          console.error(err);
          await reply(`*Error:* Could not delete "${pluginName}.js".`);
        }
      }, 30000);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while trying to delete the plugin.*');
    }
  }
 },
  {
  command: ['getplugin'],
  operate: async ({ m, args, MARION, reply }) => {
    if (!args[0]) {
      return reply('Usage: `.getplugin <filename>`\nExample: `.getplugin block`');
    }

    const pluginName = args[0].toLowerCase();
    const pluginsDir = path.join(__dirname, '..'); 

    try {
      let foundFile = null;
      const searchFile = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);

          if (fs.statSync(fullPath).isDirectory()) {
            searchFile(fullPath); 
          } else if (file.toLowerCase() === `${pluginName}.js`) {
            foundFile = fullPath; // File found
            break;
          }
        }
      };

      searchFile(pluginsDir);

      if (!foundFile) {
        return reply(`*Error:* Plugin "${pluginName}.js" not found.`);
      }
      
      const fileContent = fs.readFileSync(foundFile, 'utf-8');

      await reply(`*Plugin Content:*\n\n\`\`\`\n${fileContent}\n\`\`\``);

      await MARION.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(foundFile),
          fileName: `${pluginName}.js`,
          mimetype: 'application/javascript',
        },
        { quoted: m }
      );
    } catch (error) {
      console.error(error);
      reply('*An error occurred while retrieving the plugin.*');
    }
  }
},
  {
  command: ['reload'],
  operate: async ({ m, reply, isCreator, args }) => {
    if (!isCreator) return reply("*You don't have permission to use this command!*");

    if (args.length === 0) return reply("*Please specify a file to reload! For example: Xploader, index.js, core.js, settings.js*");

    try {
      const fileName = args[0].toLowerCase();
      let filePath;

      switch (fileName) {
        case 'MARION':
        case 'MARION.js':
          filePath = path.resolve(__dirname, '..', '..', 'MARION.js');
          break;
        case 'index':
        case 'index.js':
          filePath = path.resolve(__dirname, '..', '..', 'index.js');
          break;
        case 'core':
        case 'core.js':
          filePath = path.resolve(__dirname, '..', '..', 'core.js');
          break;
        case 'settings':
        case 'settings.js':
          filePath = path.resolve(__dirname, '..', '..', 'settings.js');
          break;
        default:
          return reply("*Invalid file specified! Please provide a valid file name.*");
      }

      delete require.cache[require.resolve(filePath)];

      require(filePath);

      console.log(`File ${fileName} reloaded successfully!`);
      reply(`File ${fileName} reloaded successfully!`);
    } catch (err) {
      console.error(`Error reloading the file ${args[0]}:`, err);
      reply(`Error reloading the file ${args[0]}. Check logs for details.`);
    }
  }
},
  {
  command: ['reloadallplugins'],
  operate: async ({ m, reply, isCreator }) => {
    if (!isCreator) return reply("*You don't have permission to use this command!*");

    const pluginsDir = path.join(__dirname, '..'); 

    try {
      const unloadedPlugins = [];
      const reloadedPlugins = [];

      const searchPlugins = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);

          if (fs.statSync(fullPath).isDirectory()) {
            searchPlugins(fullPath); 
          } else if (file.endsWith('.js')) {
            try {
              delete require.cache[require.resolve(fullPath)];

              require(fullPath);

              reloadedPlugins.push(file);
            } catch (err) {
              unloadedPlugins.push(file); 
              console.error(`Error reloading ${file}:`, err);
            }
          }
        }
      };

      searchPlugins(pluginsDir);

      let response = `*Reload All Plugins Result:*\n\n`;
      response += `*Reloaded Plugins:*\n${reloadedPlugins.map((p) => `- ${p}`).join('\n') || 'None'}\n\n`;
      if (unloadedPlugins.length > 0) {
        response += `*Failed to Reload:*\n${unloadedPlugins.map((p) => `- ${p}`).join('\n')}`;
      } else {
        response += `*All plugins reloaded successfully!*`;
      }

      reply(response);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while trying to reload all plugins.*');
    }
  }
},
  {
  command: ['reloadplugin'],
  operate: async ({ m, args, reply, isCreator }) => {
    if (!isCreator) return reply("*You don't have permission to use this command!*");

    if (!args[0]) {
      return reply('Usage: `.reloadplugin <plugin_name>`\nExample: `.reloadplugin block`');
    }

    const pluginName = args[0].toLowerCase();
    const pluginsDir = path.join(__dirname, '..'); 
    try {
      let foundFile = null;
      const searchFile = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);

          if (fs.statSync(fullPath).isDirectory()) {
            searchFile(fullPath); 
          } else if (file.toLowerCase() === `${pluginName}.js`) {
            foundFile = fullPath; // File found
            break;
          }
        }
      };

      searchFile(pluginsDir);

      if (!foundFile) {
        return reply(`*Error:* Plugin "${pluginName}.js" not found.`);
      }

      delete require.cache[require.resolve(foundFile)];

      require(foundFile);

      reply(`*Success:* Plugin "${pluginName}.js" has been reloaded.`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while trying to reload the plugin.*');
    }
  }
},
];