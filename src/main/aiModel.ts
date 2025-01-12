const sherpa_onnx = require('sherpa-onnx-node')
// import sherpa_onnx from 'sherpa-onnx-node'

const createOnlineRecognizer = () => {
  const config = {
    featConfig: {
      sampleRate: 16000,
      featureDim: 80
    },
    modelConfig: {
      paraformer: {
        encoder:
          '/resources/models/sherpa-onnx-streaming-paraformer-bilingual-zh-en/encoder.int8.onnx',
        decoder:
          '/resources/models/sherpa-onnx-streaming-paraformer-bilingual-zh-en/decoder.int8.onnx'
      },
      tokens: './sherpa-onnx-streaming-paraformer-bilingual-zh-en/tokens.txt',
      numThreads: 2,
      provider: 'cpu',
      debug: 1
    },
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    enableEndpoint: true,
    rule1MinTrailingSilence: 2.4,
    rule2MinTrailingSilence: 1.2,
    rule3MinUtteranceLength: 20
  }
  return new sherpa_onnx.OnlineRecognizer(config)
}

export { createOnlineRecognizer }
