//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { BotFrameworkService } from './botFrameworkService';
import { ConversationManager } from './conversationManager';
import * as Settings from './settings';
import * as Electron from 'electron';
import { windowManager, mainWindow } from './main';
import { getActiveBot } from './botHelpers';
import { ISpeechTokenInfo } from '@bfemulator/app-shared';


interface IQueuedMessage {
  channel: any,
  args: any[]
}

/**
 * Top-level state container for the Node process.
 */
export class Emulator {
  framework = new BotFrameworkService();
  conversations = new ConversationManager();
  static queuedMessages: IQueuedMessage[] = [];

  public getSpeechToken(authIdEvent: string, conversationId: string, refresh: boolean): Promise<ISpeechTokenInfo> {
    const activeBot = getActiveBot();
    const conversation = this.conversations.conversationById(activeBot.id, conversationId);
    if (conversation) {
      return new Promise<ISpeechTokenInfo>((resolve, reject) => {
        conversation.getSpeechToken(10, (tokenInfo) => {
          resolve(tokenInfo);
        }, refresh);
      });
    }
    return Promise.resolve({
      error: 'No bot',
      error_Description: 'To use speech, you must connect to a bot and have an active conversation.'
    });
  }

  /**
   * Loads settings from disk and then creates the emulator.
   */
  static startup() {
    Settings.startup();
    emulator = new Emulator();
    emulator.framework.startup();
  }
}

export let emulator: Emulator;