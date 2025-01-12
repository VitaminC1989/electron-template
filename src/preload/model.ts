import { ipcRenderer } from 'electron'
import { MESSAGE_TYPE } from '@config/communication'
export default {
  run: (text: string) => ipcRenderer.invoke(MESSAGE_TYPE.MODEL_RUN, text),
  decodeAudioFile: (audio: string) =>
    ipcRenderer.invoke(MESSAGE_TYPE.MODEL_DECODE_AUDIO_FILE, audio),
  startRealTimeSpeechRecognition: () =>
    ipcRenderer.invoke(MESSAGE_TYPE.MODEL_START_REAL_TIME_SPEECH_RECOGNITION)
}
