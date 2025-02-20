const fs = require('fs/promises');
const path = require('path');

class PluginManager {
  constructor(directory) {
    this.directory = directory;
    this.pluginCache = new Map();
  }

  async loadPlugins() {
    try {
        console.log("[MARION X] Loading plugins...");
        const pluginFiles = await this.getPluginFiles(this.directory);

        for (const filePath of pluginFiles) {
            if (!this.pluginCache.has(filePath)) {
                await this.loadPlugin(filePath);
            }
        }

        console.log("[MARION X] Plugins loaded successfully.");
    } catch (error) {
        console.error("[MARION X] Error loading plugins:", error);
    }
}

  async getPluginFiles(directory) {
    const folders = await fs.readdir(directory);
    let pluginFiles = [];

    for (const folder of folders) {
      const folderPath = path.join(directory, folder);
      const stats = await fs.stat(folderPath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(folderPath);
        const jsFiles = files.filter(file => file.endsWith('.js')).map(file => path.join(folderPath, file));
        pluginFiles = pluginFiles.concat(jsFiles);
      } else if (folder.endsWith('.js')) {
        pluginFiles.push(folderPath);
      }
    }

    return pluginFiles;
  }

  async loadPlugin(filePath) {
    try {
      const plugins = require(filePath);

      if (Array.isArray(plugins)) {
        const validPlugins = plugins.filter(plugin => plugin && plugin.command && typeof plugin.operate === 'function');
        if (validPlugins.length > 0) {
          this.pluginCache.set(filePath, validPlugins);
          return true;
        } else {
          console.warn(`No valid plugins found in: ${filePath}`);
          return false;
        }
      } else {
        console.warn(`Plugin file does not export an array in: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`Error loading plugin (${filePath}):`, error);
      return false;
    }
  }

  async unloadPlugin(filePath) {
    for (const [key, plugin] of this.pluginCache.entries()) {
      if (key.startsWith(filePath)) {
        try {
          if (typeof plugin.cleanup === 'function') {
            await plugin.cleanup();
          }

          delete require.cache[require.resolve(filePath)];
          this.pluginCache.delete(key);
          console.log(`Plugin unloaded: ${filePath}`);
        } catch (error) {
          console.error(`Error unloading plugin (${filePath}):`, error);
        }
      }
    }
  }

  async unloadAllPlugins() {
    for (const filePath of this.pluginCache.keys()) {
      await this.unloadPlugin(filePath.split(':')[0]);
    }
  }

  async reloadPlugin(filePath) {
    await this.unloadPlugin(filePath);
    await this.loadPlugin(filePath);
  }

  async executePlugin(globalContext, command) {
    for (const [key, pluginArray] of this.pluginCache.entries()) {
      for (const plugin of pluginArray) {
        try {
          if (plugin.command.includes(command)) {
            await plugin.operate(globalContext);
            return true;
          }
        } catch (error) {
          console.error(`Error executing plugin (${plugin.command}):`, error);
        }
      }
    }
    return false;
  }
}

module.exports = PluginManager;
