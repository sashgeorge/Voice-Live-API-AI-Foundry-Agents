package com.verizon.voiceliveapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.verizon.voiceliveapp.audio.AudioPlayer
import com.verizon.voiceliveapp.audio.AudioRecorder
import com.verizon.voiceliveapp.databinding.ActivityMainBinding
import com.verizon.voiceliveapp.models.ChatMessage
import com.verizon.voiceliveapp.models.MessageSender
import com.verizon.voiceliveapp.network.VoiceLiveWebSocketClient
import com.verizon.voiceliveapp.ui.MessagesAdapter
import com.verizon.voiceliveapp.utils.ConfigManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {
    
    companion object {
        private const val TAG = "MainActivity"
        private const val REQUEST_RECORD_AUDIO = 101
    }
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var configManager: ConfigManager
    private lateinit var messagesAdapter: MessagesAdapter
    
    private var webSocketClient: VoiceLiveWebSocketClient? = null
    private var audioRecorder: AudioRecorder? = null
    private var audioPlayer: AudioPlayer? = null
    
    private var isConversationActive = false
    private val assistantTranscriptBuilder = StringBuilder()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        configManager = ConfigManager(this)
        setupRecyclerView()
        setupClickListeners()
        checkConfiguration()
    }
    
    private fun setupRecyclerView() {
        messagesAdapter = MessagesAdapter()
        binding.messagesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = messagesAdapter
        }
    }
    
    private fun setupClickListeners() {
        binding.startStopButton.setOnClickListener {
            if (isConversationActive) {
                stopConversation()
            } else {
                checkPermissionsAndStart()
            }
        }
        
        binding.settingsButton.setOnClickListener {
            startActivity(Intent(this, ConfigActivity::class.java))
        }
    }
    
    private fun checkConfiguration() {
        if (!configManager.hasConfig()) {
            MaterialAlertDialogBuilder(this)
                .setTitle(R.string.configuration_incomplete)
                .setMessage(R.string.config_info)
                .setPositiveButton(R.string.settings) { _, _ ->
                    startActivity(Intent(this, ConfigActivity::class.java))
                }
                .setNegativeButton(android.R.string.cancel, null)
                .show()
        }
    }
    
    private fun checkPermissionsAndStart() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                REQUEST_RECORD_AUDIO
            )
        } else {
            startConversation()
        }
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_RECORD_AUDIO) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startConversation()
            } else {
                Toast.makeText(
                    this,
                    R.string.microphone_permission_required,
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
    
    private fun startConversation() {
        val config = configManager.loadConfig()
        if (config == null || !config.isValid()) {
            Toast.makeText(this, R.string.configuration_incomplete, Toast.LENGTH_SHORT).show()
            return
        }
        
        updateUI(connecting = true)
        
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                // For simplicity, using a placeholder token
                // In production, implement proper Azure authentication
                val accessToken = getAzureAccessToken()
                
                withContext(Dispatchers.Main) {
                    connectWebSocket(config, accessToken)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error getting token", e)
                withContext(Dispatchers.Main) {
                    Toast.makeText(
                        this@MainActivity,
                        "Authentication error: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                    updateUI(connecting = false)
                }
            }
        }
    }
    
    private suspend fun getAzureAccessToken(): String {
        // TODO: Implement Azure authentication
        // For now, return a placeholder
        // In production, use Azure Identity library to get token
        return "placeholder_token"
    }
    
    private fun connectWebSocket(config: com.verizon.voiceliveapp.models.AzureConfig, token: String) {
        webSocketClient = VoiceLiveWebSocketClient(config, token).apply {
            setListener(object : VoiceLiveWebSocketClient.WebSocketListener {
                override fun onConnected() {
                    runOnUiThread {
                        isConversationActive = true
                        updateUI(connecting = false, active = true)
                        Toast.makeText(
                            this@MainActivity,
                            R.string.conversation_started,
                            Toast.LENGTH_SHORT
                        ).show()
                        
                        // Start audio recording and playback
                        startAudioServices()
                    }
                }
                
                override fun onAudioReceived(audioBase64: String) {
                    audioPlayer?.playAudio(audioBase64)
                }
                
                override fun onTranscriptReceived(type: String, text: String) {
                    runOnUiThread {
                        when (type) {
                            "user" -> {
                                addMessage(ChatMessage(MessageSender.USER, text))
                            }
                            "assistant" -> {
                                assistantTranscriptBuilder.append(text)
                            }
                        }
                    }
                }
                
                override fun onSpeechStarted() {
                    runOnUiThread {
                        audioPlayer?.clearQueue()
                        Log.i(TAG, "User speech started - cleared audio queue")
                    }
                }
                
                override fun onResponseStarted() {
                    runOnUiThread {
                        assistantTranscriptBuilder.clear()
                    }
                }
                
                override fun onResponseCompleted() {
                    runOnUiThread {
                        if (assistantTranscriptBuilder.isNotEmpty()) {
                            addMessage(
                                ChatMessage(
                                    MessageSender.ASSISTANT,
                                    assistantTranscriptBuilder.toString()
                                )
                            )
                            assistantTranscriptBuilder.clear()
                        }
                    }
                }
                
                override fun onError(error: String) {
                    runOnUiThread {
                        Toast.makeText(
                            this@MainActivity,
                            "Error: $error",
                            Toast.LENGTH_LONG
                        ).show()
                        stopConversation()
                    }
                }
                
                override fun onDisconnected() {
                    runOnUiThread {
                        stopConversation()
                    }
                }
            })
            connect()
        }
    }
    
    private fun startAudioServices() {
        // Start audio recorder
        audioRecorder = AudioRecorder().apply {
            startRecording { audioBase64 ->
                webSocketClient?.sendAudioChunk(audioBase64)
            }
        }
        
        // Start audio player
        audioPlayer = AudioPlayer().apply {
            startPlayback()
        }
    }
    
    private fun stopConversation() {
        isConversationActive = false
        
        // Stop audio services
        audioRecorder?.stopRecording()
        audioRecorder = null
        
        audioPlayer?.stopPlayback()
        audioPlayer = null
        
        // Disconnect WebSocket
        webSocketClient?.disconnect()
        webSocketClient = null
        
        updateUI(connecting = false, active = false)
        
        Toast.makeText(this, R.string.conversation_stopped, Toast.LENGTH_SHORT).show()
    }
    
    private fun updateUI(connecting: Boolean = false, active: Boolean = false) {
        binding.apply {
            if (connecting) {
                progressBar.visibility = View.VISIBLE
                startStopButton.isEnabled = false
                statusText.text = getString(R.string.status_connecting)
                connectionStatus.text = getString(R.string.status_connecting)
                statusIndicator.backgroundTintList = ContextCompat.getColorStateList(
                    this@MainActivity,
                    R.color.status_connecting
                )
            } else if (active) {
                progressBar.visibility = View.GONE
                startStopButton.isEnabled = true
                startStopButton.text = getString(R.string.stop_conversation)
                startStopButton.icon = ContextCompat.getDrawable(
                    this@MainActivity,
                    R.drawable.ic_stop
                )
                startStopButton.backgroundTintList = ContextCompat.getColorStateList(
                    this@MainActivity,
                    R.color.danger_red
                )
                statusText.text = getString(R.string.status_active)
                connectionStatus.text = getString(R.string.status_active)
                statusIndicator.backgroundTintList = ContextCompat.getColorStateList(
                    this@MainActivity,
                    R.color.status_active
                )
                
                // Hide empty state, show messages
                emptyState.visibility = View.GONE
                messagesRecyclerView.visibility = View.VISIBLE
            } else {
                progressBar.visibility = View.GONE
                startStopButton.isEnabled = true
                startStopButton.text = getString(R.string.start_conversation)
                startStopButton.icon = ContextCompat.getDrawable(
                    this@MainActivity,
                    R.drawable.ic_microphone
                )
                startStopButton.backgroundTintList = ContextCompat.getColorStateList(
                    this@MainActivity,
                    R.color.success_green
                )
                statusText.text = getString(R.string.status_ready)
                connectionStatus.text = getString(R.string.status_ready)
                statusIndicator.backgroundTintList = ContextCompat.getColorStateList(
                    this@MainActivity,
                    R.color.status_ready
                )
            }
        }
    }
    
    private fun addMessage(message: ChatMessage) {
        messagesAdapter.addMessage(message)
        binding.messagesRecyclerView.smoothScrollToPosition(messagesAdapter.itemCount - 1)
    }
    
    override fun onDestroy() {
        super.onDestroy()
        stopConversation()
    }
}
