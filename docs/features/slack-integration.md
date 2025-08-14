# Slack Integration

This document describes the Slack integration feature that automatically sends notifications to a Slack channel when contact forms are successfully submitted.

## Overview

The Slack integration provides real-time notifications for contact form submissions, allowing your team to respond quickly to potential leads and inquiries. It uses Slack's Incoming Webhooks for secure, reliable message delivery.

## Features

- **Real-time notifications**: Instant alerts when forms are submitted
- **Rich formatting**: Beautiful, structured messages using Slack's Block Kit
- **Non-blocking**: Form submission continues even if Slack notification fails
- **Security**: Webhook URL stored securely in environment variables
- **Error handling**: Comprehensive logging and error management
- **Performance**: Asynchronous message sending to avoid delays

## Setup

### 1. Create Slack App and Webhook

1. Go to [Slack API Apps page](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give your app a name and select your workspace
4. In the left sidebar, go to "Incoming Webhooks"
5. Toggle "Activate Incoming Webhooks" to On
6. Click "Add New Webhook to Workspace"
7. Choose the channel where you want to receive notifications
8. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

### 2. Environment Configuration

Add the Slack webhook URL to your environment variables:

```bash
# .env file
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Docker environment
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 3. Docker Configuration

Update your `docker.env.example` file:

```bash
SLACK_WEBHOOK_URL=
```

## Message Format

The Slack integration sends beautifully formatted messages using Slack's Block Kit:

### Contact Form Submission Message

- **Header**: 📧 New Contact Form Submission
- **Fields**: Name, Email, Phone (if provided), Subject
- **Message**: Full message content
- **Context**: Submission ID, IP address, processing time
- **Visual**: Clean sections with dividers and emojis

### Example Message Structure

```
📧 New Contact Form Submission

Name: John Doe
Email: john@example.com

Phone: +1 (555) 123-4567
Subject: Web Development Inquiry

Message: I'm interested in your web development services...

🆔 Submission ID: abc123 | 🌐 IP: 192.168.1.1 | ⏱️ Processing: 45ms
```

## Configuration Options

### Environment Variables

| Variable            | Description                         | Required | Default |
| ------------------- | ----------------------------------- | -------- | ------- |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for notifications | Yes      | -       |

### Message Customization

The Slack service provides several methods for creating different message types:

- `createContactFormMessage()` - Contact form submissions
- `createTextMessage()` - Simple text messages
- `createErrorMessage()` - Error notifications

## Error Handling

### Graceful Degradation

- If `SLACK_WEBHOOK_URL` is not configured, Slack notifications are disabled
- Form submissions continue to work normally
- Warning logs are generated when Slack is disabled

### Failure Handling

- Slack message failures don't affect form submission
- All errors are logged for debugging
- Non-blocking implementation ensures performance

## Security Best Practices

1. **Never expose webhook URLs** in client-side code
2. **Use environment variables** for configuration
3. **Validate webhook URLs** before use
4. **Monitor webhook usage** for unusual activity
5. **Rotate webhook URLs** periodically if needed

## Monitoring and Logging

### Log Levels

- **Debug**: Successful message delivery
- **Info**: Service initialization and configuration
- **Warn**: Missing configuration or disabled service
- **Error**: Failed message delivery or webhook errors

### Log Messages

```
[DEBUG] Slack message sent successfully
[WARN] SLACK_WEBHOOK_URL not configured, Slack notifications disabled
[ERROR] Slack webhook failed: 400 Bad Request
[ERROR] Failed to send Slack notification: Network error
```

## Testing

### Local Development

1. Set `SLACK_WEBHOOK_URL` in your `.env` file
2. Submit a test contact form
3. Check your Slack channel for the notification
4. Verify message formatting and content

### Production Testing

1. Deploy with proper environment variables
2. Submit a real contact form
3. Confirm notification delivery
4. Check error logs for any issues

## Troubleshooting

### Common Issues

#### No Notifications Received

- Verify `SLACK_WEBHOOK_URL` is set correctly
- Check that the webhook is active in Slack
- Ensure the webhook is added to the correct channel
- Review server logs for error messages

#### Webhook Errors

- **400 Bad Request**: Check message format and size
- **403 Forbidden**: Verify webhook URL and permissions
- **429 Too Many Requests**: Rate limiting, reduce message frequency
- **500 Internal Server Error**: Slack service issue, check status page

#### Performance Issues

- Messages are sent asynchronously by default
- Form submission performance is not affected
- Check network connectivity to Slack APIs

### Debug Mode

Enable debug logging to see detailed Slack service information:

```typescript
logger.setLevel('debug');
```

## API Reference

### SlackService Class

```typescript
class SlackService {
  constructor(webhookUrl: string);
  async sendMessage(message: SlackMessage): Promise<boolean>;
  createContactFormMessage(data: ContactFormData): SlackMessage;
  createTextMessage(text: string): SlackMessage;
  createErrorMessage(error: string, context?: Record<string, any>): SlackMessage;
}
```

### Message Interfaces

```typescript
interface SlackMessage {
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
}
```

## Future Enhancements

- **Message templates**: Customizable message formats
- **Channel selection**: Send to different channels based on form type
- **Rich media**: Support for attachments and images
- **Threading**: Organize related messages in threads
- **Mentioning**: @mention team members for urgent inquiries
- **Scheduling**: Delayed notifications for non-business hours

## Support

For issues or questions about the Slack integration:

1. Check the logs for error messages
2. Verify environment variable configuration
3. Test webhook URL in Slack's webhook testing tool
4. Review this documentation for troubleshooting steps
5. Contact the development team if issues persist
