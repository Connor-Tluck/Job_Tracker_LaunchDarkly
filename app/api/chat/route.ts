import { NextRequest, NextResponse } from 'next/server';
import { getLDServerClient, convertToLDContext } from '@/lib/launchdarkly/serverClient';
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

// Ensure this route runs in the Node.js runtime (required for LaunchDarkly server SDK + OTel instrumentation).
export const runtime = "nodejs";

let openAIInstrumentationRegistered = false;

function ensureOpenAIInstrumentationRegistered() {
  if (openAIInstrumentationRegistered) return;
  // IMPORTANT (per LaunchDarkly docs): initialize the LaunchDarkly SDK first, then register OpenLLMetry instrumentations,
  // then import/use the provider SDK (OpenAI) so it can be patched for tracing.
  registerInstrumentations({
    instrumentations: [new OpenAIInstrumentation()],
  });
  openAIInstrumentationRegistered = true;
}

// Fallback system prompt (used if LaunchDarkly is unavailable)
const FALLBACK_SYSTEM_PROMPT = `You are a helpful and friendly customer support bot for Career Stack, a comprehensive job search management platform. Your role is to assist users with questions about features, pricing, getting started, troubleshooting, and best practices.

## About Career Stack

Career Stack is a complete job search operating system designed to help professionals manage their entire job search pipeline from application to offer. It's built for professionals who take their career seriously and want to stay organized throughout their job search journey.

## Core Features

### 1. Application Tracker (Job Tracker)
- Google Sheets-style table interface for tracking all job applications
- Filter, search, and manage your entire pipeline with ease
- CSV import functionality - import jobs from Google Sheets or CSV files
- Inline editing - edit job information directly in the table
- Timeline view - see all application activity in chronological order
- Quick prep links - jump directly to company-specific prep documents
- Status tracking: Applied, Response, Interview, Offer, Rejected
- Track key information: Company, Job Title, Application Date, Contact Name, Response status, Phase, Next Steps

### 2. Company Prep Documents
- Create tailored preparation documents for each company
- Sidebar navigation for quick access to all sections during interviews
- Inline editing - edit any section directly on the page
- Structured sections include:
  - Company Summary
  - Why This Company
  - Product Pillars
  - Customer Profiles
  - Interview Questions
  - Tailored STAR Stories
  - Questions For Them
  - Prep Checklist

### 3. STAR Stories Library
- Build and organize behavioral interview stories
- Full Situation-Task-Action-Result (STAR) format
- Tagging system - organize stories by industry, category, and theme
- Grid and list views - toggle between viewing modes
- Quick copy - copy story summaries for easy pasting into prep docs
- Attach to jobs - link relevant stories to specific company prep documents

### 4. Analytics Dashboard
- Track application pipeline, response rates, and interview progress
- Pipeline metrics: Applications, Responses, Interviews, Offers
- Visual charts: Weekly pipeline trends, status breakdown, conversion rates
- Timeline velocity - see how long each stage takes
- Upcoming actions - never miss a follow-up
- Response rate tracking
- Interview rate tracking
- Average response time metrics

### 5. Master Prep Hub
- Centralized location for general interview preparation materials
- Personal narrative - your elevator pitch and background
- Question banks - common interview questions and your prepared answers
- STAR story shelf - quick access to all your stories
- Reusable content - pull content into company-specific prep docs

### 6. Home Dashboard
- Quick metrics: Applications, response rate, active interviews, follow-ups due
- Recent applications - see your latest job applications at a glance
- Upcoming actions - timeline of tasks and follow-ups
- Quick links - fast access to all major sections

## Key Benefits

- **Save Time**: No more switching between spreadsheets, notes, and documents. Everything you need is in one place.
- **Never Miss a Follow-up**: Automated reminders and timeline tracking ensure you stay on top of every opportunity.
- **Interview with Confidence**: Access your prep materials, STAR stories, and company research instantly during interviews.
- **Data-Driven Decisions**: Understand your response rates, identify what's working, and optimize your job search strategy.
- **Stay Organized**: Eliminate the chaos by giving you one place to manage everything—from the moment you apply to the final interview.

## Pricing

- **Free Plan**: Free forever for personal use
- No credit card required to get started
- Premium features available (contact support for enterprise pricing)

## Getting Started

1. Sign up for a free account (no credit card required)
2. Import your existing job applications via CSV or add them manually
3. Create company prep documents for your target companies
4. Build your STAR stories library
5. Start tracking your pipeline and analyzing your progress

## Technical Details

- Built with Next.js 14, TypeScript, and Tailwind CSS
- Modern, responsive web application
- Real-time updates and synchronization
- Secure and private - your data is yours

## Best Practices

- Update your application status regularly
- Create prep documents before interviews
- Build a comprehensive STAR stories library
- Review analytics weekly to optimize your approach
- Use the timeline view to stay on top of follow-ups

## Support Guidelines

- Be friendly, professional, and helpful
- Provide clear, concise answers
- If you don't know something, admit it and suggest contacting support
- Focus on helping users understand features and get value from the platform
- Encourage users to explore features and try things out
- For technical issues, suggest checking the documentation or contacting support

Remember: Job searching is stressful enough. Career Stack eliminates the chaos by giving users one place to manage everything—from the moment they apply to the final interview.`;

export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError: any) {
      console.error('Failed to parse request JSON:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: jsonError?.message },
        { status: 400 }
      );
    }
    
    const { messages, userContext, stream } = requestBody;
    // `stream=true` returns the assistant response incrementally (for a "typing" UI).

    // IMPORTANT: Replace this OpenAI API key with your actual OpenAI API key
    // Get your API key from: https://platform.openai.com/api-keys
    // Add it to your .env.local file as: OPENAI_API_KEY=your_api_key_here
    // Note: Even though we use LaunchDarkly AI Configs for prompt/model management,
    // OpenAI API calls still require your API key for authentication
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please add OPENAI_API_KEY to your .env.local file. LaunchDarkly AI Configs still require an OpenAI API key to make API calls.'
        },
        { status: 500 }
      );
    }

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    // Get LaunchDarkly server client
    let ldClient = null;
    try {
      ldClient = await getLDServerClient();
      if (ldClient) {
        console.log('LaunchDarkly server client initialized successfully');
      } else {
        console.warn('LaunchDarkly server client is null - will use fallback configuration');
      }
    } catch (ldInitError: any) {
      console.error('Failed to initialize LaunchDarkly server client:', ldInitError);
      console.error('LD Init error details:', {
        message: ldInitError?.message,
        stack: ldInitError?.stack,
      });
      // Continue with fallback configuration
    }

    // Register OpenAI instrumentation AFTER LaunchDarkly init and BEFORE importing the OpenAI SDK.
    // This enables LLM observability spans (prompt/response/latency/tokens) in LaunchDarkly Traces.
    if (ldClient) {
      ensureOpenAIInstrumentationRegistered();
    }

    // Import OpenAI after instrumentation has been registered so it can be patched.
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    let model = 'gpt-4o-mini';
    let temperature = 0.7;
    let maxTokens = 1000;
    let systemPrompt = FALLBACK_SYSTEM_PROMPT;
    let openaiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

    // Try to get AI Config from LaunchDarkly
    if (ldClient && userContext) {
      try {
        const ldContext = convertToLDContext(userContext);
        
        // Get AI Config variation
        // Replace 'jobs-os-basic-chatbot' with your actual AI Config key from LaunchDarkly
        // AI Configs are accessed via the variation method and return a structured config object
        const aiConfig = await Promise.resolve(ldClient.variation('jobs-os-basic-chatbot', ldContext, null));
        
        if (aiConfig && typeof aiConfig === 'object') {
          // AI Config returned as an object
          // Extract model information
          if (aiConfig.model) {
            // Model can be a string (model ID) or an object with id and parameters
            if (typeof aiConfig.model === 'string') {
              model = aiConfig.model;
            } else if (aiConfig.model.id) {
              model = aiConfig.model.id;
            }
            
            // Extract model parameters if available
            if (aiConfig.model.parameters) {
              temperature = aiConfig.model.parameters.temperature ?? temperature;
              maxTokens = aiConfig.model.parameters.max_tokens ?? maxTokens;
            }
          }
          
          // Extract messages from AI Config (includes system prompt)
          if (aiConfig.messages && Array.isArray(aiConfig.messages)) {
            // Convert AI Config messages to OpenAI format
            openaiMessages = aiConfig.messages.map((msg: any) => ({
              role: msg.role as 'system' | 'user' | 'assistant',
              content: msg.content || '',
            }));
            
            // Add user messages from the request
            const userMessages = messages.map((msg: { role: string; content: string }) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
            }));
            
            // Combine AI Config messages (system prompt) with conversation messages
            openaiMessages = [...openaiMessages, ...userMessages];
          } else if (aiConfig.systemPrompt || aiConfig.prompt) {
            // Fallback: use system prompt from AI Config if available
            systemPrompt = aiConfig.systemPrompt || aiConfig.prompt || FALLBACK_SYSTEM_PROMPT;
            
            // Build messages array with system prompt and user messages
            openaiMessages = [
              {
                role: 'system' as const,
                content: systemPrompt,
              },
              ...messages.map((msg: { role: string; content: string }) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
              })),
            ];
          } else {
            // AI Config structure not recognized, use fallback
            openaiMessages = [
              {
                role: 'system' as const,
                content: systemPrompt,
              },
              ...messages.map((msg: { role: string; content: string }) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
              })),
            ];
          }
        } else {
          // AI Config not available or null, use fallback
          openaiMessages = [
            {
              role: 'system' as const,
              content: systemPrompt,
            },
            ...messages.map((msg: { role: string; content: string }) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
            })),
          ];
        }
      } catch (aiConfigError: any) {
        console.error('Error getting AI Config from LaunchDarkly:', aiConfigError);
        console.error('AI Config error details:', {
          message: aiConfigError?.message,
          stack: aiConfigError?.stack,
          ldClient: ldClient ? 'exists' : 'null',
          userContext: userContext ? 'exists' : 'null',
        });
        // Fallback to default behavior
        openaiMessages = [
          {
            role: 'system' as const,
            content: systemPrompt,
          },
          ...messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ];
      }
    } else {
      // LaunchDarkly not available, use fallback
      openaiMessages = [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];
    }

    // Call OpenAI API.
    // Important: We fetch the AI Config first (model/prompt/params), then pass it into OpenAI.
    if (stream) {
      const completionStream = await openai.chat.completions.create({
        model: model,
        messages: openaiMessages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      const encoder = new TextEncoder();

      // We stream *plain text chunks* (not SSE) to keep the client simple: it just appends bytes to the message.
      return new Response(
        new ReadableStream<Uint8Array>({
          async start(controller) {
            try {
              for await (const part of completionStream) {
                const delta = part.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(delta));
                }
              }
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          },
        }
      );
    } else {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: openaiMessages,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const assistantMessage = completion.choices[0]?.message?.content;

      if (!assistantMessage) {
        return NextResponse.json(
          { error: 'No response from OpenAI' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: assistantMessage,
      });
    }
  } catch (error: any) {
    console.error('=== Chat API Error ===');
    console.error('Error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Error name:', error?.name);
    console.error('Error type:', typeof error);
    if (error?.response) {
      console.error('OpenAI API response error:', error.response);
    }
    console.error('=====================');
    
    return NextResponse.json(
      {
        error: 'Failed to get response from AI',
        details: error?.message || 'Unknown error',
        type: error?.name || 'UnknownError',
      },
      { status: 500 }
    );
  }
}

