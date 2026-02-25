// API Client and Image Generation

import { API_CONFIG } from './config.js';

export function generateImageURL(prompt, uploadedImageUrl = null) {
    let imageParam;
    if (uploadedImageUrl) {
        imageParam = encodeURIComponent(`${API_CONFIG.ORIGINAL_CATGPT_IMAGE},${uploadedImageUrl}`);
    } else {
        imageParam = encodeURIComponent(API_CONFIG.ORIGINAL_CATGPT_IMAGE);
    }
    return `${API_CONFIG.POLLINATIONS_API}/${encodeURIComponent(prompt)}?model=nanobanana&image=${imageParam}&referrer=pollinations.github.io&quality=high`;
}

export async function fetchImageWithAuth(imageUrl) {
    const response = await fetch(imageUrl, {
        method: 'GET'
    });
    
    if (!response.ok) {
        let errorDetails = '';
        try {
            const errorData = await response.json();
            errorDetails = errorData.error?.message || JSON.stringify(errorData);
        } catch (e) {
            errorDetails = await response.text();
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
