'use client'

import { motion } from 'framer-motion'
import { Mic, Loader2 } from 'lucide-react'

interface RecordingIndicatorProps {
  isRecording: boolean
  isProcessing: boolean
}

export default function RecordingIndicator({ isRecording, isProcessing }: RecordingIndicatorProps) {
  if (!isRecording && !isProcessing) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white/95 backdrop-blur-sm border-2 border-indigo-200 rounded-full px-6 py-3 shadow-2xl flex items-center space-x-3">
        {isRecording && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <motion.div
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full"
              />
            </motion.div>
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-gray-900">녹음 중</span>
            </div>
          </>
        )}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-300">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-sm text-gray-600">AI 처리 중</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

