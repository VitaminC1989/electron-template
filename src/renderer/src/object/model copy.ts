// This file (model.js) contains all the logic for loading the model and running predictions.
import { pipeline, env, PipelineType } from '@xenova/transformers'

type ModelType = {
  run: (text: string) => Promise<any>
}

class MyClassificationPipeline {
  // NOTE: Replace this with your own task and model
  //   static task = 'text-classification'
  static task: PipelineType = 'text-classification'
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
  static instance: Function | null = null

  static async getInstance(progress_callback = undefined) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      //   let { pipeline, env } = await import('@xenova/transformers')

      // NOTE: Uncomment this to change the cache directory
      // env.cacheDir = './.cache';

      this.instance = await pipeline(this.task, this.model, { progress_callback })
    }

    return this.instance
  }
}

// The run function is used by the `transformers:run` event handler.
async function run(text: string) {
  const classifier = await MyClassificationPipeline.getInstance()
  return await classifier(text)
}

export default {
  run
}

export type { ModelType }
