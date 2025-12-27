// Apollo.io REST API integration for lead capture

interface ApolloContact {
  first_name?: string;
  last_name?: string;
  email: string;
  organization_name?: string;
  website_url?: string;
  label_names?: string[];
}

export async function submitToApollo(data: {
  email: string;
  name: string;
  software?: string | null;
  websiteUrl?: string | null;
}): Promise<boolean> {
  const apiKey = process.env.APOLLO_API_KEY;
  
  if (!apiKey) {
    console.log('[Apollo] No API key configured, skipping Apollo submission');
    return false;
  }

  try {
    // Parse name into first/last
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || data.name;
    const lastName = nameParts.slice(1).join(' ') || undefined;

    const contact: ApolloContact = {
      email: data.email,
      first_name: firstName,
      last_name: lastName,
      organization_name: data.name, // Use full name as org since it's "Organization" field
      website_url: data.websiteUrl || undefined,
      label_names: ['pixesci-pilot', 'website-signup'],
    };

    const response = await fetch('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      console.log('[Apollo] Contact created successfully');
      return true;
    } else {
      const errorData = await response.text();
      console.error('[Apollo] Failed to create contact:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('[Apollo] Error submitting to Apollo:', error);
    return false;
  }
}
