package com.verizon.voiceliveapp.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Base64
import android.util.Log
import kotlinx.coroutines.*
import java.util.concurrent.LinkedBlockingQueue

class AudioPlayer {
    companion object {
        private const val TAG = "AudioPlayer"
        private const val SAMPLE_RATE = 24000
        private const val CHANNEL_CONFIG = AudioFormat.CHANNEL_OUT_MONO
        private const val AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT
    }
    
    private var audioTrack: AudioTrack? = null
    private var playbackJob: Job? = null
    private val audioQueue = LinkedBlockingQueue<ByteArray>()
    private var isPlaying = false
    
    private val bufferSize = AudioTrack.getMinBufferSize(
        SAMPLE_RATE,
        CHANNEL_CONFIG,
        AUDIO_FORMAT
    )
    
    fun startPlayback() {
        if (isPlaying) return
        
        try {
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AUDIO_FORMAT)
                        .setSampleRate(SAMPLE_RATE)
                        .setChannelMask(CHANNEL_CONFIG)
                        .build()
                )
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()
            
            audioTrack?.play()
            isPlaying = true
            
            playbackJob = CoroutineScope(Dispatchers.IO).launch {
                while (isActive && isPlaying) {
                    val audioData = audioQueue.poll()
                    if (audioData != null) {
                        audioTrack?.write(audioData, 0, audioData.size)
                    } else {
                        delay(10) // Small delay if queue is empty
                    }
                }
            }
            
            Log.i(TAG, "Playback started")
        } catch (e: Exception) {
            Log.e(TAG, "Error starting playback", e)
        }
    }
    
    fun playAudio(base64Audio: String) {
        try {
            val audioData = Base64.decode(base64Audio, Base64.NO_WRAP)
            audioQueue.offer(audioData)
        } catch (e: Exception) {
            Log.e(TAG, "Error queuing audio", e)
        }
    }
    
    fun stopPlayback() {
        isPlaying = false
        playbackJob?.cancel()
        audioQueue.clear()
        
        try {
            audioTrack?.stop()
            audioTrack?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping playback", e)
        }
        
        audioTrack = null
        Log.i(TAG, "Playback stopped")
    }
    
    fun clearQueue() {
        audioQueue.clear()
        Log.i(TAG, "Audio queue cleared")
    }
}
