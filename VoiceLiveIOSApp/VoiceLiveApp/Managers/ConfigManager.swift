import Foundation
import Combine

class ConfigManager: ObservableObject {
    @Published var hasValidConfig: Bool = false
    
    private let userDefaults = UserDefaults.standard
    private let configKey = "azure_config"
    
    init() {
        hasValidConfig = loadConfig()?.isValid ?? false
    }
    
    func saveConfig(_ config: AzureConfig) {
        if let encoded = try? JSONEncoder().encode(config) {
            userDefaults.set(encoded, forKey: configKey)
            hasValidConfig = config.isValid
        }
    }
    
    func loadConfig() -> AzureConfig? {
        guard let data = userDefaults.data(forKey: configKey),
              let config = try? JSONDecoder().decode(AzureConfig.self, from: data) else {
            return nil
        }
        return config
    }
    
    func clearConfig() {
        userDefaults.removeObject(forKey: configKey)
        hasValidConfig = false
    }
}
