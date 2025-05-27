
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contacts, message, location } = await req.json();
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured');
    }

    console.log('Sending emergency SMS to contacts:', contacts.length);

    const results = [];

    for (const contact of contacts) {
      const smsBody = `EMERGENCY ALERT: ${message}${location ? ` Location: https://maps.google.com/?q=${location.lat},${location.lng}` : ''}`;
      
      try {
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              From: twilioPhoneNumber,
              To: contact.phone,
              Body: smsBody,
            }),
          }
        );

        const result = await response.json();
        
        if (response.ok) {
          console.log(`SMS sent successfully to ${contact.name} at ${contact.phone}`);
          results.push({ contact: contact.name, status: 'sent', sid: result.sid });
        } else {
          console.error(`Failed to send SMS to ${contact.name}:`, result);
          results.push({ contact: contact.name, status: 'failed', error: result.message });
        }
      } catch (error) {
        console.error(`Error sending SMS to ${contact.name}:`, error);
        results.push({ contact: contact.name, status: 'error', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-emergency-sms function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
