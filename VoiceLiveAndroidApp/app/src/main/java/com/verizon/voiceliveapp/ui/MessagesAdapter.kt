package com.verizon.voiceliveapp.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.verizon.voiceliveapp.R
import com.verizon.voiceliveapp.models.ChatMessage
import com.verizon.voiceliveapp.models.MessageSender
import java.text.SimpleDateFormat
import java.util.*

class MessagesAdapter : RecyclerView.Adapter<MessagesAdapter.MessageViewHolder>() {
    
    private val messages = mutableListOf<ChatMessage>()
    private val dateFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
    
    fun addMessage(message: ChatMessage) {
        messages.add(message)
        notifyItemInserted(messages.size - 1)
    }
    
    fun clearMessages() {
        messages.clear()
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_message, parent, false)
        return MessageViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        holder.bind(messages[position])
    }
    
    override fun getItemCount(): Int = messages.size
    
    inner class MessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val cardView: CardView = itemView.findViewById(R.id.item_message)
        private val senderLabel: TextView = itemView.findViewById(R.id.senderLabel)
        private val messageText: TextView = itemView.findViewById(R.id.messageText)
        private val timestampText: TextView = itemView.findViewById(R.id.timestampText)
        
        fun bind(message: ChatMessage) {
            // Set sender label
            senderLabel.text = when (message.sender) {
                MessageSender.USER -> itemView.context.getString(R.string.you)
                MessageSender.ASSISTANT -> itemView.context.getString(R.string.assistant)
                MessageSender.SYSTEM -> itemView.context.getString(R.string.system)
            }
            
            // Set message text
            messageText.text = message.text
            
            // Set timestamp
            timestampText.text = dateFormat.format(Date(message.timestamp))
            
            // Set background color based on sender
            val backgroundColor = when (message.sender) {
                MessageSender.USER -> R.color.user_message_bg
                MessageSender.ASSISTANT -> R.color.assistant_message_bg
                MessageSender.SYSTEM -> R.color.system_message_bg
            }
            cardView.setCardBackgroundColor(
                ContextCompat.getColor(itemView.context, backgroundColor)
            )
            
            // Adjust layout params for alignment
            val layoutParams = cardView.layoutParams as ViewGroup.MarginLayoutParams
            when (message.sender) {
                MessageSender.USER -> {
                    layoutParams.marginStart = 60
                    layoutParams.marginEnd = 0
                }
                MessageSender.ASSISTANT -> {
                    layoutParams.marginStart = 0
                    layoutParams.marginEnd = 60
                }
                MessageSender.SYSTEM -> {
                    layoutParams.marginStart = 30
                    layoutParams.marginEnd = 30
                }
            }
            cardView.layoutParams = layoutParams
        }
    }
}
