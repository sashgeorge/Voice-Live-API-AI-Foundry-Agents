package com.verizon.voiceliveapp.models

data class AzureConfig(
    val endpoint: String,
    val agentId: String,
    val projectName: String,
    val apiVersion: String = "2025-10-01"
) {
    fun isValid(): Boolean {
        return endpoint.isNotBlank() && 
               agentId.isNotBlank() && 
               projectName.isNotBlank()
    }
}
