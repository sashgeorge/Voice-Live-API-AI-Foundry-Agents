import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var configManager: ConfigManager
    @Environment(\.dismiss) var dismiss
    
    @State private var endpoint: String = ""
    @State private var agentId: String = ""
    @State private var projectName: String = ""
    @State private var apiVersion: String = "2025-10-01"
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Azure Configuration")) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Azure Endpoint")
                            .font(.caption)
                            .foregroundColor(.gray)
                        TextField("https://your-endpoint.ai.azure.com", text: $endpoint)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                            .keyboardType(.URL)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Agent ID")
                            .font(.caption)
                            .foregroundColor(.gray)
                        TextField("agent-xxxxx", text: $agentId)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Project Name")
                            .font(.caption)
                            .foregroundColor(.gray)
                        TextField("your-project-name", text: $projectName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("API Version")
                            .font(.caption)
                            .foregroundColor(.gray)
                        TextField("2025-10-01", text: $apiVersion)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .autocapitalization(.none)
                    }
                }
                
                Section {
                    Button(action: saveConfiguration) {
                        HStack {
                            Spacer()
                            Text("Save Configuration")
                                .font(.system(size: 16, weight: .semibold))
                            Spacer()
                        }
                    }
                }
                
                Section {
                    Text("Configure your Azure Voice Live API credentials. These settings are stored securely on your device.")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .navigationTitle("Settings")
            .navigationBarItems(trailing: Button("Done") {
                dismiss()
            })
            .onAppear(perform: loadConfiguration)
            .alert("Configuration", isPresented: $showAlert) {
                Button("OK", role: .cancel) {
                    if alertMessage == "Configuration saved successfully!" {
                        dismiss()
                    }
                }
            } message: {
                Text(alertMessage)
            }
        }
    }
    
    private func loadConfiguration() {
        if let config = configManager.loadConfig() {
            endpoint = config.endpoint
            agentId = config.agentId
            projectName = config.projectName
            apiVersion = config.apiVersion
        }
    }
    
    private func saveConfiguration() {
        guard !endpoint.isEmpty, !agentId.isEmpty, !projectName.isEmpty else {
            alertMessage = "Please fill in all required fields"
            showAlert = true
            return
        }
        
        let config = AzureConfig(
            endpoint: endpoint,
            agentId: agentId,
            projectName: projectName,
            apiVersion: apiVersion
        )
        
        configManager.saveConfig(config)
        alertMessage = "Configuration saved successfully!"
        showAlert = true
    }
}
