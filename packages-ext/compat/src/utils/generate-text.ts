import type { CommonRequestOptions, GenerateTextOptions as XSAIGenerateTextOptions, GenerateTextResult as XSAIGenerateTextResult, Tool as XSAITool } from 'xsai'

import { generateText as xsaiGenerateText } from 'xsai'

import type { LanguageModel } from '../types'
import type { MessagesOrPrompts } from '../types/internal/messages-or-prompts'

import { convertPrompts } from './internal/convert-prompts'
import { convertTools } from './internal/convert-tools'

export interface GenerateTextResult<_T1 = undefined, _T2 = undefined> extends XSAIGenerateTextResult {}

type GenerateTextOptions = MessagesOrPrompts & Omit<XSAIGenerateTextOptions, 'tools' | keyof CommonRequestOptions> & {
  model: LanguageModel
  tools?: Record<string, () => Promise<XSAITool>>
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => xsaiGenerateText({
  ...options,
  ...options.model,
  messages: options.messages ?? convertPrompts(options.prompt!, options.system),
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
