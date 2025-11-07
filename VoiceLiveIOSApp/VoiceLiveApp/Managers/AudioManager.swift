import Foundation
import AVFoundation
import Combine

class AudioManager: NSObject, ObservableObject {
    private var audioEngine: AVAudioEngine?
    private var inputNode: AVAudioInputNode?
    private var audioPlayer: AVAudioPlayer?
    private var audioQueue: [Data] = []
    private var isPlaying = false
    
    @Published var isRecording = false
    @Published var hasPermission = false
    
    private var onAudioData: ((String) -> Void)?
    
    override init() {
        super.init()
        setupAudioSession()
    }
    
    private func setupAudioSession() {
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playAndRecord, mode: .voiceChat, options: [.defaultToSpeaker, .allowBluetooth])
            try audioSession.setActive(true)
        } catch {
            print("Audio session setup error: \(error)")
        }
    }
    
    func requestMicrophonePermission(completion: @escaping (Bool) -> Void) {
        AVAudioSession.sharedInstance().requestRecordPermission { granted in
            DispatchQueue.main.async {
                self.hasPermission = granted
                completion(granted)
            }
        }
    }
    
    func startRecording(onAudioData: @escaping (String) -> Void) {
        self.onAudioData = onAudioData
        
        audioEngine = AVAudioEngine()
        guard let audioEngine = audioEngine else { return }
        
        inputNode = audioEngine.inputNode
        guard let inputNode = inputNode else { return }
        
        let recordingFormat = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                           sampleRate: 24000,
                                           channels: 1,
                                           interleaved: false)
        
        guard let recordingFormat = recordingFormat else {
            print("Failed to create recording format")
            return
        }
        
        inputNode.installTap(onBus: 0, bufferSize: 4096, format: recordingFormat) { [weak self] buffer, time in
            self?.processAudioBuffer(buffer)
        }
        
        do {
            try audioEngine.start()
            isRecording = true
        } catch {
            print("Audio engine start error: \(error)")
        }
    }
    
    func stopRecording() {
        inputNode?.removeTap(onBus: 0)
        audioEngine?.stop()
        audioEngine = nil
        inputNode = nil
        isRecording = false
    }
    
    private func processAudioBuffer(_ buffer: AVAudioPCMBuffer) {
        guard let channelData = buffer.int16ChannelData else { return }
        
        let channelDataPointer = channelData.pointee
        let channelDataArray = Array(UnsafeBufferPointer(start: channelDataPointer, count: Int(buffer.frameLength)))
        
        let data = Data(bytes: channelDataArray, count: channelDataArray.count * MemoryLayout<Int16>.size)
        let base64 = data.base64EncodedString()
        
        onAudioData?(base64)
    }
    
    func startPlayback() {
        isPlaying = true
        processAudioQueue()
    }
    
    func stopPlayback() {
        isPlaying = false
        audioQueue.removeAll()
        audioPlayer?.stop()
        audioPlayer = nil
    }
    
    func playAudio(_ base64Audio: String) {
        guard let audioData = Data(base64Encoded: base64Audio) else { return }
        
        audioQueue.append(audioData)
        
        if isPlaying && audioPlayer == nil {
            processAudioQueue()
        }
    }
    
    func clearAudioQueue() {
        audioQueue.removeAll()
        audioPlayer?.stop()
        audioPlayer = nil
        
        if isPlaying {
            processAudioQueue()
        }
    }
    
    private func processAudioQueue() {
        guard isPlaying, !audioQueue.isEmpty, audioPlayer == nil else { return }
        
        let audioData = audioQueue.removeFirst()
        
        // Convert PCM16 data to playable format
        guard let pcmBuffer = createPCMBuffer(from: audioData) else {
            processAudioQueue()
            return
        }
        
        playPCMBuffer(pcmBuffer)
    }
    
    private func createPCMBuffer(from data: Data) -> AVAudioPCMBuffer? {
        let audioFormat = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                       sampleRate: 24000,
                                       channels: 1,
                                       interleaved: false)
        
        guard let audioFormat = audioFormat else { return nil }
        
        let frameCount = AVAudioFrameCount(data.count / MemoryLayout<Int16>.size)
        guard let buffer = AVAudioPCMBuffer(pcmFormat: audioFormat, frameCapacity: frameCount) else {
            return nil
        }
        
        buffer.frameLength = frameCount
        
        let audioBuffer = buffer.int16ChannelData![0]
        data.withUnsafeBytes { (bytes: UnsafeRawBufferPointer) in
            let int16Pointer = bytes.bindMemory(to: Int16.self)
            audioBuffer.update(from: int16Pointer.baseAddress!, count: Int(frameCount))
        }
        
        return buffer
    }
    
    private func playPCMBuffer(_ buffer: AVAudioPCMBuffer) {
        let audioFile = try? createTemporaryAudioFile(from: buffer)
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: audioFile!)
            audioPlayer?.delegate = self
            audioPlayer?.play()
        } catch {
            print("Audio playback error: \(error)")
            processAudioQueue()
        }
    }
    
    private func createTemporaryAudioFile(from buffer: AVAudioPCMBuffer) throws -> URL {
        let tempDir = FileManager.default.temporaryDirectory
        let fileURL = tempDir.appendingPathComponent(UUID().uuidString + ".wav")
        
        let settings: [String: Any] = [
            AVFormatIDKey: kAudioFormatLinearPCM,
            AVSampleRateKey: 24000,
            AVNumberOfChannelsKey: 1,
            AVLinearPCMBitDepthKey: 16,
            AVLinearPCMIsFloatKey: false,
            AVLinearPCMIsBigEndianKey: false
        ]
        
        let audioFile = try AVAudioFile(forWriting: fileURL, settings: settings)
        try audioFile.write(from: buffer)
        
        return fileURL
    }
}

extension AudioManager: AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        audioPlayer = nil
        
        // Clean up temp file
        try? FileManager.default.removeItem(at: player.url!)
        
        // Process next audio in queue
        processAudioQueue()
    }
}
