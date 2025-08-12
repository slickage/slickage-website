import { logger } from '@/lib/utils/logger';

export interface SlackMessage {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
}

export interface SlackBlock {
  type: string;
  text?: SlackText;
  fields?: SlackField[];
  elements?: SlackElement[];
}

export interface SlackText {
  type: 'plain_text' | 'mrkdwn';
  text: string;
  emoji?: boolean;
}

export interface SlackField {
  type: 'mrkdwn';
  text: string;
}

export interface SlackElement {
  type: 'mrkdwn' | 'plain_text';
  text: string;
  url?: string;
}

export interface SlackAttachment {
  color?: string;
  title?: string;
  text?: string;
  fields?: SlackField[];
}

export class SlackService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Send a message to Slack using the webhook URL
   */
  async sendMessage(message: SlackMessage): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Slack webhook failed: ${response.status} ${response.statusText}`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        return false;
      }

      logger.debug('Slack message sent successfully');
      return true;
    } catch (error) {
      logger.error('Error sending Slack message:', error);
      return false;
    }
  }

  /**
   * Create a formatted contact form submission message
   */
  createContactFormMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    submissionId: string;
    clientIp: string;
    processingTime: number;
  }): SlackMessage {
    const { name, email, phone, subject, message, submissionId, clientIp, processingTime } = data;

    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📧 New Contact Form Submission',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Name:*\n${name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${email}`,
            },
          ],
        },
        ...(phone
          ? [
              {
                type: 'section' as const,
                fields: [
                  {
                    type: 'mrkdwn' as const,
                    text: `*Phone:*\n${phone}`,
                  },
                  {
                    type: 'mrkdwn' as const,
                    text: `*Subject:*\n${subject}`,
                  },
                ],
              },
            ]
          : [
              {
                type: 'section' as const,
                fields: [
                  {
                    type: 'mrkdwn' as const,
                    text: `*Subject:*\n${subject}`,
                  },
                ],
              },
            ]),
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${message}`,
          },
        },
        {
          type: 'context' as const,
          elements: [
            {
              type: 'mrkdwn' as const,
              text: `🆔 *Submission ID:* ${submissionId} | 🌐 *IP:* ${clientIp} | ⏱️ *Processing:* ${processingTime}ms`,
            },
          ],
        },
        {
          type: 'divider' as const,
        },
      ],
    };
  }

  /**
   * Create a simple text message
   */
  createTextMessage(text: string): SlackMessage {
    return { text };
  }

  /**
   * Create an error notification message
   */
  createErrorMessage(error: string, context?: Record<string, any>): SlackMessage {
    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚠️ Error Alert',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Error:*\n${error}`,
        },
      },
    ];

    if (context && Object.keys(context).length > 0) {
      const contextFields = Object.entries(context).map(([key, value]) => ({
        type: 'mrkdwn' as const,
        text: `*${key}:*\n${value}`,
      }));

      blocks.push({
        type: 'section',
        fields: contextFields,
      });
    }

    blocks.push({ type: 'divider' });

    return { blocks };
  }
}

/**
 * Create a Slack service instance
 */
export function createSlackService(): SlackService | null {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    logger.warn('SLACK_WEBHOOK_URL not configured, Slack notifications disabled');
    return null;
  }

  return new SlackService(webhookUrl);
}
