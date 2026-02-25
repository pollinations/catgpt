import { API_CONFIG } from './config.js';

export function generateImageURL(prompt, uploadedImageUrl = null) {
    let imageParam;
    if (uploadedImageUrl) {
        imageParam = encodeURIComponent(`${API_CONFIG.ORIGINAL_CATGPT_IMAGE},${uploadedImageUrl}`);
    } else {
        imageParam = encodeURIComponent(API_CONFIG.ORIGINAL_CATGPT_IMAGE);
    }
    return `${API_CONFIG.POLLINATIONS_API}/${encodeURIComponent(prompt)}?height=1024&width=1024&enhance=true&model=gptimage&quality=high&image=${imageParam}`;
}

export async function fetchImageWithAuth(imageUrl) {
    const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.POLLINATIONS_API_KEY}`
        }
    });
    
    if (!response.ok) {
        let errorDetails = '';
        try {
            const responseText = await response.text();
            
            try {
                const errorData = JSON.parse(responseText);
                errorDetails = errorData.error?.message || JSON.stringify(errorData);
            } catch {
                errorDetails = responseText || `HTTP ${response.status}`;
            }
        } catch (e) {
            errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            details: errorDetails,
            url: imageUrl
        });
        
        throw new Error(`API_ERROR_${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
