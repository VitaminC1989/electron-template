// Copyright (c)  2024  Xiaomi Corporation (authors: Fangjun Kuang)
//
// const portAudio = require('naudiodon2')
// const sherpa_ncnn = require('sherpa-ncnn')
import portAudio from 'naudiodon2'
import sherpa_ncnn from 'sherpa-ncnn'
import path from 'path'
import { app } from 'electron'

function getModelPath() {
  return path.resolve(
    app.getAppPath(),
    'resources/models/sherpa-ncnn-streaming-zipformer-bilingual-zh-en-2023-02-13'
  )
}

function startRealTimeSpeechRecognition() {
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

  console.log(portAudio.getDevices())
  const recognizer = createRecognizer()
  const stream = recognizer.createStream()

  let lastText = ''
  let segmentIndex = 0

  // @ts-ignore
  const ai = new portAudio.AudioIO({
    inOptions: {
      channelCount: 1,
      closeOnError: true,
      deviceId: 4, // mac麦克风
      sampleFormat: portAudio.SampleFormatFloat32,
      sampleRate: recognizer.config.featConfig.samplingRate
    }
  })

  ai.on('data', (data) => {
    const samples = new Float32Array(data.buffer)

    stream.acceptWaveform(recognizer.config.featConfig.samplingRate, samples)

    while (recognizer.isReady(stream)) {
      recognizer.decode(stream)
    }

    const isEndpoint = recognizer.isEndpoint(stream)
    const text = recognizer.getResult(stream)

    if (text.length > 0 && lastText != text) {
      lastText = text
      console.log(segmentIndex, lastText)
    }
    if (isEndpoint) {
      if (text.length > 0) {
        lastText = text
        segmentIndex += 1
      }
      recognizer.reset(stream)
    }
  })

  ai.on('close', () => {
    console.log('Free resources')
    stream.free()
    recognizer.free()
  })

  ai.start()
  console.log('Started! Please speak')

  return {
    stop: () => {
      ai.quit()
    }
  }
}

startRealTimeSpeechRecognition()

export { startRealTimeSpeechRecognition }
