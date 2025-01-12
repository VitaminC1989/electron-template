import record from 'node-record-lpcm16'
import sherpa_ncnn from 'sherpa-ncnn'
import path from 'path'
import { app } from 'electron'

// 获取模型路径
function getModelPath() {
  return path.resolve(
    app.getAppPath(),
    'resources/models/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13'
  )
}

// 创建识别器
function createRecognizer() {
  let modelConfig = {
    encoderParam: path.resolve(getModelPath(), 'encoder_jit_trace-pnnx.ncnn.param'),
    encoderBin: path.resolve(getModelPath(), 'encoder_jit_trace-pnnx.ncnn.bin'),
    decoderParam: path.resolve(getModelPath(), 'decoder_jit_trace-pnnx.ncnn.param'),
    decoderBin: path.resolve(getModelPath(), 'decoder_jit_trace-pnnx.ncnn.bin'),
    joinerParam: path.resolve(getModelPath(), 'joiner_jit_trace-pnnx.ncnn.param'),
    joinerBin: path.resolve(getModelPath(), 'joiner_jit_trace-pnnx.ncnn.bin'),
    tokens: path.resolve(getModelPath(), 'tokens.txt'),
    useVulkanCompute: 0,
    numThreads: 1
  }

  let decoderConfig = {
    decodingMethod: 'greedy_search',
    numActivePaths: 4
  }

  let featConfig = {
    samplingRate: 16000,
    featureDim: 80
  }

  let config = {
    featConfig: featConfig,
    modelConfig: modelConfig,
    decoderConfig: decoderConfig,
    enableEndpoint: 1,
    rule1MinTrailingSilence: 1.2,
    rule2MinTrailingSilence: 2.4,
    rule3MinUtternceLength: 20
  }

  return sherpa_ncnn.createRecognizer(config)
}

// 启动实时语音识别
function startRealTimeSpeechRecognition() {
  const recognizer = createRecognizer()
  const stream = recognizer.createStream()

  let lastText = ''
  let segmentIndex = 0

  // 使用 node-record-lpcm16 录制麦克风音频
  const micStream = record.start({
    sampleRateHertz: 16000,
    channels: 1,
    threshold: 0,
    silence: 1000,
    verbose: false
  })

  micStream.on('data', (data) => {
    // 处理音频数据并转换为 Float32Array
    const samples = new Float32Array(data)

    // 向识别器提交音频样本
    stream.acceptWaveform(recognizer.config.featConfig.samplingRate, samples)

    // 如果流准备好，进行解码
    while (recognizer.isReady(stream)) {
      recognizer.decode(stream)
    }

    // 检查是否为终结点
    const isEndpoint = recognizer.isEndpoint(stream)
    const text = recognizer.getResult(stream)

    // 输出识别的文本
    if (text.length > 0 && lastText !== text) {
      lastText = text
      console.log(segmentIndex, lastText)
    }

    // 如果是终结点，重置流
    if (isEndpoint) {
      if (text.length > 0) {
        lastText = text
        segmentIndex += 1
      }
      recognizer.reset(stream)
    }
  })

  micStream.on('close', () => {
    console.log('Recording stopped')
    stream.free()
    recognizer.free()
  })

  console.log('Started! Please speak')

  return {
    stop: () => {
      record.stop()
    }
  }
}

export { startRealTimeSpeechRecognition }

