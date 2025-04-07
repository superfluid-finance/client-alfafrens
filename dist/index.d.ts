import { ModelClass, IAgentRuntime, Client, ClientInstance, Plugin, Action, UUID, Memory } from '@elizaos/core';

/**
 * configuration for AlfaFrens client
 */
interface AlfaFrensConfig$1 {
    /** API key for authentication */
    apiKey: string;
    /** user ID for the bot */
    userId: string;
    /** channel ID to interact with */
    channelId: string;
    /** username for the bot */
    username: string;
    /** interval between polling for messages in seconds */
    pollInterval: number;
    /** whether to enable automated posting */
    enablePost: boolean;
    /** minimum interval between posts in seconds */
    postIntervalMin: number;
    /** maximum interval between posts in seconds */
    postIntervalMax: number;
}
/**
 * message from AlfaFrens API
 */
interface AlfaFrensMessage {
    /** unique message ID */
    id: string;
    /** ID of the message sender */
    senderId: string;
    /** username of the message sender */
    senderUsername: string;
    /** message content */
    content: string;
    /** timestamp of the message */
    timestamp: string;
    /** ID of the message being replied to */
    replyTo?: string;
    /** Optional reactions to this message */
    reactions?: Array<{
        emoji: string;
        count: number;
        userIds: string[];
    }>;
}
/**
 * Response from sending a message
 */
interface AlfaFrensSendMessageResponse {
    /** Status of the request (success, error) */
    status: string;
    /** Unique ID of the created message */
    messageId: string;
    /** Timestamp when the message was created */
    timestamp: string;
}
/**
 * Options for getting messages
 */
interface GetMessagesOptions {
    /** Get messages since this timestamp */
    since?: number;
    /** Get messages until this timestamp */
    until?: number;
    /** Include reactions in the response */
    includeReactions?: boolean;
    /** Include replies in the response */
    includeReplies?: boolean;
}
interface AlfaFrensReaction {
    emoji: string;
    count: number;
}
interface AlfaFrensReplyTo {
    id: string;
    senderUsername: string;
    content: string;
}
/**
 * memory content for AlfaFrens messages
 */
interface AlfaFrensMemoryContent {
    /** message text */
    text: string;
    /** action to take */
    action?: string;
    /** ID of the message being replied to */
    inReplyTo?: string;
    /** source of the message */
    source?: string;
    /** user ID of the source */
    sourceUserId?: string;
    /** username of the source */
    sourceUserName?: string;
}
/**
 * generation configuration for AI operations
 */
interface AlfaFrensGenerationConfig {
    /** configuration for message evaluation */
    evaluation: {
        /** template for evaluation */
        template: string;
        /** model class to use */
        modelClass?: ModelClass;
    };
    /** configuration for response generation */
    response: {
        /** template for response */
        template: string;
        /** model class to use */
        modelClass?: ModelClass;
    };
    /** configuration for post generation */
    post: {
        /** template for post */
        template: string;
        /** model class to use */
        modelClass?: ModelClass;
    };
}

/**
 * AlfaFrens API client - handles HTTP communication with the AlfaFrens API
 */
declare class AlfaFrensApi {
    private apiKey;
    private channelId;
    private baseUrl;
    constructor(apiKey: string, channelId: string, baseUrl?: string);
    private fetch;
    /**
     * Gets messages from the channel
     * @param options Options for fetching messages
     * @returns Array of messages
     */
    getMessages(options?: {
        since?: number;
        until?: number;
        includeReactions?: boolean;
        includeReplies?: boolean;
    }): Promise<AlfaFrensMessage[]>;
    /**
     * Sends a new message to the channel
     * @param content Message content
     * @returns Response object with message ID and timestamp
     */
    sendMessage(content: string): Promise<AlfaFrensSendMessageResponse>;
    /**
     * Replies to an existing message in the channel
     * @param content Reply content
     * @param replyToPostId ID of the message to reply to
     * @returns Response object with message ID and timestamp
     */
    replyMessage(content: string, replyToPostId: string): Promise<AlfaFrensSendMessageResponse>;
    /**
     * Creates a new post in the channel
     * @param content Post content
     * @returns Response object with message ID and timestamp
     */
    createPost(content: string): Promise<AlfaFrensSendMessageResponse>;
    /**
     * Internal method to send messages with options
     */
    private sendMessageWithOptions;
}

interface AlfaFrensClient$1 {
    config: AlfaFrensConfig$1;
    getMessages(params: {
        roomId: string;
        since?: number;
        until?: number;
        includeReactions?: boolean;
        includeReplies?: boolean;
    }): Promise<AlfaFrensMessage[]>;
    createPost(params: {
        content: string;
        roomId: string;
    }): Promise<{
        memory: any;
        message: AlfaFrensMessage;
    }[]>;
    sendMessage(params: {
        content: string;
        roomId: string;
        inReplyTo?: string;
    }): Promise<{
        memory: any;
        message: AlfaFrensMessage;
    }[]>;
}
/**
 * options for configuring the AI interaction manager
 */
interface AlfaFrensAIInteractionOptions {
    /** template for evaluating whether to respond to a message */
    evaluationTemplate?: string;
    /** template for generating responses to messages */
    responseTemplate?: string;
    /** model class to use for generation */
    modelClass?: ModelClass;
    /** interval between checking for new messages in seconds */
    intervalSeconds?: number;
    /** maximum number of messages to keep in history */
    maxHistoryLength?: number;
    /** template for generating post content */
    postTemplate?: string;
    /** pre-loaded generation configuration */
    generationConfig?: AlfaFrensGenerationConfig;
}
/**
 * an extension for AI-powered interactions with AlfaFrens messages
 */
declare class AlfaFrensAIInteraction {
    private runtime;
    private client;
    private factValidationManager;
    private taskManager;
    private options;
    private isRunning;
    private messageHistory;
    private lastProcessedTime;
    private pollIntervalId;
    private postIntervalId;
    private sentMessageIds;
    /**
     * creates a new AI interaction manager
     * @param client the AlfaFrens client manager
     * @param runtime the agent runtime
     * @param options optional configuration options
     */
    constructor(client: AlfaFrensClient$1, runtime: IAgentRuntime, options?: AlfaFrensAIInteractionOptions);
    /**
     * start the automated interaction service
     * @param intervalSeconds optional override for seconds between checking (default from options or 30)
     */
    start(intervalSeconds?: number): Promise<void>;
    /**
     * stop the automated interaction service
     */
    stop(): Promise<void>;
    /**
     * process messages from the API
     */
    private processMessages;
    /**
     * Process a single message batch
     */
    private processMessageBatch;
    /**
     * format the conversation history for context
     * @returns formatted conversation history
     */
    private formatConversationHistory;
    /**
     * generate and create a new post
     * @param customContent optional custom content to post
     * @returns the created post
     */
    createPost(customContent?: string): Promise<any>;
    /**
     * generate content for a post using the AI
     * @param customTemplate optional override template for this specific generation
     * @returns generated post content
     */
    private generatePostContent;
    private extractFacts;
}

/**
 * Manager for interacting with AlfaFrens API
 */
declare class AlfaFrensManager implements ClientInstance, AlfaFrensClient$1 {
    /**
     * API client
     */
    api: AlfaFrensApi;
    /**
     * Configuration
     */
    config: AlfaFrensConfig$1;
    /**
     * Pre-loaded generation configuration
     */
    private generationConfig;
    /**
     * AI interaction manager
     */
    aiInteraction: AlfaFrensAIInteraction | null;
    /**
     * Agent runtime
     */
    runtime: IAgentRuntime;
    /**
     * Current operation status
     */
    isRunning: boolean;
    /**
     * Last processed time for messages
     */
    private lastProcessedTime;
    /**
     * Client name for ElizaOS
     */
    name: string;
    /**
     * Client description for ElizaOS
     */
    description: string;
    /**
     * Create a new AlfaFrens manager
     * @param runtime Agent runtime
     */
    constructor(runtime: IAgentRuntime);
    initialize(runtime: IAgentRuntime): Promise<void>;
    stop(runtime: IAgentRuntime): Promise<unknown>;
    /**
     * Get messages from AlfaFrens API
     */
    getMessages(params: {
        roomId: string;
        since?: number;
        until?: number;
        includeReactions?: boolean;
        includeReplies?: boolean;
    }): Promise<AlfaFrensMessage[]>;
    /**
     * Creates a message from API response and prepares memory
     */
    private prepareMessageAndMemory;
    sendMessage(params: {
        content: string;
        roomId: string;
        inReplyTo?: string;
    }): Promise<{
        memory: any;
        message: AlfaFrensMessage;
    }[]>;
    createPost(params: {
        content: string;
        roomId: string;
    }): Promise<{
        memory: any;
        message: AlfaFrensMessage;
    }[]>;
    /**
     * Search knowledge base using ElizaOS's built-in knowledge system
     * @param query Search query
     * @param limit Maximum number of results
     */
    searchKnowledge(query: string, limit?: number): Promise<any[]>;
    /**
     * Get knowledge context for a given query
     * @param query Search query
     */
    getKnowledgeContext(query: string): Promise<string>;
}
declare const AlfaFrensClientInterface: Client;

/**
 * plugin for AlfaFrens client
 */
declare const AlfaFrensPlugin: Plugin;

/**
 * AlfaFrens configuration
 */
interface AlfaFrensConfig {
    /** API key for the AlfaFrens API */
    apiKey: string;
    /** Channel ID for the AlfaFrens channel */
    channelId: string;
    /** User ID for the bot */
    userId: string;
    /** Username for the bot */
    username?: string;
    /** Base URL for the AlfaFrens API */
    baseUrl?: string;
    /** Polling interval in seconds */
    pollInterval?: number;
    /** Whether to enable post creation */
    enablePost?: boolean;
    /** Minimum interval between posts (seconds) */
    postIntervalMin?: number;
    /** Maximum interval between posts (seconds) */
    postIntervalMax?: number;
}

/**
 * options for configuring the AI post generator
 */
interface AlfaFrensAIPostOptions {
    /** template for generating post content */
    postTemplate?: string;
    /** model class to use for generation */
    modelClass?: ModelClass;
    /** interval between posts in seconds */
    intervalSeconds?: number;
}
/**
 * an extension for generating AI-powered posts for AlfaFrens
 */
declare class AlfaFrensAIPost {
    private runtime;
    private client;
    private interval?;
    private isRunning;
    private options;
    private lastPostTime;
    private taskManager;
    /**
     * creates a new AI post generator
     * @param client the AlfaFrens client manager
     * @param runtime the agent runtime
     * @param options optional configuration options
     */
    constructor(client: AlfaFrensManager, runtime: IAgentRuntime, options?: AlfaFrensAIPostOptions);
    /**
     * start the automated posting service
     * @param intervalSeconds optional override for seconds between posts (default from options or 3600)
     */
    start(intervalSeconds?: number): Promise<void>;
    /**
     * stop the automated posting service
     */
    stop(): Promise<void>;
    /**
     * generate and create a new post
     * @param customContent optional custom content to post
     * @returns the created post
     */
    private createPost;
    /**
     * generate content for a post using the AI
     * @param customTemplate optional override template for this specific generation
     * @returns generated post content
     */
    private generatePostContent;
}

/**
 * creates AlfaFrens actions that can be registered with the ElizaOS runtime
 */
declare function createAlfaFrensActions(client: AlfaFrensManager, runtime: IAgentRuntime): Action[];
/**
 * registers AlfaFrens actions with the ElizaOS runtime
 */
declare function registerAlfaFrensActions(client: AlfaFrensManager, runtime: IAgentRuntime): void;

/**
 * process a template string with runtime data
 * @param template template string with placeholders
 * @param runtime ElizaOS runtime
 * @param additionalData additional data for replacement
 * @returns processed template
 */
declare function processTemplate(template: string, runtime: IAgentRuntime, additionalData?: Record<string, any>): string;
/**
 * parse a model class string to ModelClass enum
 * @param modelClass string representation of model class
 * @returns ModelClass enum value or undefined
 */
declare function parseModelClass(modelClass?: string): ModelClass | undefined;
/**
 * gets a numeric setting from the character file with a default value
 * @param runtime ElizaOS runtime
 * @param key setting key
 * @param defaultValue default value if not found
 * @returns numeric setting value
 */
declare function getNumericSetting(runtime: IAgentRuntime, key: string, defaultValue: number): number;
/**
 * default template for generating post content
 */
declare const DEFAULT_POST_TEMPLATE = "You are {{character.name}}, an AI assistant with the following traits:\n{{character.adjectives}}\n\nYour topics of expertise include:\n{{character.topics}}\n\nTASK: Write a new post for a community channel.\n\nRULES:\n1. Write ONLY the post content\n2. Do not include any meta-commentary\n3. Start directly with your message\n4. Keep it engaging and relevant\n5. Maximum length: 2-3 sentences\n6. Be concise and meaningful\n\nPOST:";
/**
 * default template for generating responses
 */
declare const DEFAULT_RESPONSE_TEMPLATE = "You are {{character.name}}, an AI assistant with the following traits:\n{{character.adjectives}}\n\nYour topics of expertise include:\n{{character.topics}}\n\nCONVERSATION HISTORY:\n{{message.history}}\n\nUSER ({{message.sender}}): {{message.content}}\n\nTASK: Respond to the user's message.\n\nRULES:\n1. Keep responses concise (1-2 sentences)\n2. Be direct and helpful\n3. Stay focused on the question\n4. No meta-commentary\n\nYOUR RESPONSE:";
/**
 * default template for evaluating messages
 */
declare const DEFAULT_EVALUATION_TEMPLATE = "TASK: Decide whether the AI assistant should respond to this message.\n\nMessage: \"{{message.content}}\"\nSender: {{message.sender}}\n\nINSTRUCTIONS:\nYou are helping me decide if the AI assistant should respond to the message above.\nConsider the following:\n1. Is this a substantial message that requires a response?\n2. Is the message directed at the assistant?\n3. Is the message a question, request for help, or engaging in conversation?\n4. Is the message appropriate to respond to?\n\nResponse format:\nReturn a JSON array with:\n1. A boolean (true/false) indicating whether to respond\n2. A brief explanation for your decision\n\nExample response:\n```json\n[true, \"This is a direct question that the assistant should answer\"]\n```\n\nOr:\n```json\n[false, \"This message is too short and doesn't require a response\"]\n```\n";
/**
 * generates post content using the AI
 */
declare function generatePostContent(runtime: IAgentRuntime, config: AlfaFrensGenerationConfig['post']): Promise<string>;
/**
 * Generates a response to a message
 */
declare function generateResponse(runtime: IAgentRuntime, client: any, message: string, messageHistory: any[], template: string, modelClass?: ModelClass): Promise<string>;
/**
 * evaluate a message to determine if the AI should respond
 * @param runtime agent runtime
 * @param message the message to evaluate
 * @param config configuration for evaluation
 * @returns boolean indicating whether to respond
 */
declare function evaluateMessage(runtime: IAgentRuntime, message: AlfaFrensMessage, config: {
    template: string;
    modelClass?: ModelClass;
}): Promise<boolean>;

declare const utils_DEFAULT_EVALUATION_TEMPLATE: typeof DEFAULT_EVALUATION_TEMPLATE;
declare const utils_DEFAULT_POST_TEMPLATE: typeof DEFAULT_POST_TEMPLATE;
declare const utils_DEFAULT_RESPONSE_TEMPLATE: typeof DEFAULT_RESPONSE_TEMPLATE;
declare const utils_evaluateMessage: typeof evaluateMessage;
declare const utils_generatePostContent: typeof generatePostContent;
declare const utils_generateResponse: typeof generateResponse;
declare const utils_getNumericSetting: typeof getNumericSetting;
declare const utils_parseModelClass: typeof parseModelClass;
declare const utils_processTemplate: typeof processTemplate;
declare namespace utils {
  export { utils_DEFAULT_EVALUATION_TEMPLATE as DEFAULT_EVALUATION_TEMPLATE, utils_DEFAULT_POST_TEMPLATE as DEFAULT_POST_TEMPLATE, utils_DEFAULT_RESPONSE_TEMPLATE as DEFAULT_RESPONSE_TEMPLATE, utils_evaluateMessage as evaluateMessage, utils_generatePostContent as generatePostContent, utils_generateResponse as generateResponse, utils_getNumericSetting as getNumericSetting, utils_parseModelClass as parseModelClass, utils_processTemplate as processTemplate };
}

/**
 * AI extensions for the AlfaFrens client
 *
 * These extensions are optional and can be used to add AI capabilities
 * to the AlfaFrens client.
 */

type index_AlfaFrensAIInteraction = AlfaFrensAIInteraction;
declare const index_AlfaFrensAIInteraction: typeof AlfaFrensAIInteraction;
type index_AlfaFrensAIPost = AlfaFrensAIPost;
declare const index_AlfaFrensAIPost: typeof AlfaFrensAIPost;
declare const index_createAlfaFrensActions: typeof createAlfaFrensActions;
declare const index_registerAlfaFrensActions: typeof registerAlfaFrensActions;
declare const index_utils: typeof utils;
declare namespace index {
  export { index_AlfaFrensAIInteraction as AlfaFrensAIInteraction, index_AlfaFrensAIPost as AlfaFrensAIPost, index_createAlfaFrensActions as createAlfaFrensActions, index_registerAlfaFrensActions as registerAlfaFrensActions, index_utils as utils };
}

/**
 * create a memory for an AlfaFrens message
 * @param params memory parameters
 * @returns created memory
 */
declare function createAlfaFrensMemory(params: {
    roomId: UUID;
    senderId: UUID;
    runtime: IAgentRuntime;
    message: AlfaFrensMessage;
    isBotMessage: boolean;
}): Memory;

declare const actions: Action[];

declare const AlfaFrensClient: Client;

export { AlfaFrensApi, AlfaFrensClient, AlfaFrensClientInterface, type AlfaFrensConfig, type AlfaFrensGenerationConfig, type AlfaFrensMemoryContent, type AlfaFrensMessage, type AlfaFrensReaction, type AlfaFrensReplyTo, type AlfaFrensSendMessageResponse, index as Extensions, type GetMessagesOptions, actions as alfaFrensActions, createAlfaFrensMemory, AlfaFrensPlugin as default };
