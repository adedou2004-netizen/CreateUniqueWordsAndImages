import { supabase } from './supabase';

export interface StorageFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: {
        size: number;
        mimetype: string;
    };
}

/**
 * List all storage buckets
 */
export async function listBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    return data;
}

/**
 * List files in a bucket at a specific path
 */
export async function listFiles(bucket: string, path: string = '') {
    const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
        });

    if (error) throw error;
    return data as unknown as StorageFile[];
}

/**
 * Upload a file to a bucket
 */
export async function uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;
    return data;
}

/**
 * Delete a file from a bucket
 */
export async function deleteFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
    return data;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
