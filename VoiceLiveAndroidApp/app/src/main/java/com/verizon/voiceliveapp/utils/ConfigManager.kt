package com.verizon.voiceliveapp.utils

import android.content.Context
import android.content.SharedPreferences
import com.verizon.voiceliveapp.models.AzureConfig

class ConfigManager(context: Context) {
    private val prefs: SharedPreferences = 
        context.getSharedPreferences("voice_live_config", Context.MODE_PRIVATE)
    
    companion object {
        private const val KEY_ENDPOINT = "azure_endpoint"
        private const val KEY_AGENT_ID = "agent_id"
        private const val KEY_PROJECT_NAME = "project_name"
        private const val KEY_API_VERSION = "api_version"
    }
    
    fun saveConfig(config: AzureConfig) {
        prefs.edit().apply {
            putString(KEY_ENDPOINT, config.endpoint)
            putString(KEY_AGENT_ID, config.agentId)
            putString(KEY_PROJECT_NAME, config.projectName)
            putString(KEY_API_VERSION, config.apiVersion)
            apply()
        }
    }
    
    fun loadConfig(): AzureConfig? {
        val endpoint = prefs.getString(KEY_ENDPOINT, null)
        val agentId = prefs.getString(KEY_AGENT_ID, null)
        val projectName = prefs.getString(KEY_PROJECT_NAME, null)
        val apiVersion = prefs.getString(KEY_API_VERSION, "2025-10-01") ?: "2025-10-01"
        
        return if (endpoint != null && agentId != null && projectName != null) {
            AzureConfig(endpoint, agentId, projectName, apiVersion)
        } else {
            null
        }
    }
    
    fun hasConfig(): Boolean {
        return loadConfig()?.isValid() == true
    }
}
