/**
 * 跨浏览器语音朗读工具
 * 解决 Chrome 浏览器的兼容性问题
 */

interface SpeechOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

/**
 * 检查浏览器是否支持语音合成
 */
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window
}

/**
 * 获取可用的语音列表
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return []
  return window.speechSynthesis.getVoices()
}

/**
 * 查找最佳匹配的语音
 */
export function findBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices()
  
  // 优先查找完全匹配的语音
  let voice = voices.find(v => v.lang === lang)
  
  // 如果没有完全匹配，查找语言代码匹配的
  if (!voice) {
    const langCode = lang.split('-')[0]
    voice = voices.find(v => v.lang.startsWith(langCode))
  }
  
  // 如果是粤语，尝试多种可能的语言代码
  if (!voice && (lang === 'zh-HK' || lang === 'yue-HK')) {
    voice = voices.find(v => 
      v.lang === 'zh-HK' || 
      v.lang === 'yue-HK' || 
      v.lang === 'zh-TW' ||
      v.name.toLowerCase().includes('cantonese') ||
      v.name.toLowerCase().includes('hong kong')
    )
  }
  
  return voice || null
}

/**
 * 播放语音（Chrome 兼容版本）
 */
export function speak(text: string, options: SpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    // 停止当前正在播放的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // 设置语言
    utterance.lang = options.lang || 'zh-HK'
    utterance.rate = options.rate || 0.7
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    // 尝试找到最佳语音
    const voice = findBestVoice(utterance.lang)
    if (voice) {
      utterance.voice = voice
    }

    // 事件监听
    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      reject(event)
    }

    // Chrome 需要短暂延迟才能正常工作
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

/**
 * 停止当前语音播放
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel()
  }
}

/**
 * 暂停语音播放
 */
export function pauseSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.pause()
  }
}

/**
 * 恢复语音播放
 */
export function resumeSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.resume()
  }
}

/**
 * 检查是否正在播放
 */
export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false
  return window.speechSynthesis.speaking
}

/**
 * 预加载语音列表（Chrome 需要）
 */
export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([])
      return
    }

    let voices = window.speechSynthesis.getVoices()
    
    if (voices.length > 0) {
      resolve(voices)
      return
    }

    // Chrome 需要等待 voiceschanged 事件
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices()
      resolve(voices)
    }

    // 超时保护
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices()
      resolve(voices)
    }, 1000)
  })
}
