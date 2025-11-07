package com.verizon.voiceliveapp.network

import android.util.Log
import com.verizon.voiceliveapp.models.AzureConfig
import kotlinx.coroutines.*
import okhttp3.*
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class VoiceLiveWebSocketClient(
    private val config: AzureConfig,
    private val accessToken: String
) {
    companion object {
        private const val TAG = "VoiceLiveWebSocket"
    }
    
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .connectTimeout(10, TimeUnit.SECONDS)
        .build()
    
    interface WebSocketListener {
        fun onConnected()
        fun onAudioReceived(audioBase64: String)
        fun onTranscriptReceived(type: String, text: String)
        fun onSpeechStarted()
        fun onResponseStarted()
        fun onResponseCompleted()
        fun onError(error: String)
        fun onDisconnected()
    }
    
    private var listener: WebSocketListener? = null
    
    fun setListener(listener: WebSocketListener) {
        this.listener = listener
    }
    
    fun connect() {
        val wsEndpoint = config.endpoint
            .replace("https://", "wss://")
            .trimEnd('/')
        
        val url = "$wsEndpoint/voice-live/realtime?" +
                "api-version=${config.apiVersion}&" +
                "agent-project-name=${config.projectName}&" +
                "agent-id=${config.agentId}&" +
                "agent-access-token=$accessToken"
        
        val request = Request.Builder()
            .url(url)
            .build()
        
        webSocket = client.newWebSocket(request, object : okhttp3.WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.i(TAG, "WebSocket connected")
                listener?.onConnected()
                sendSessionConfig()
            }
            
            override fun onMessage(webSocket: WebSocket, text: String) {
                handleMessage(text)
            }
            
            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e(TAG, "WebSocket error", t)
                listener?.onError(t.message ?: "Connection failed")
            }
            
            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                Log.i(TAG, "WebSocket closing: $reason")
            }
            
            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                Log.i(TAG, "WebSocket closed")
                listener?.onDisconnected()
            }
        })
    }
    
    private fun sendSessionConfig() {
        val sessionUpdate = JSONObject().apply {
            put("type", "session.update")
            put("session", JSONObject().apply {
                put("turn_detection", JSONObject().apply {
                    put("type", "azure_semantic_vad")
                    put("threshold", 0.3)
                    put("prefix_padding_ms", 200)
                    put("silence_duration_ms", 200)
                    put("remove_filler_words", false)
                    put("end_of_utterance_detection", JSONObject().apply {
                        put("model", "semantic_detection_v1")
                        put("threshold", 0.01)
                        put("timeout", 2)
                    })
                })
                put("input_audio_noise_reduction", JSONObject().apply {
                    put("type", "azure_deep_noise_suppression")
                })
                put("input_audio_echo_cancellation", JSONObject().apply {
                    put("type", "server_echo_cancellation")
                })
                put("voice", JSONObject().apply {
                    put("name", "en-US-Ava:DragonHDLatestNeural")
                    put("type", "azure-standard")
                    put("temperature", 0.8)
                })
            })
            put("event_id", "")
        }
        
        sendMessage(sessionUpdate.toString())
        
        // Send greeting
        val greeting = JSONObject().apply {
            put("type", "response.create")
            put("response", JSONObject().apply {
                put("modalities", org.json.JSONArray().apply {
                    put("text")
                    put("audio")
                })
                put("instructions", "Greet the user with this message: 'Hello. I am Wendy. Helpful Verizon assistant who can help with your Verizon home equipments.'")
            })
            put("event_id", "")
        }
        sendMessage(greeting.toString())
    }
    
    private fun handleMessage(text: String) {
        try {
            val json = JSONObject(text)
            val type = json.optString("type", "")
            
            when {
                type == "response.audio.delta" -> {
                    val delta = json.optString("delta", "")
                    if (delta.isNotEmpty()) {
                        listener?.onAudioReceived(delta)
                    }
                }
                type == "conversation.item.input_audio_transcription.completed" -> {
                    val transcript = json.optString("transcript", "")
                    listener?.onTranscriptReceived("user", transcript)
                }
                type == "response.audio_transcript.delta" -> {
                    val delta = json.optString("delta", "")
                    listener?.onTranscriptReceived("assistant", delta)
                }
                type == "input_audio_buffer.speech_started" -> {
                    listener?.onSpeechStarted()
                }
                type == "response.created" -> {
                    listener?.onResponseStarted()
                }
                type == "response.done" -> {
                    listener?.onResponseCompleted()
                }
                type.contains("error") -> {
                    val error = json.optJSONObject("error")
                    val message = error?.optString("message") ?: "Unknown error"
                    listener?.onError(message)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing message", e)
        }
    }
    
    fun sendAudioChunk(audioBase64: String) {
        val message = JSONObject().apply {
            put("type", "input_audio_buffer.append")
            put("audio", audioBase64)
            put("event_id", "")
        }
        sendMessage(message.toString())
    }
    
    private fun sendMessage(message: String) {
        webSocket?.send(message)
    }
    
    fun disconnect() {
        webSocket?.close(1000, "Client disconnect")
        webSocket = null
    }
}
