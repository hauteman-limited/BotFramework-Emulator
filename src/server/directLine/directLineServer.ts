import * as Restify from 'restify';
import { ConversationsControllerV1 } from './conversationsControllerV1';
import { RestServer } from '../restServer';
import { getSettings, addSettingsListener } from '../settings';
import { Settings } from '../../types/serverSettingsTypes';


/**
 * Communicates with the BotChat control.
 */
export class DirectLineServer extends RestServer {

    constructor() {
        super("directLine");
        ConversationsControllerV1.registerRoutes(this.server);
        addSettingsListener((settings: Settings) => {
            this.configure(settings);
        });
        this.configure(getSettings());
    }

    /**
     * Applies configuration changes.
     */
    private configure(settings: Settings) {
        if (this.port !== settings.directLine.port) {
            console.log(`restarting ${this.server.name} because ${this.port} !== ${settings.directLine.port}`);
            this.restart(settings.directLine.port);
        }
    }
}