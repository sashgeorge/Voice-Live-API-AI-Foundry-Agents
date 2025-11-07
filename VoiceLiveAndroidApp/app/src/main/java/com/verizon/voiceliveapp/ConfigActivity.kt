package com.verizon.voiceliveapp

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.verizon.voiceliveapp.databinding.ActivityConfigBinding
import com.verizon.voiceliveapp.models.AzureConfig
import com.verizon.voiceliveapp.utils.ConfigManager

class ConfigActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityConfigBinding
    private lateinit var configManager: ConfigManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfigBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        configManager = ConfigManager(this)
        
        // Load existing config
        loadConfiguration()
        
        binding.saveButton.setOnClickListener {
            saveConfiguration()
        }
    }
    
    private fun loadConfiguration() {
        configManager.loadConfig()?.let { config ->
            binding.endpointInput.setText(config.endpoint)
            binding.agentIdInput.setText(config.agentId)
            binding.projectNameInput.setText(config.projectName)
            binding.apiVersionInput.setText(config.apiVersion)
        }
    }
    
    private fun saveConfiguration() {
        val endpoint = binding.endpointInput.text?.toString()?.trim() ?: ""
        val agentId = binding.agentIdInput.text?.toString()?.trim() ?: ""
        val projectName = binding.projectNameInput.text?.toString()?.trim() ?: ""
        val apiVersion = binding.apiVersionInput.text?.toString()?.trim() ?: "2025-10-01"
        
        if (endpoint.isEmpty() || agentId.isEmpty() || projectName.isEmpty()) {
            Toast.makeText(
                this,
                "Please fill in all required fields",
                Toast.LENGTH_SHORT
            ).show()
            return
        }
        
        val config = AzureConfig(endpoint, agentId, projectName, apiVersion)
        configManager.saveConfig(config)
        
        Toast.makeText(this, R.string.config_saved, Toast.LENGTH_SHORT).show()
        finish()
    }
}
